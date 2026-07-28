#!/usr/bin/env python3
"""Structural validation for the generated Divi layout.

A malformed Divi layout does not error on import — it imports and renders
wrong, which is far harder to debug. These checks catch the failure modes that
actually bite: unbalanced module nesting, a double quote inside a shortcode
attribute (Divi's parser truncates the attribute silently), raw square
brackets inside module content (parsed as a shortcode), and code modules whose
CSS is not wrapped in <style> tags.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, 'phoenix-drilling-divi.json')

# Modules that legitimately carry no closing tag are not used by the generator;
# everything it emits is a paired open/close.
TOKEN = re.compile(r'\[(/?)et_pb_([a-z_0-9]+)((?:\s[^\]]*)?)\]')

failures = []


def fail(msg):
    failures.append(msg)


payload = json.load(open(PATH))

# --- envelope ---------------------------------------------------------------
if payload.get('context') != 'et_builder':
    fail(f'context is {payload.get("context")!r}, expected "et_builder"')
for key in ('data', 'presets', 'global_colors', 'images', 'thumbnails'):
    if key not in payload:
        fail(f'envelope missing "{key}"')
if not isinstance(payload.get('data'), dict) or not payload['data']:
    fail('data must be a non-empty object keyed by post id')

shortcode = next(iter(payload['data'].values()))

# --- nesting ----------------------------------------------------------------
stack = []
counts = {}
for m in TOKEN.finditer(shortcode):
    closing, name, attr_str = m.group(1), m.group(2), m.group(3)
    if closing:
        if not stack:
            fail(f'closing [/et_pb_{name}] with nothing open')
        elif stack[-1] != name:
            fail(f'closing [/et_pb_{name}] but innermost open is [et_pb_{stack[-1]}]')
            stack.pop()
        else:
            stack.pop()
        continue

    stack.append(name)
    counts[name] = counts.get(name, 0) + 1

    # --- attribute quoting -------------------------------------------------
    # Every attribute must be key="value" with no bare double quote inside.
    if attr_str:
        stripped = attr_str.strip()
        # Strip well-formed pairs; anything left over is malformed.
        leftover = re.sub(r'[a-zA-Z_][a-zA-Z_0-9]*="[^"]*"\s*', '', stripped)
        if leftover.strip():
            fail(f'[et_pb_{name}] has malformed attributes near: {leftover[:60]!r}')

if stack:
    fail(f'unclosed modules: {stack}')

# --- content encoding -------------------------------------------------------
# Anything between a module open and its close must not contain raw [ or ],
# which Divi would try to parse as a nested shortcode.
for m in re.finditer(r'\[et_pb_(code|text|accordion_item)\s[^\]]*\](.*?)\[/et_pb_\1\]',
                     shortcode, re.S):
    name, body = m.group(1), m.group(2)
    if '[' in body or ']' in body:
        bad = body[max(0, body.find('[') - 30):body.find('[') + 30]
        fail(f'raw bracket inside et_pb_{name} content: {bad!r}')

# --- code modules must wrap CSS in <style> ---------------------------------
for m in re.finditer(r'\[et_pb_code\s[^\]]*\](.*?)\[/et_pb_code\]', shortcode, re.S):
    body = m.group(1)
    looks_like_css = re.search(r'\{[^}]*:\s*[^;}]+;', body) and '<style>' not in body
    if looks_like_css and '<svg' not in body and '<div' not in body:
        fail('code module contains bare CSS with no <style> wrapper')

# --- things that must be present -------------------------------------------
must_contain = {
    'stylesheet': '<style>',
    'icon sprite': 'phx-shield',
    'strata diagram': 'Coal measures',
    'contact form': 'et_pb_contact_form',
    'accordion': 'et_pb_accordion_item',
    'quote button': 'Request a Quote',
}
for label, needle in must_contain.items():
    if needle not in shortcode:
        fail(f'{label} missing from layout ({needle!r} not found)')

# --- report -----------------------------------------------------------------
print(f'file        {PATH}')
print(f'size        {round(os.path.getsize(PATH) / 1024)} KB')
print(f'modules     {sum(counts.values())} total')
for name in sorted(counts):
    print(f'            {counts[name]:3d}  et_pb_{name}')

if failures:
    print(f'\nFAILED ({len(failures)}):')
    for f in failures:
        print(f'  - {f}')
    sys.exit(1)

print('\nOK — envelope, nesting, attribute quoting and content encoding all valid.')
