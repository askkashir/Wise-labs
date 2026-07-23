# WISE Lab — make the Incubation Application REACHABLE + field-accurate

You are working in `/home/dns/Desktop/Wise-labs` (GitHub `askkashir/Wise-labs`), branch
`fix/wiselab-follow-ups` (PR #2 open, not merged). The owner cannot find the actual incubation
application on the site and is frustrated. **The root cause:** the real "WISE Lab — Women Innovation
and Startup Empowerment Application Form" (the incubation/startup application) is implemented as the
**"Founder Flightpath"** form at route **`/apply/founder`** — but nothing on the site tells a user that
Founder Flightpath = the incubation application, and the path to reach it is not obvious. Fix the
reachability/labeling first (the loud complaint), then verify the form's fields exactly match the source
document, then make sure it works and is translated.

Do everything yourself, sequentially. Read a file before editing. Re-verify after each change.
Do NOT change form-schema identifier values (`field.name`, `column.key`, `analytics.dimension`) — those
are stable analytics keys. Don't touch the palette/fonts/Hero3D. Keep translations in all 4 locales.

---

## PART 1 — MAKE THE APPLICATION UNMISSABLE & REACHABLE (primary fix)

Goal: a first-time visitor landing on `/` can reach the incubation application in **≤2 clicks from the
top of the page**, and clearly understands that's "the application."

1. **Label it as the incubation application.** In `src/lib/forms/schemas/founder.ts` the meta title is an
   i18n key (`forms.founder.meta.title`). Update the ENGLISH value in `src/i18n/locales/en.json` (and
   translate in ur/ps/pa) so the Founder apply page reads clearly as the incubation application — e.g.
   title "WISE Incubation Application — Founder Flightpath" and a subtitle that says this is the startup
   incubation application form. Also, on the Enter-the-Lab **Founder card** (`src/sections/EnterTheLab.tsx`,
   `enterTheLab.pillars.founder.*`) make it obvious this card leads to the incubation application (e.g. add
   "Incubation Application" as the eyebrow/kicker or in the body), so users recognize it from the document.

2. **Verify (and fix) the click-path from the header.** Trace/click each of these and confirm they land
   somewhere that leads to the application:
   - Header **"Enter the Lab"** CTA button and the **hero** primary CTA. Today they likely scroll to
     `#enter-the-lab`. Confirm that section's **Founder card CTA actually navigates to `/apply/founder`**
     (a real `<Link to="/apply/founder">`, not a dead `#` anchor). Fix if broken.
   - Nav item **"Enter the Lab"** → `#enter-the-lab` anchor exists and scrolls correctly.
   If the header CTA only scrolls and the card only scrolls, the user can get stuck — ensure the chain
   header CTA → Enter the Lab section → Founder card → `/apply/founder` is unbroken and obvious.

3. **Add a real `/apply` chooser (no more silent redirect).** Currently `/apply` with no track and
   `/apply/<bad-track>` redirect to `/` with no explanation (confirm in `src/pages/ApplyPage.tsx`). Change
   the no-track case (`/apply`) to render a **clean chooser page** listing the four tracks (Founder /
   Enterprise / Mentor / Partner) with the Founder/incubation application presented first and clearly as
   the primary application. Keep the invalid-track case redirecting to this chooser (or to `/`) — but never
   a blank screen. Reuse existing tokens + the `enterTheLab.pillars.*` i18n copy so it's translated for free.

4. **Apply Now launcher = present everywhere, Founder first.** Confirm `ApplyNowButton` (wired in
   `src/AppRouter.tsx`) is visible on all public routes (`/`, `/blog`, `/blog/:slug`, and the four
   `/apply/*` pages) and hidden only on `/admin/*`. Its menu must list Founder (incubation) first and each
   entry must navigate to the right `/apply/<track>`. This is the always-available path to the application.

5. **Prove it with the browser.** `npm run dev`, then with Playwright: from `/`, reach `/apply/founder`
   via (a) the header "Enter the Lab" CTA → Founder card, (b) the Apply Now launcher, and (c) directly at
   `/apply`. All three must land on the incubation application and render it fully. Repeat the check with
   the language switched to اردو to confirm the labels/CTAs are translated on the whole path.

**Gate: the incubation application is reachable in ≤2 clicks from the top of `/`, clearly labeled, via
header CTA, Apply Now launcher, and `/apply` chooser — in all 4 languages.**

---

## PART 2 — VERIFY THE FORM IS FIELD-FOR-FIELD FAITHFUL TO THE SOURCE DOCX

The source document (`WISE_Incubation_Application_Form.docx`) contains EXACTLY the following. Read
`src/lib/forms/schemas/founder.ts` in full and confirm every item below exists, in this order. Fix any
drift (missing field, wrong option, wrong order) WITHOUT changing `field.name`/`analytics.dimension`.

**Startup basics**
- Startup Name (text)
- Business / Innovation Vertical (select one): E-Commerce / Online Store · Fashion & Apparel · Beauty,
  Wellness & Personal Care · Food & Beverages / Home-Based Food Business · Handicrafts / Artisanal Products
  · Education & Training (EdTech, Skills, Tutoring) · Health & Wellness (HealthTech, Fitness, Nutrition) ·
  Social Enterprise / Community Impact · Creative Industries (Design, Content, Photography, Crafts) ·
  Services (Event Management, Marketing, Consultancy) · **Others: ____**
- Startup Stage (select): Idea · Prototype · MVP · Established Product / Services · **Others: ____**
- Startup Establishment Year (number/year)

**Idea Overview** (all textareas)
- Idea Brief
- Product / Service Description
- Value Proposition — What problem are you solving and how is your solution unique?
- Target Market (who will buy your product/service?)
- Customers (your ideal audience)
- Competition — How are you different from others in the market?
- Core Strength / Innovation (what makes your business special?)
- Marketing and Sales Strategy
- Online Presence (Website / Facebook / Instagram / TikTok / Other) (text)
- Revenue Streams — How does your business make money?

**Team Details** — a repeating table with columns: Name · Role · Qualification · Skillset / Expertise ·
City · Age (at least one row required)

**Previous Experience**
- Have you launched or managed a business before? (Yes/No) → if Yes: "name of previous business/startup" (text)
- Have you been part of any incubation or training program before? (Yes/No) → if Yes: "please provide details" (textarea)

**Availability**
- Will you be available for the next full year to incubate your startup at WISE Lab (Islamabad)? (Yes/No)

**Funding / Investment**
- Have you received any funding or investment before? (Yes/No) → if Yes: "please share brief details" (textarea)

**Contact Information**
- Point of Contact (Primary Founder) (text)
- Contact Number (tel)
- Email (email, validated)
- City / Province (text)
- Gender (text/select)

**How Did You Hear About WISE Lab?** (select): Social Media · Peer Referral · Email · Print / Electronic
Media · **Others: ____**

**Commitment Statement** — the web equivalent of "Applicant Signature": a **required consent checkbox**
carrying the commitment text (this is correct for a web form — keep it, do not add a signature field).

### Fidelity gaps to ADD (these `Others: ____` blanks exist in the docx but likely aren't in the form yet):
- When **Business Vertical = Others** → show a conditional free-text field to specify (new field, e.g.
  `verticalOther`; add its i18n keys to all 4 locales). Do NOT alter the `vertical` dimension value.
- Add a **Stage = Others** option + conditional free-text (`stageOther`) if the docx's "Others" under stage
  should be selectable. (If you judge stage-Others is noise in the source layout, keep the 4 stages and note
  the decision — but vertical-Others and referral-Others are clearly real.)
- When **How Did You Hear = Others** → conditional free-text (`referralSourceOther`).
Add these as `conditional` fields (shown only when "others"/"Others" is selected), fully i18n-keyed.

**Gate: `/apply/founder` matches the docx field list exactly, plus the three "Others → specify" free-text
fields; no analytics/name keys changed.**

---

## PART 3 — CONFIRM IT WORKS & IS TRANSLATED

- Any new field's label/placeholder/help/option strings are i18n key paths, with values added to
  **all four** locale files (en/ur/ps/pa) — run the coverage check and confirm 0 missing:
  ```bash
  python3 - <<'PY'
  import json
  def keys(d,p=''):
      o=set()
      for k,v in d.items():
          path=f'{p}.{k}' if p else k
          o|=keys(v,path) if isinstance(v,dict) else {path}
      return o
  en=keys(json.load(open('src/i18n/locales/en.json')))
  for f in ['ur','ps','pa']:
      d=keys(json.load(open(f'src/i18n/locales/{f}.json')))
      print(f, len(en-d),'missing', sorted(en-d)[:15])
  PY
  ```
- No hardcoded English left in the schema:
  ```bash
  grep -nE "(label|placeholder|helpText|title|subtitle|submitLabel|successTitle|successBody|patternMessage):[[:space:]]*'" src/lib/forms/schemas/founder.ts | grep -vE ":[[:space:]]*'forms\." || echo PASS
  ```
- In the browser: the Founder form renders all sections, required + email validation fire (translated),
  Yes→conditional fields reveal, the new Others→specify fields reveal only when "Others" is chosen, the
  team table adds/removes rows, and a submit (Supabase not live) fails gracefully into the translated error
  state — verified in English AND at least one RTL language (Urdu), with correct RTL layout and no
  missing-key console warnings.

**Gate: 0 missing keys, no hardcoded schema strings, form fully functional + translated + RTL-correct.**

---

## FINISH

```bash
npm run build && npm run lint     # clean except ~4 known fast-refresh warnings
```
Commit with clear messages (e.g. "Make incubation application reachable + labeled; add /apply chooser",
"Founder form fidelity: Others→specify fields"). Append a Phase entry to `IMPLEMENTATION_LOG.md`.
Push and update PR #2 — do NOT merge.

Report: the exact click-paths that now reach the incubation application, the field diff you found + fixed
vs the docx, confirmation of 0 missing i18n keys, and build/lint clean.
