import { PageHeader } from "@/components/landing/PageHeader";

const sections = [
  {
    title: "What We Collect",
    body: "When you claim a free trial or send us a message, we collect your name, email address, and anything you choose to tell us. That's it. We don't track you around the internet and we don't sell your data to anyone.",
  },
  {
    title: "How We Use It",
    body: "Your details are used to respond to your enquiry, book your trial, and — with your consent — keep you updated about Synergy classes and offers. Class bookings made through the Synergy app are handled by our booking partner under their own privacy terms.",
  },
  {
    title: "How Long We Keep It",
    body: "Enquiry data is kept only as long as needed to handle your request and manage your membership. Ask us to delete it at any time and we will.",
  },
  {
    title: "Your Rights",
    body: "You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete it. Email admin@synergygroupfitness.co.uk and we'll sort it.",
  },
  {
    title: "Cookies",
    body: "This site uses minimal cookies to function and to understand how visitors use it. You can manage or disable cookies through your browser settings at any time.",
  },
  {
    title: "Contact",
    body: "Questions about this policy or your data? Email admin@synergygroupfitness.co.uk or write to us at 35 West Bowling Green Street, Leith, Edinburgh EH6 5NX.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        kicker="Privacy Policy"
        title={"Your Data.\nRespected."}
        sub="Last updated August 2026. The short version: we collect the minimum, use it to help you train, and never sell it."
      />
      <section data-testid="privacy-body" className="px-6 md:px-12 pb-32 md:pb-40 max-w-4xl">
        <div className="border-t border-[#F4F4F0]/10">
          {sections.map((s, i) => (
            <div key={s.title} data-testid={`privacy-section-${i}`} className="grid grid-cols-12 gap-6 py-10 border-b border-[#F4F4F0]/10">
              <span aria-hidden="true" className="col-span-12 md:col-span-2 font-mono-accent text-xs text-[#4C63F5] pt-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-12 md:col-span-10">
                <h2 className="font-display font-semibold uppercase tracking-tight text-2xl text-[#F4F4F0]">
                  {s.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#F4F4F0]/65">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
