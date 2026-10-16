from fastapi import FastAPI, APIRouter, Header, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
TEAM_EMAIL = os.environ.get('TEAM_EMAIL')
ADMIN_KEY = os.environ.get('ADMIN_KEY')

if RESEND_API_KEY:
    import resend
    resend.api_key = RESEND_API_KEY

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LeadCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    message: Optional[str] = None
    source: str = "free_trial"


class Lead(LeadCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


def _team_email_html(lead: Lead) -> str:
    rows = "".join([
        f'<tr><td style="padding:8px 12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">{k}</td>'
        f'<td style="padding:8px 12px;color:#121212;font-size:14px">{v}</td></tr>'
        for k, v in [("Source", lead.source), ("Name", lead.name or "—"), ("Email", lead.email), ("Message", lead.message or "—")]
    ])
    return f'''<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:32px 0;font-family:Arial,sans-serif">
<tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2ddd2">
<tr><td style="background:#121212;padding:24px 32px"><span style="color:#f4f4f0;font-size:20px;font-weight:bold;letter-spacing:1px">SYNERGY<span style="color:#4C63F5">.</span></span></td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 16px;font-size:22px;color:#121212">New enquiry — {lead.source.replace("_", " ").title()}</h1>
<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2ddd2">{rows}</table></td></tr>
</table></td></tr></table>'''


def _user_email_html(lead: Lead) -> str:
    return f'''<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:32px 0;font-family:Arial,sans-serif">
<tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2ddd2">
<tr><td style="background:#121212;padding:24px 32px"><span style="color:#f4f4f0;font-size:20px;font-weight:bold;letter-spacing:1px">SYNERGY<span style="color:#4C63F5">.</span></span></td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 16px;font-size:22px;color:#121212">Your free week starts here.</h1>
<p style="color:#444;font-size:14px;line-height:1.6">Thanks for reaching out to Synergy Group Fitness. A coach from our Leith studio will be in touch shortly to get you booked in.</p>
<p style="color:#444;font-size:14px;line-height:1.6">In the meantime, download the Synergy app to browse the timetable and book your first class.</p>
<p style="color:#888;font-size:12px;margin-top:24px">35 West Bowling Green Street, Leith, Edinburgh EH6 5NX</p></td></tr>
</table></td></tr></table>'''


async def _send_lead_emails(lead: Lead):
    if not RESEND_API_KEY:
        logging.getLogger(__name__).info("RESEND_API_KEY not set — skipping email for lead %s", lead.id)
        return
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [TEAM_EMAIL],
            "subject": f"New {lead.source.replace('_', ' ')} enquiry — {lead.email}",
            "html": _team_email_html(lead),
        })
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [lead.email],
            "subject": "Your free week at Synergy starts here",
            "html": _user_email_html(lead),
        })
    except Exception as e:
        logging.getLogger(__name__).error("Failed to send lead emails: %s", e)


@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    _ = await db.leads.insert_one(doc)
    await _send_lead_emails(lead)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def get_leads(x_admin_key: Optional[str] = Header(None)):
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead['created_at'], str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads


# ---------------- Auth ----------------

JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie("access_token", create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", create_refresh_token(user_id), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


class RegisterInput(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginInput(BaseModel):
    email: EmailStr
    password: str


def public_user(doc: dict) -> dict:
    return {"id": doc["id"], "name": doc["name"], "email": doc["email"], "role": doc.get("role", "member"), "created_at": doc["created_at"]}


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def check_lockout(identifier: str):
    record = await db.login_attempts.find_one({"identifier": identifier})
    if record and record.get("attempts", 0) >= 5:
        locked_until = record.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")


async def record_failed_login(identifier: str):
    await db.login_attempts.update_one(
        {"identifier": identifier},
        {"$inc": {"attempts": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
        upsert=True,
    )


@api_router.post("/auth/register")
async def register(input: RegisterInput, response: Response):
    email = input.email.lower()
    if len(input.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = {
        "id": str(uuid.uuid4()),
        "name": input.name.strip(),
        "email": email,
        "password_hash": hash_password(input.password),
        "role": "member",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user)
    set_auth_cookies(response, user["id"], email)
    return public_user(user)


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower()
    identifier = f"{request.client.host}:{email}"
    await check_lockout(identifier)
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user or not verify_password(input.password, user["password_hash"]):
        await record_failed_login(identifier)
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, user["id"], email)
    return public_user(user)


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "logged_out"}


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await get_current_user(request)
    return public_user(user)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie("access_token", create_access_token(user["id"], user["email"]), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    return public_user(user)


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if not admin_email or not admin_password:
        return
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Synergy Admin",
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
