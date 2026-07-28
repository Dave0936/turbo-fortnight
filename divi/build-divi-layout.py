#!/usr/bin/env python3
"""Generate an importable Divi layout for the Phoenix Drilling landing page.

Why a Divi 4 shortcode payload rather than hand-written Divi 5 JSON
--------------------------------------------------------------------
Divi 5 stores page content as JSON blocks instead of shortcodes, but Elegant
Themes has not published that schema — there is no public spec to author
against, and a wrong guess produces a file that either fails to import or
imports as garbage.

What *is* documented is the conversion path: Divi 5's migrator converts every
core Divi module from shortcode format to the new structure, preserving
content and design settings. Only third-party modules fall back to the Divi 4
compatibility framework — and a single one of those forces the whole page to
load the legacy framework.

So this generator emits the stable, long-standing Divi portability envelope
containing core modules only. Divi 5 converts it to native D5 blocks on
import, and because nothing here is third-party, the page stays fully native
afterwards with no compatibility-framework penalty.

Module policy
-------------
Content lives in native Text modules. A Code module is used in exactly two
places, both because nothing else will do the job:

  1. The stylesheet and icon sprite — Divi requires CSS to be inside <style>
     tags, and only a Code module leaves them intact.
  2. The strata cross-section — a 1400x700 diagram whose markup the rich-text
     editor would mangle the first time someone opened the module.

Everything else — cards, stats, spec lists, illustrations, chrome — is a Text
module, editable in the builder like any other.

Run:  python3 build-divi-layout.py
Out:  phoenix-drilling-divi.json
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
BUILDER_VERSION = '4.27.4'


def enc(content):
    """Divi's shortcode parser treats square brackets as delimiters, so any
    bracket inside module content must be encoded. Divi writes the same
    encoding itself and decodes it on output."""
    return content.replace('[', '%91').replace(']', '%93')


def attrs(**kw):
    """Render shortcode attributes. Divi cannot parse a double quote inside an
    attribute value, so reject rather than emit something silently broken."""
    out = []
    for key, value in kw.items():
        value = str(value)
        if '"' in value:
            raise ValueError(f'double quote in attribute {key}: {value!r}')
        out.append(f'{key}="{value}"')
    return ' '.join(out)


def anim(delay=0):
    """Divi's native scroll animation, standing in for the static site's
    IntersectionObserver reveals. Divi honours prefers-reduced-motion itself."""
    return dict(animation_style='fade', animation_direction='bottom',
                animation_duration='650ms', animation_delay=f'{delay}ms',
                animation_intensity_fade='6%')


def section(inner, *, classes='phx', bg=None, padding='0px||0px||true|false', anchor=None):
    """anchor becomes the section's CSS ID, so the nav and hero links resolve
    the moment the layout is imported."""
    a = attrs(fb_built='1', _builder_version=BUILDER_VERSION,
              **({'background_color': bg} if bg else {}),
              custom_padding=padding,
              **({'module_id': anchor} if anchor else {}),
              module_class=classes, global_colors_info='{}')
    return f'[et_pb_section {a}]{inner}[/et_pb_section]'


def row(inner, *, layout='4_4', classes='phx-row', padding='0px||0px||false|false'):
    a = attrs(column_structure=layout, _builder_version=BUILDER_VERSION,
              width='100%', max_width='1280px', custom_padding=padding,
              module_class=classes, global_colors_info='{}')
    return f'[et_pb_row {a}]{inner}[/et_pb_row]'


def column(inner, *, ctype='4_4'):
    a = attrs(type=ctype, _builder_version=BUILDER_VERSION, custom_padding='|||',
              custom_padding__hover='|||', global_colors_info='{}')
    return f'[et_pb_column {a}]{inner}[/et_pb_column]'


def text(content, *, classes='', animate=None):
    """A native Divi Text module. This is the default for all content."""
    kw = dict(_builder_version=BUILDER_VERSION)
    if classes:
        kw['module_class'] = classes
    if animate is not None:
        kw.update(anim(animate))
    kw['global_colors_info'] = '{}'
    return f'[et_pb_text {attrs(**kw)}]{enc(content)}[/et_pb_text]'


def code(content, *, classes='', animate=None):
    """Reserved for the stylesheet and the strata diagram. See module policy."""
    kw = dict(_builder_version=BUILDER_VERSION)
    if classes:
        kw['module_class'] = classes
    if animate is not None:
        kw.update(anim(animate))
    kw['global_colors_info'] = '{}'
    return f'[et_pb_code {attrs(**kw)}]{enc(content)}[/et_pb_code]'


def button(label, url, *, classes):
    a = attrs(button_url=url, button_text=label, _builder_version=BUILDER_VERSION,
              custom_button='on', module_class=classes, global_colors_info='{}')
    return f'[et_pb_button {a}][/et_pb_button]'


def svg_body(name):
    """Inline an illustration. Stripping the XML wrapper and hard width/height
    lets it scale to its container; the viewBox carries the aspect ratio.
    Inlining also means the layout imports with no media-library dependency."""
    raw = open(os.path.join(REPO, 'assets', 'img', name)).read()
    raw = re.sub(r'<\?xml.*?\?>', '', raw, flags=re.S).strip()
    raw = re.sub(r'\swidth="\d+"\s+height="\d+"', '', raw, count=1)
    return raw.strip()


SPRITE = '''<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
<symbol id="phx-mark" viewBox="0 0 40 48" fill="none"><path d="M20 3c6 9 12 14 12 21a12 12 0 0 1-24 0c0-7 6-12 12-21Z" fill="currentColor"/><path d="M20 17c3 4.5 5.5 7 5.5 10.5a5.5 5.5 0 0 1-11 0C14.5 24 17 21.5 20 17Z" fill="#0e1113" opacity=".55"/><path d="M20 34v11M14 45h12" stroke="#eceef0" stroke-width="2.6" stroke-linecap="square"/></symbol>
<symbol id="phx-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>
<symbol id="phx-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></symbol>
<symbol id="phx-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="1"/><path d="m2 6.5 10 6.5 10-6.5"/></symbol>
<symbol id="phx-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></symbol>
<symbol id="phx-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.5 20 5.5v6.2c0 5-3.6 8.9-8 10.3-4.4-1.4-8-5.3-8-10.3V5.5Z"/><path d="m8.4 12 2.6 2.6L16 9.6" stroke-linecap="round"/></symbol>
<symbol id="phx-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.8 14.2 7 22l5-2.6 5 2.6-1.8-7.8" stroke-linecap="round"/></symbol>
<symbol id="phx-ground" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 12h28M2 20h28M2 27h28"/><path d="M16 3v22"/><path d="m12.5 6.5 3.5-3.5 3.5 3.5"/><path d="M11 25h10"/></symbol>
<symbol id="phx-rotary" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M16 2v13"/><path d="M11 15h10l-1.6 8.5a3.5 3.5 0 0 1-6.8 0Z"/><path d="M13.4 23.5 16 30l2.6-6.5" stroke-linecap="round"/><path d="M11 18.5h10M11.7 21.5h8.6"/></symbol>
<symbol id="phx-cable" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3 5 28M16 3l11 25M9.5 18h13"/><path d="M16 3v9"/><path d="M13 12h6v7h-6z"/><path d="M16 19v9"/></symbol>
<symbol id="phx-water" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M16 2.5c4.6 6.2 8 9.6 8 14a8 8 0 0 1-16 0c0-4.4 3.4-7.8 8-14Z"/><path d="M12.5 17.5a3.5 3.5 0 0 0 3.5 3.5" stroke-linecap="round"/><path d="M4 27h24" stroke-linecap="round"/></symbol>
<symbol id="phx-geo" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 9h28"/><path d="M9 9v13a3.5 3.5 0 0 0 7 0V9"/><path d="M20 9v9a3.5 3.5 0 0 0 7 0V9"/><path d="M16 2v7M16 2 13 5M16 2l3 3"/></symbol>
<symbol id="phx-mine" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10h28"/><path d="M8 10v18M24 10v18"/><path d="M8 17h16M8 24h16"/><path d="M12 10 16 3l4 7"/></symbol>
<symbol id="phx-crane" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 29h24"/><path d="M10 29V7h4v22"/><path d="M14 7h14M14 12h9"/><path d="M23 7v5"/><path d="M28 7v6l-2.5 3h5L28 13"/></symbol>
<symbol id="phx-turbine" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 29V16"/><path d="M12 29h8"/><path d="M16 16 5 12l11-9v13ZM16 16l11 5-12 5 1-10ZM16 16 8 27 3 17l13-1Z"/></symbol>
<symbol id="phx-drop" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M16 2.5c5 6.6 8.5 10.3 8.5 15a8.5 8.5 0 0 1-17 0c0-4.7 3.5-8.4 8.5-15Z"/></symbol>
<symbol id="phx-quarry" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 27h28"/><path d="m2 27 7-11 5 6 6-13 10 18"/><path d="m16 9 2.5 4"/></symbol>
<symbol id="phx-flask" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3v9L5.5 25a3 3 0 0 0 2.6 4.5h15.8a3 3 0 0 0 2.6-4.5L19 12V3"/><path d="M11 3h10"/><path d="M9.5 20h13"/></symbol>
<symbol id="phx-bridge" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17h28"/><path d="M2 24C2 15 8 9 16 9s14 6 14 15"/><path d="M9 17v11M16 9v19M23 17v11"/></symbol>
</svg>'''


def ico(name, cls='phx-ico'):
    c = f' class="{cls}"' if cls else ''
    return f'<svg{c} aria-hidden="true"><use href="#phx-{name}"/></svg>'


def head(num, eyebrow, title, lede=None):
    """Section head. The index numerals stay because the sections do run in a
    deliberate order the reader follows; they are not decoration."""
    out = [f'<p class="phx-eyebrow"><span class="num">{num}</span> {eyebrow}</p>',
           f'<h2>{title}</h2>']
    if lede:
        out.append(f'<p class="phx-lede">{lede}</p>')
    return ''.join(out)


parts = []

# ============================================================== assets =====
# The one unavoidable Code module: Divi requires CSS inside <style> tags, and
# only a Code module preserves them.
stylesheet = open(os.path.join(HERE, 'style.css')).read()
parts.append(section(row(column(code(f'<style>\n{stylesheet}\n</style>\n{SPRITE}'))),
                     classes='phx phx-assets'))

# ============================================================== topbar =====
topbar = (
    '<div class="phx-topbar">'
    f'<span>{ico("pin", "")} Livingston &middot; Inverness &middot; Aberdeen</span>'
    '<span class="sep hide-sm">/</span>'
    f'<a href="tel:+441506411448">{ico("phone", "")} 01506 411448</a>'
    '<span class="certs">ISO 9001 &middot; 14001 &middot; 45001</span>'
    '</div>'
)
parts.append(section(row(column(text(topbar))),
                     anchor='phx-top', classes='phx phx--deep phx-topbar-band', bg='#0e1113',
                     padding='6px||6px||true|false'))

# ============================================================== header =====
header_html = (
    '<div class="phx-headbar">'
    f'<a class="phx-brand" href="#phx-top">{ico("mark", "")}'
    '<span><span class="name">Phoenix</span>'
    '<span class="sub">Drilling &middot; Est. 2010</span></span></a>'
    '<nav class="phx-nav">'
    '<a href="#phx-services">Services</a>'
    '<a href="#phx-capability">Capability</a>'
    '<a href="#phx-sectors">Sectors</a>'
    '<a href="#phx-process">Process</a>'
    '<a href="#phx-projects">Projects</a>'
    '<a href="#phx-about">About</a>'
    '</nav></div>'
)
parts.append(section(
    row(column(text(header_html), ctype='3_4')
        + column(button('Request a Quote', '#phx-quote',
                        classes='phx-btn phx-btn--primary phx-btn--sm'), ctype='1_4'),
        layout='3_4,1_4', classes='phx-row phx-header-row',
        padding='10px||10px||false|false'),
    classes='phx phx--deep phx-header', bg='#0e1113',
    padding='0px||0px||true|false'))

# ================================================================ hero =====
hero_copy = (
    '<p class="phx-eyebrow">Specialist drilling contractor &middot; West Lothian</p>'
    '<h1 class="phx-hero__title">Ground investigation, water and <em>geothermal</em> drilling.</h1>'
    '<p class="phx-hero__lede">From our yard in Livingston we put rigs and crews on sites the '
    'length of the UK &mdash; for the consultants, contractors and developers who need the '
    'ground answered properly, first time, and on programme.</p>'
)
stats = (
    '<div class="phx-stats">'
    '<div class="phx-stat"><b>2010</b><i>Drilling since</i></div>'
    '<div class="phx-stat"><b>3</b><i>ISO systems certified</i></div>'
    '<div class="phx-stat"><b>3</b><i>Offices across Scotland</i></div>'
    '<div class="phx-stat"><b><span>UK</span></b><i>Nationwide coverage</i></div>'
    '</div>'
)
parts.append(section(
    row(column(text(f'<div class="phx-hero__bg" aria-hidden="true">{svg_body("hero-rig.svg")}</div>',
                    classes='phx-hero-bg-module')),
        classes='phx-row phx-hero-bg-row')
    + row(column(text(hero_copy, animate=0)))
    + row(column(button('Request a Quote', '#phx-quote', classes='phx-btn phx-btn--primary')
                 + button('01506 411448', 'tel:+441506411448', classes='phx-btn phx-btn--ghost')),
          classes='phx-row phx-hero-actions', padding='28px||0px||false|false')
    + row(column(text(stats, animate=200))),
    classes='phx phx--deep phx-hero', bg='#0e1113',
    padding='150px||0px||true|false'))

# ========================================================= credentials =====
creds = (
    '<div class="phx-creds">'
    '<p class="phx-creds__intro">Certified &amp; accredited</p>'
    f'<span class="phx-cred">{ico("shield")} ISO 9001 <small>Quality</small></span>'
    f'<span class="phx-cred">{ico("shield")} ISO 14001 <small>Environment</small></span>'
    f'<span class="phx-cred">{ico("shield")} ISO 45001 <small>Health &amp; safety</small></span>'
    f'<span class="phx-cred">{ico("badge")} Well Drillers <small>Association member</small></span>'
    '</div>'
)
parts.append(section(row(column(text(creds))),
                     classes='phx phx--deep phx-creds-band', bg='#0e1113',
                     padding='28px||28px||true|false'))

# ============================================================ services =====
SERVICES = [
    ('ground', 'Ground Investigation',
     'Geotechnical and geoenvironmental investigation for design, remediation and due diligence.',
     ['Logging and disturbed &amp; undisturbed sampling', 'In-situ testing, including SPT',
      'Standpipes, gas and groundwater monitoring wells']),
    ('rotary', 'Rotary &amp; Core Drilling',
     'Open hole and cored drilling at varying diameters, matched to the ground and the data you need.',
     ['Conventional and triple-tube coring', 'Air, water, polymer and mud flush',
      'Deep holes and large diameters']),
    ('cable', 'Cable Percussion &amp; Sampling',
     "The UK's workhorse technique for site investigation in soils, plus the lighter methods for tight plots.",
     ['Dando 4000, 2000 and 150 rigs', 'Edeco-Pilcon 2000', 'Window sampling and trial pitting']),
    ('water', 'Water Extraction Boreholes',
     'Private water supply for farms, estates, distilleries, greenkeeping and industrial process.',
     ['Siting through to drilling and installation', 'Casing, screening and headworks',
      'Test pumping and de-watering wells']),
    ('geo', 'Geothermal &amp; Ground Source',
     'Vertical boreholes for ground source heat pump schemes, domestic through to commercial arrays.',
     ['Closed-loop arrays, drilled and grouted', 'Open-loop abstraction and reinjection wells',
      'Loop installation and manifold connection']),
    ('mine', 'Mining Legacy &amp; Specialist',
     'The awkward work &mdash; old workings, water, and sites you cannot simply drive a rig onto.',
     ['Disused mineral workings and mine shafts', 'Mineral investigation and quarry development',
      'Nearshore and over-water drilling']),
]


def service_card(icon, title, blurb, bullets):
    lis = ''.join(f'<li>{b}</li>' for b in bullets)
    return (f'<div class="phx-service">{ico(icon)}<h3>{title}</h3>'
            f'<p>{blurb}</p><ul>{lis}</ul></div>')


svc_rows = []
for i in range(0, 6, 3):
    cols = ''.join(column(text(service_card(*s), animate=n * 100), ctype='1_3')
                   for n, s in enumerate(SERVICES[i:i + 3]))
    svc_rows.append(row(cols, layout='1_3,1_3,1_3', padding='0px||28px||false|false'))
parts.append(section(
    row(column(text(head('01', 'Services', 'Six ways we get you an answer out of the ground.',
                         'Whether the question is a foundation design, a mine shaft, a farm&rsquo;s water '
                         'supply or a heat pump array, the method changes but the standard does not.'),
                    animate=0)),
        padding='0px||70px||false|false')
    + ''.join(svc_rows),
    anchor='phx-services', classes='phx phx--light phx-services phx-equal', bg='#eceef0',
    padding='110px||110px||true|false'))

# =============================================================== depth =====
# The second and last Code module: a 1400x700 diagram the rich-text editor
# would mangle on first open. Lifted verbatim so it stays identical to the
# static site.
site = open(os.path.join(REPO, 'index.html')).read()
figure = re.search(r'(<svg viewBox="0 0 1400 700".*?</svg>)', site, re.S).group(1)
figure = figure.replace('class="depth-anno"', 'class="phx-anno"')
legend_src = re.search(r'<ol class="depth__legend reveal">(.*?)</ol>', site, re.S).group(1)
legend = ('<ul class="phx-legend">' + re.sub(
    r'<li class="depth__item">\s*<span class="depth__depth">(.*?)</span>\s*'
    r'<span class="depth__strata">(.*?)</span>\s*<span class="depth__method">(.*?)</span>\s*</li>',
    lambda m: f'<li><b>{m.group(1)}</b><strong>{m.group(2)}</strong><span>{m.group(3)}</span></li>',
    legend_src, flags=re.S).strip() + '</ul>')

parts.append(section(
    row(column(text(head('02', 'Down the hole', 'Every metre asks for a different technique.',
                         'A single borehole can pass through five kinds of ground before it finishes. '
                         'Choosing the wrong method at the wrong depth is how programmes slip. This is '
                         'the sequence we plan for.'), animate=0)),
        padding='0px||70px||false|false')
    + row(column(code(f'<div class="phx-depth">{figure}{legend}</div>', animate=100))),
    classes='phx phx-depth-band', bg='#16191c',
    padding='110px||110px||true|false'))

# ========================================================== capability =====
SPEC = [
    ('Cable percussive', 'Dando 4000, 2000 &amp; 150, Edeco-Pilcon 2000'),
    ('Rotary', 'Open hole, conventional and triple-tube coring'),
    ('Flush media', 'Air, water, polymer and mud'),
    ('Sampling', 'Window sampling, trial pitting, SPT, U100'),
    ('Access', 'Tracked and restricted-access rigs for tight plots'),
    ('Over water', 'Nearshore drilling from floating plant'),
    ('Installations', 'Standpipes, monitoring wells, geothermal loops, headworks'),
]
spec_html = '<ul class="phx-spec">' + ''.join(
    f'<li><b>{k}</b><span>{v}</span></li>' for k, v in SPEC) + '</ul>'
cap_copy = (
    head('03', 'Plant &amp; capability', 'Our own rigs. Our own crews.')
    + '<p>Phoenix runs its fleet in-house rather than subcontracting it out. That is not a boast '
      'about kit &mdash; it is the reason we can commit to a start date and hold it, put the right '
      'rig on the right hole rather than the one that happens to be free, and keep the same crew '
      'on your site from set-up to demobilisation.</p>'
)
parts.append(section(
    row(column(text(f'<div class="phx-figure">{svg_body("rig-rotary.svg")}</div>', animate=0), ctype='1_2')
        + column(text(cap_copy, animate=100) + text(spec_html, animate=150), ctype='1_2'),
        layout='1_2,1_2'),
    anchor='phx-capability', classes='phx phx--light phx-capability', bg='#eceef0',
    padding='110px||110px||true|false'))

# ============================================================= sectors =====
SECTORS = [
    ('crane', 'Construction &amp; Civils',
     'Site investigation for foundation design, earthworks and remediation, from single plots to major schemes.'),
    ('turbine', 'Renewable Energy',
     'Turbine base and cable route investigation, plus geothermal boreholes for heat pump schemes.'),
    ('drop', 'Water Supply',
     'Private supply for farms, estates, distilleries, golf courses and industrial process water.'),
    ('quarry', 'Mining &amp; Quarrying',
     'Mineral investigation, quarry development, disused workings, shaft location and de-watering.'),
    ('flask', 'Environmental Consultancy',
     'Geoenvironmental sampling, gas and groundwater monitoring installations, long-term monitoring rounds.'),
    ('bridge', 'Infrastructure',
     'Road, rail, bridge and utility corridors, including restricted-access and over-water positions.'),
]
sec_rows = []
for i in range(0, 6, 3):
    cols = ''.join(
        column(text(f'<div class="phx-sector">{ico(ic)}<div><h3>{t}</h3><p>{d}</p></div></div>',
                    animate=n * 100), ctype='1_3')
        for n, (ic, t, d) in enumerate(SECTORS[i:i + 3]))
    sec_rows.append(row(cols, layout='1_3,1_3,1_3'))
parts.append(section(
    row(column(text(head('04', 'Sectors', 'Who we drill for.',
                         'Most of our work comes through geotechnical consultants and main contractors, '
                         'but the rig does not care who is paying &mdash; only that the hole is right.'),
                    animate=0)),
        padding='0px||70px||false|false')
    + ''.join(sec_rows),
    anchor='phx-sectors', classes='phx phx-sectors', bg='#16191c',
    padding='110px||110px||true|false'))

# ============================================================= process =====
STEPS = [
    ('Enquiry &amp; scope', 'You send the specification, or a sketch and a postcode. We come back with method, duration and price.'),
    ('Desk study &amp; permits', 'Services search, access review, and the consents the site needs before a rig turns a wheel.'),
    ('Mobilisation', 'RAMS issued and agreed, plant and crew allocated, set-up on an agreed date rather than a hopeful one.'),
    ('Drilling &amp; sampling', 'Holes advanced, samples taken and protected, installations placed, daily records kept as we go.'),
    ('Records &amp; handover', "Driller's logs, installation details and photographs issued in the format your engineer works in."),
]
step_cols = ''.join(
    column(text(f'<div class="phx-step"><b>0{n}</b><h3>{t}</h3><p>{d}</p></div>',
                animate=(n - 1) * 80), ctype='1_5')
    for n, (t, d) in enumerate(STEPS, 1))
parts.append(section(
    row(column(text(head('05', 'How we work', 'Five steps, and no surprises in the middle of them.'),
                    animate=0)),
        padding='0px||70px||false|false')
    + row(step_cols, layout='1_5,1_5,1_5,1_5,1_5'),
    anchor='phx-process', classes='phx phx--light phx-process', bg='#eceef0',
    padding='110px||110px||true|false'))

# ============================================================ projects =====
# PLACEHOLDER PROJECTS — representative of the type of work described in the
# company's public material, not specific jobs, and carrying no client names.
# Replace with real, client-approved projects before launch.
PROJECTS = [
    ('core-samples.svg', 'Ground investigation', 'Brownfield site over historic workings',
     ['Central Belt', 'Residential'],
     'Cable percussion through made ground and till, then triple-tube coring to prove the condition '
     'of shallow coal workings beneath the development footprint. Gas and groundwater monitoring '
     "wells left in place for the consultant's monitoring rounds."),
    ('water-borehole.svg', 'Water supply', 'Private supply borehole for a rural estate',
     ['Highlands', 'Agricultural'],
     'Sited, drilled and cased into a bedrock aquifer to take the property off a failing spring '
     'supply. Screened, developed and test pumped, with headworks and rising main installed ready '
     'for the treatment kit.'),
    ('geothermal.svg', 'Geothermal', 'Closed-loop array for a new-build scheme',
     ['East of Scotland', 'Commercial'],
     'A grid of vertical boreholes drilled, loops installed and grouted, then headed up to a '
     "manifold for the incoming heat pump plant &mdash; sequenced around the main contractor's "
     'groundworks programme.'),
]
proj_cols = ''.join(
    column(text(
        f'<div class="phx-project"><div class="phx-project__media">{svg_body(img)}'
        f'<span class="phx-project__tag">{tag}</span></div>'
        f'<div class="phx-project__body"><h3>{title}</h3>'
        f'<p class="phx-project__meta">{"".join(f"<span>{m}</span>" for m in meta)}</p>'
        f'<p>{body}</p></div></div>', animate=n * 100), ctype='1_3')
    for n, (img, tag, title, meta, body) in enumerate(PROJECTS))
parts.append(section(
    row(column(text(head('06', 'Selected work', 'Representative projects.',
                         'A cross-section of the work: a brownfield investigation over old workings, '
                         'a private water supply, and a closed-loop array under a new building.'),
                    animate=0)),
        padding='0px||70px||false|false')
    + row(proj_cols, layout='1_3,1_3,1_3'),
    anchor='phx-projects', classes='phx phx--deep phx-projects phx-equal', bg='#0e1113',
    padding='110px||110px||true|false'))

# ============================================================ coverage =====
OFFICES = [
    ('Livingston', 'Head office',
     '2 Nairn Road, Livingston, West Lothian EH54 8AY<br>'
     '<a href="tel:+441506411448">01506 411448</a> &middot; '
     '<a href="mailto:info@phoenixdrilling.co.uk">info@phoenixdrilling.co.uk</a>'),
    ('Inverness', 'Highlands', 'Covering the Highlands, Moray and the west coast.'),
    ('Aberdeen', 'North-east', 'Covering Aberdeenshire, Angus and the north-east.'),
    ('Nationwide', 'England &amp; Wales',
     'Rigs and crews mobilise across the UK for programmes that justify the travel.'),
]
offices_html = ''.join(
    f'<div class="phx-office"><h3>{name} <span>{label}</span></h3><p>{body}</p></div>'
    for name, label, body in OFFICES)
parts.append(section(
    row(column(text(head('07', 'Where we work', 'Livingston at the centre of it.',
                         'Our head office and yard sit in West Lothian, halfway between Edinburgh and '
                         'Glasgow and inside an hour of most of the Central Belt. Offices in Inverness '
                         'and Aberdeen cover the north and north-east, and we mobilise UK-wide.'),
                    animate=0)),
        padding='0px||70px||false|false')
    + row(column(text(f'<div class="phx-figure">{svg_body("coverage-map.svg")}</div>', animate=0), ctype='1_2')
          + column(text(offices_html, animate=100), ctype='1_2'),
          layout='1_2,1_2'),
    anchor='phx-about', classes='phx phx-coverage', bg='#16191c',
    padding='110px||110px||true|false'))

# ================================================================= FAQ =====
FAQ = [
    ('How quickly can you get a rig on site?',
     'It depends on the rig and the season &mdash; cable percussion in the Central Belt is usually a '
     'shorter wait than a rotary spread going north. Tell us your target start date in the enquiry '
     'and we will tell you honestly whether we can hold it, rather than book it and slip.'),
    ('What access does a rig need?',
     'A cable percussion rig needs a reasonably level working area and a route in for a 4x4 and '
     'trailer. Restricted-access and tracked rigs get through gateways, side paths and into '
     'buildings where a standard spread cannot. Send photographs of the access with your enquiry '
     'and we will tell you what will fit.'),
    ('Do I need a licence for a water borehole?',
     'In Scotland, abstracting groundwater is regulated by SEPA under the Controlled Activities '
     'Regulations, and the level of authorisation depends on how much you intend to take. England '
     'and Wales work differently again. We will tell you which regime applies to your site and what '
     'has to be in place before we drill.'),
    ('What does a borehole cost?',
     'Depth, diameter, ground conditions, access and the number of positions all move the figure, so '
     'anyone quoting a rate before seeing the scope is guessing. Send the specification or a '
     'description of what you need and you will get a proper breakdown, not a range.'),
    ('What do we receive at the end?',
     "Driller's logs, sample schedules, installation and backfill details, in-situ test results and "
     'site photographs, issued in the format your engineer works in. Samples are delivered to the '
     'laboratory of your choosing.'),
    ('Do you work outside Scotland?',
     'Yes. Livingston is the head office and yard, with Inverness and Aberdeen covering the north, '
     'but rigs and crews mobilise across the UK where the programme justifies it. Distance affects '
     'mobilisation cost, not whether we will come.'),
]
faq_items = ''.join(
    '[et_pb_accordion_item title="{}" _builder_version="{}" open="off" global_colors_info="{{}}"]{}[/et_pb_accordion_item]'.format(
        q.replace('&mdash;', '-').replace('"', "'"), BUILDER_VERSION, enc(f'<p>{a}</p>'))
    for q, a in FAQ)
accordion = ('[et_pb_accordion ' + attrs(_builder_version=BUILDER_VERSION,
                                         module_class='phx-faq', global_colors_info='{}')
             + ']' + faq_items + '[/et_pb_accordion]')
parts.append(section(
    row(column(text(head('08', 'Common questions', 'Before you send the enquiry.'), animate=0)),
        padding='0px||70px||false|false')
    + row(column(accordion)),
    classes='phx phx--light phx-faq-band', bg='#eceef0',
    padding='110px||110px||true|false'))

# =============================================================== quote =====
def field(fid, title, *, ftype='input', required='on', fullwidth='off', options=None):
    kw = dict(field_id=fid, field_title=title, field_type=ftype,
              required_mark=required, fullwidth_field=fullwidth,
              _builder_version=BUILDER_VERSION, global_colors_info='{}')
    if options:
        # Divi stores repeatable field options percent-encoded so the shortcode
        # parser leaves the brackets and quotes alone.
        payload = ','.join(
            '{%22value%22:%22' + o + '%22,%22checked%22:0,%22dragID%22:%22-1%22}'
            for o in options)
        kw['select_options'] = '%91' + payload + '%93'
    return '[et_pb_contact_field ' + attrs(**kw) + '][/et_pb_contact_field]'


SERVICE_OPTIONS = ['Ground investigation', 'Rotary and core drilling',
                   'Cable percussion and sampling', 'Water extraction borehole',
                   'Geothermal / ground source', 'Mining legacy and specialist',
                   'Not sure - please advise']

form = ('[et_pb_contact_form ' + attrs(
    email='info@phoenixdrilling.co.uk', title='',
    custom_message='Service: %%Service%% || Site: %%Location%% || Scope: %%Scope%% || Details: %%Details%%',
    submit_button_text='Send Enquiry', _builder_version=BUILDER_VERSION,
    module_class='phx-form', global_colors_info='{}') + ']'
    + field('Name', 'Name')
    + field('Company', 'Company', required='off')
    + field('Email', 'Email', ftype='email')
    + field('Phone', 'Phone', required='off')
    + field('Service', 'Service required', ftype='select', fullwidth='on', options=SERVICE_OPTIONS)
    + field('Location', 'Site location or postcode')
    + field('Scope', 'Depths and number of positions', required='off')
    + field('Details', 'Details', ftype='text', fullwidth='on')
    + '[/et_pb_contact_form]')

quote_aside = (
    head('09', 'Request a quote', 'Tell us about the hole.')
    + '<p class="phx-muted">The more you can give us &mdash; specification, depths, number of '
      'positions, access photographs &mdash; the tighter the price comes back. If it is easier to '
      'talk it through, phone the office and you will get a driller, not a call centre.</p>'
)
contact_direct = (
    '<div class="phx-contact-direct">'
    f'<a href="tel:+441506411448">{ico("phone", "")} 01506 411448</a>'
    f'<a href="mailto:info@phoenixdrilling.co.uk">{ico("mail", "")} info@phoenixdrilling.co.uk</a>'
    '<p class="phx-small">2 Nairn Road, Livingston, West Lothian EH54 8AY<br>'
    'Monday to Friday, 8am &ndash; 5pm</p></div>'
)
parts.append(section(
    row(column(text(quote_aside, animate=0) + text(contact_direct, animate=80), ctype='1_2')
        + column(form, ctype='1_2'),
        layout='1_2,1_2'),
    anchor='phx-quote', classes='phx phx--deep phx-quote', bg='#0e1113',
    padding='110px||110px||true|false'))

# ============================================================== footer =====
FOOT_SERVICES = ['Ground investigation', 'Rotary &amp; core drilling', 'Cable percussion',
                 'Water boreholes', 'Geothermal']
FOOT_COMPANY = [('Capability', '#phx-capability'), ('Sectors', '#phx-sectors'),
                ('How we work', '#phx-process'), ('Projects', '#phx-projects'),
                ('Coverage', '#phx-about')]
foot_brand = (
    '<div class="phx-footer-brand">'
    f'<a class="phx-brand" href="#phx-top">{ico("mark", "")}'
    '<span><span class="name">Phoenix</span>'
    '<span class="sub">Drilling &middot; Est. 2010</span></span></a>'
    '<p>Ground investigation, water extraction and geothermal drilling, delivered UK-wide '
    'with our own rigs and crews from Livingston, West Lothian.</p></div>'
)
foot_services = ('<div class="phx-footcol"><h4>Services</h4><ul>'
                 + ''.join(f'<li><a href="#phx-services">{s}</a></li>' for s in FOOT_SERVICES)
                 + '</ul></div>')
foot_company = ('<div class="phx-footcol"><h4>Company</h4><ul>'
                + ''.join(f'<li><a href="{h}">{t}</a></li>' for t, h in FOOT_COMPANY)
                + '</ul></div>')
foot_contact = (
    '<div class="phx-footcol"><h4>Contact</h4><ul>'
    '<li>2 Nairn Road, Livingston<br>West Lothian EH54 8AY</li>'
    '<li><a href="tel:+441506411448">01506 411448</a></li>'
    '<li><a href="mailto:info@phoenixdrilling.co.uk">info@phoenixdrilling.co.uk</a></li>'
    '<li><a href="#phx-quote">Request a quote</a></li></ul></div>'
)
foot_bottom = (
    '<div class="phx-footbottom">'
    '<span>&copy; 2026 Phoenix Drilling Ltd &middot; Registered in Scotland SC370985</span>'
    '<span>ISO 9001 &middot; ISO 14001 &middot; ISO 45001</span>'
    '<span><a href="#phx-top">Back to top</a></span></div>'
)
parts.append(section(
    # Four equal columns: 4 x 20.875% plus 3 x 5.5% gutters is exactly 100%.
    # A 2_5,1_5,1_5,1_5 mix overflows once Divi's gutters are added and wraps
    # the last column onto its own line.
    row(column(text(foot_brand), ctype='1_4') + column(text(foot_services), ctype='1_4')
        + column(text(foot_company), ctype='1_4') + column(text(foot_contact), ctype='1_4'),
        layout='1_4,1_4,1_4,1_4', padding='0px||28px||false|false')
    + row(column(text(foot_bottom))),
    classes='phx phx--deep phx-footer', bg='#0e1113',
    padding='90px||40px||true|false'))

shortcode = ''.join(parts)

payload = {
    'context': 'et_builder',
    'data': {'1': shortcode},
    'presets': {},
    'global_colors': [],
    'images': {},
    'thumbnails': [],
}

out_path = os.path.join(HERE, 'phoenix-drilling-divi.json')
with open(out_path, 'w') as fh:
    json.dump(payload, fh, ensure_ascii=False)

from collections import Counter
mix = Counter(re.findall(r'\[et_pb_([a-z_0-9]+)(?=[\s\]])', shortcode))
print(f'written {out_path} — {round(os.path.getsize(out_path)/1024)} KB')
print(f'shortcode {round(len(shortcode)/1024)} KB')
print('module mix:', dict(sorted(mix.items(), key=lambda kv: -kv[1])))
