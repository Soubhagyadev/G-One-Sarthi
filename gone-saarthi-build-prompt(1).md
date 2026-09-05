# G-One Saarthi — Build Prompt (React Native + SQLite, Hackathon Prototype)

Paste this whole file into your AI coding tool (Claude Code, Cursor, etc.) as the
project brief. It's written to be handed over as-is.

---

## 1. What we're building

An AI-powered cognitive gaming and memory-assistance Android app for elderly
dementia patients in the North Eastern Region (NER), built for a hackathon demo.

**This is a local-only prototype.** There is no real backend server. All data
lives in on-device SQLite. "Sync" and "AI adaptivity" are simulated with local
logic — they should *look* and *behave* correctly in a demo but do not call any
external API. Do not build auth, networking, or a real server. Do not add
placeholder screens for features not listed below.

## 2. Design system — follow exactly, do not improvise new colors/spacing

We are explicitly **not** using a neobrutalist style (harsh borders, clashing
colors, dense layouts increase cognitive load for dementia patients). Use this
"Calm Companion" system on every screen:

```
Colors
  background:      #FAF6F0   (warm off-white — never pure white)
  surface/card:     #FFFFFF
  text-primary:     #2D2A26   (warm dark gray — never pure black)
  text-secondary:   #6B655C
  accent-primary:   #4A7C74   (muted teal — primary buttons, active nav)
  accent-warm:      #D68C45   (soft terracotta — streaks, celebration, highlights)
  success:          #6B9080
  alert/reminder:   #C97064   (soft coral — never pure red)
  border:           #E8E0D5

Typography
  Font family: rounded sans-serif — Nunito or Quicksand (via @expo-google-fonts
    or react-native-vector-icons font loading). Fall back to System if unavailable.
  Body text:        min 18sp
  Buttons/labels:   20-22sp, bold (700)
  Screen headings:  26-28sp, bold (700)
  Line height:      1.4x font size minimum

Shape & spacing
  Corner radius:    20-24px on all cards and buttons
  Touch targets:    minimum 64dp height, full-width where possible
  Base spacing unit: 16px (use multiples of it: 8/16/24/32)
  Shadows:          soft only — elevation 2-3 on Android, shadowOpacity 0.08 on iOS.
                    No hard-edged / offset "brutalist" shadows.

Layout rules
  - One primary call-to-action per screen, full-width, high contrast.
  - Max 3-4 tappable elements visible at once on any patient-facing screen.
  - Icons are always paired with a text label — never icon-only.
  - Bottom tab bar navigation only (max 4 tabs). No hamburger menu, no nested
    drawers, for patient-facing flows.
  - No modal popups that fully block the screen for patient flows — use inline
    banners/cards instead. Modals are fine for the caregiver-facing dashboard.
```

Put all of the above into a single `theme.js` / `theme.ts` constants file and
import it everywhere — do not hardcode hex values or font sizes in components.

## 3. Tech stack

- **React Native** (Expo managed workflow — fastest to get running/demoed)
- **expo-sqlite** for local storage (this is our entire "backend")
- **React Navigation** — bottom tabs (Patient mode) + a simple stack for
  Caregiver mode
- **react-native-voice** or Expo's `expo-speech` for the voice interaction
  mock (see Feature 4 — this can be a visual/mock interaction, does not need
  working ASR for regional languages)
- **victory-native** or **react-native-svg-charts** for the caregiver
  dashboard's simple line/bar chart
- No backend framework, no REST calls, no auth library

## 4. Screens to build (in priority order — build top to bottom, stop when time runs out)

### Screen 1 — Home / Daily Companion (Patient mode) — BUILD FIRST
The screen a demo lives or dies on.
- Warm greeting with patient's name and time of day ("Good morning, Amma")
- Today's reminder card (next medicine/appointment) pulled from SQLite
  `reminders` table, with a big "Mark as Done" button
- One large primary button: **"Start Today's Activity"** → goes to Screen 2
- A small streak indicator ("5 days in a row!") using accent-warm color
- Bottom tab bar: Home, Games, Voice, (Caregiver mode toggle or separate app icon)

### Screen 2 — Cognitive Games (build 1-2 fully, stub the rest as "coming soon" tiles)

**Important — read before writing any pitch copy:** there is no cognitive game,
app, or program that is scientifically proven to "guarantee" memory
improvement or reverse decline in dementia/Alzheimer's, and no named
neurologist endorses a specific game as a guaranteed cure. Claiming this to a
judged panel is a real credibility risk — this is close to the exact claim
the FTC fined Lumosity $2M for in 2016 for lacking scientific support. Do not
use the words "guaranteed," "cure," "proven to reverse decline," or
"recommended by Dr. [Name]" anywhere in the app or pitch deck unless you can
link the actual named source.

What you *can* say, and what this spec is built around: these 5 game types
map to cognitive domains that have real, checkable evidence behind them —
NICE (UK) recommends **Cognitive Stimulation Therapy (CST)**, developed by
Spector et al., as the only non-drug intervention for mild-to-moderate
dementia, built on exactly these domains; and the long-running **ACTIVE
trial** (Advanced Cognitive Training for Independent and Vital Elderly — NIH-
funded, ~2,800 participants, led in part by Dr. Marilyn Albert, director of
the Johns Hopkins Alzheimer's Disease Research Center) found a speed-of-
processing/divided-attention training game associated with meaningfully
lower dementia risk over 10+ years of follow-up. This is real, citable, and
still an honest claim: "associated with lower risk in a large trial," not
"guaranteed to improve your memory." Use this framing in the pitch — it's
more credible to a technical judge, not less.

**The 5 games, each mapped to its real cognitive domain:**

1. **Memory Recall ("Remember the Tray")** — show 5-6 familiar objects for a
   few seconds, hide them, ask the patient to recall/select which ones were
   shown. Maps to *episodic memory* — the domain CST and most dementia
   cognitive-training protocols target first.
2. **Pattern & Object Recognition ("Find the Match")** — tap the odd-one-out
   or matching pair from a set of culturally familiar images (fruits,
   festival items, household objects). Maps to *visuospatial processing* —
   one of the three domains most affected in Alzheimer's, alongside episodic
   and semantic memory.
3. **Attention & Speed ("Spot It Fast")** — a simplified divided-attention
   task: two things happening on screen, patient responds to a specific one
   quickly. This is the same domain (speed of processing / divided attention)
   trained in the ACTIVE trial's most promising arm — keep the mechanic dead
   simple, large targets, generous time windows.
4. **Daily Routine Recall ("What Comes Next?")** — show a short sequence of
   daily-life steps (e.g. wake up → brush teeth → have tea) with one step
   missing or out of order; patient corrects it. Maps to *procedural/semantic
   memory* and supports activities-of-daily-living retention, a stated CST
   goal alongside pure cognition.
5. **Reasoning & Association ("Which Belongs?")** — simple categorisation
   task (e.g. "which of these is a fruit?"), difficulty scales from
   single-category to multi-step association. Maps to *reasoning*, one of
   the five domains trained in the large UK-funded online brain-training
   study (~12,000 participants) alongside memory, planning, visual skills,
   and attention.

**For the few-hour build:** fully build #1 (Memory Recall) and #2 (Pattern
Recognition) — these are the fastest to make feel polished and correct. Show
#3-#5 as visible tiles on the Games screen with a "Coming soon" badge rather
than omitting them — this shows the roadmap without needing working code.

- On correct answer: warm positive animation/sound, log score to SQLite
  `game_sessions` table (`game_type` field distinguishes which of the 5)
- **Simulated adaptive difficulty:** after each session, read the last 3
  session accuracy scores *for that game type* from SQLite and locally
  compute whether to increase or decrease difficulty (see Section 6, Adaptive
  Logic). No ML model needed — a simple rule-based function is enough and
  should be described in the pitch as "the adaptive engine."

### Screen 3 — Voice Interaction entry point (mock)
- Large circular mic button, center screen
- On tap: animate a simple waveform (a few animated bars is enough) for
  2-3 seconds, then show a canned response ("Reminder set for 5 PM" or similar)
  relevant to what a "voice command" would do
- A language selector row above it (Assamese, Bodo, Khasi, Manipuri, Hindi,
  English) — selecting one just changes a label/flag, no real translation
  needed for the demo
- Do not wire real speech-to-text. This screen exists to sell the multilingual
  voice story visually.

### Screen 4 — Caregiver Dashboard: behavioral trend tracking

This is the screen that answers "is he actually improving or declining" —
build it around **trend direction per cognitive domain**, not just a single
accuracy number. A flat 70% average hides whether memory-recall is getting
worse while pattern-recognition gets better; caregivers need to see that
split. Everything here is a rule-based read of SQLite history — no ML model,
and the spec is written so you can say that plainly if asked.

**a) Per-domain trend cards (the core of this screen)**
For each of the 5 game types the patient has played, show a small card with:
- Game name + icon
- A simple trend arrow: ↑ improving / → stable / ↓ declining, computed by
  comparing the average accuracy of the **most recent 3 sessions** against
  the average of the **3 sessions before that** for the same `game_type`
  (see pseudocode below)
- Current accuracy % and current difficulty level
- Sparkline (tiny line chart) of the last 7 sessions for that game type

```
function getDomainTrend(gameType, patientId):
  sessions = getSessions(patientId, gameType, orderBy='played_at DESC', limit=6)
  if sessions.length < 4: return 'not_enough_data'   // needs a minimum baseline
  recent = average(accuracy of sessions[0:3])   // most recent 3
  previous = average(accuracy of sessions[3:6]) // prior 3
  delta = recent - previous
  if delta > 0.08:  return 'improving'   // >8 percentage points
  if delta < -0.08: return 'declining'
  else:             return 'stable'
```

Seed the fake historical data (Section 5) so at least 2 of the 5 games show
"improving" and at least 1 shows "declining" — a dashboard where everything
trends up looks fake to a judge; a mixed picture looks like real data.

**b) Overall cognitive engagement summary (top of screen)**
One headline card combining:
- Overall trend badge (improving / stable / needs attention) — derived from
  how many of the 5 domain trends are down vs. up, not a separate metric
- Current streak (consecutive days with ≥1 completed activity)
- Total sessions this week vs. last week (engagement level, separate from
  performance — a patient playing less is itself a signal worth surfacing)

**c) Alerts list (rule-based, described honestly as rule-based)**
Generate 2-4 alerts by checking simple conditions against SQLite data, e.g.:
- "Memory Recall accuracy down 15%+ over the last 2 weeks" (a `declining`
  trend per the function above)
- "No activity in the last 3 days" (engagement drop)
- "Missed medicine reminder Tuesday" (from `reminders.last_completed_at`)
- "Response time increasing on Attention & Speed" (if `avg_response_time_ms`
  is trending up even where accuracy is flat — this can catch decline that
  accuracy alone masks, since a patient can stay accurate but get slower)

Do not label this "AI-detected anomalies" in the UI or pitch — call it what
it is: "automated trend alerts based on activity patterns." If a judge asks
whether this is clinically validated, the honest answer is no — it is a
pattern-flagging tool to prompt a caregiver to look closer, not a diagnostic
tool, and the app should never imply otherwise.

**d) Reminder management row**
Add/edit a reminder — writes to SQLite `reminders` table.

**On language for this whole screen:** avoid phrasing that implies medical
certainty — "may indicate," "trend suggests," "worth checking in on" reads as
credible; "your patient is declining" or "memory loss detected" reads as an
overclaim for a rule-based prototype and is the kind of line that invites
hard follow-up questions from a judge with clinical background.

### Screen 5 (only if time remains) — Reminders list
- Simple list of all reminders (medicine, hydration, activity, appointment)
  with icons, times, and on/off toggle
- Skip this first if short on time — Screen 1's single reminder card already
  sells the concept.

**Do not build:** onboarding/signup flow, settings screen, real push
notifications, real multilingual UI translation, real offline-to-server sync,
patient list/multi-patient support. If asked in the demo, say these are
designed but out of scope for the prototype build window.

## 5. SQLite schema (this is your entire "backend")

Create this schema on app first-launch via `expo-sqlite`. Seed it with 1 fake
patient and **2-3 weeks of fake game session history across all 5 game
types** so the dashboard's per-domain trend cards have enough sessions to
compute real trend arrows on first run (the `getDomainTrend` function above
needs at least 4-6 sessions per game type to say anything). Deliberately mix
the seeded data so 2 games trend up, 1 trends down, and the rest are stable —
do not demo an empty dashboard or an all-improving one.

```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'English',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  game_type TEXT NOT NULL,          -- 'memory_recall' | 'pattern_recognition' |
                                     -- 'attention_speed' | 'routine_recall' | 'reasoning'
  difficulty_level INTEGER NOT NULL, -- 1 (easy) - 5 (hard)
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  accuracy REAL NOT NULL,            -- correct_answers / total_questions
  avg_response_time_ms INTEGER,      -- optional but cheap to capture, useful signal (see Sec 9)
  played_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  type TEXT NOT NULL,               -- 'medicine' | 'hydration' | 'activity' | 'appointment'
  label TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,     -- 'HH:MM'
  is_active INTEGER DEFAULT 1,
  last_completed_at TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info',     -- 'info' | 'warning'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_read INTEGER DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE sync_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  last_synced_at TEXT,
  status TEXT DEFAULT 'synced'      -- 'synced' | 'pending' | 'offline'
);
```

Wrap all SQLite access in a single `db.js`/`db.ts` module with plain functions
(`getReminders()`, `logGameSession(...)`, `getWeeklyAccuracy(patientId)`,
`generateAlerts(patientId)`, etc.) — don't scatter raw SQL through components.

## 6. "Adaptive AI" logic (rule-based, not real ML — be upfront about this)

For the pitch, describe this as the difficulty-adjustment engine. Implement it
as a plain function, no model:

```
function getNextDifficulty(lastThreeSessions):
  avgAccuracy = average(lastThreeSessions.accuracy)
  if avgAccuracy > 0.85: increase difficulty by 1 (max 5)
  if avgAccuracy < 0.5:  decrease difficulty by 1 (min 1)
  else: keep same difficulty
```

For alerts on the caregiver dashboard, use similarly simple rule checks
(e.g. "accuracy this week vs last week dropped >15%" or "a reminder wasn't
marked done within X hours of its scheduled time"). Do not claim real anomaly
detection in code comments — keep the rule-based nature clear so it's easy to
describe honestly if judges ask how it works.

## 7. Fake "sync" behavior

Since there's no real server, simulate offline-first sync purely for visual
effect:
- Show a small sync status pill somewhere unobtrusive (e.g. top of Home
  screen) reading "Synced" (accent-primary) or "Offline — will sync later"
  (text-secondary), driven by `sync_status` table
- On a timer or button tap, flip it to "Syncing..." for ~1.5s then back to
  "Synced" — purely cosmetic, no real network call
- This is enough to narrate "offline-first architecture with background sync"
  in the pitch without needing a real backend

## 8. Build order / time-boxing (for a few-hour build)

1. Scaffold Expo app, install expo-sqlite + React Navigation, create
   `theme.js` with the tokens above
2. Build `db.ts` with schema creation + 2-3 weeks of seed data (all 5 game
   types, mixed trends) on first launch
3. Build Screen 1 (Home) — get this looking polished before anything else
4. Build Screen 2 — Memory Recall + Pattern Recognition fully working,
   other 3 games as "Coming soon" tiles; wire real sessions to SQLite
5. Build Screen 4 (Caregiver dashboard) — per-domain trend cards +
   overall summary + alerts, reading seeded + real session data
6. Build Screen 3 (Voice mock) — pure UI, no logic needed
7. Only if time remains: Screen 5 (reminders list), sync status pill polish

If you have to cut something, cut Screen 5 and the sync pill first — the
game + dashboard pair is what makes the demo credible.

## 9. What to say in the pitch about scope

Be upfront rather than implying more is built than is: "This is a working
local prototype — the cognitive games, adaptive difficulty logic, and
caregiver trend dashboard are fully functional against on-device data. Voice
interaction and multilingual support are shown as designed UI flows; the
production version would integrate Whisper/Bhashini for real ASR and a
synced backend for multi-caregiver access." Judges respond better to an
honest scope statement than to a demo that implies more than it does.

**Specifically on the games and the "does it work" question:** say the game
domains are grounded in NICE-recommended Cognitive Stimulation Therapy and
the NIH-funded ACTIVE trial's cognitive-training research, not that the app
itself is clinically validated — it hasn't been tested, it's a hackathon
prototype. "Grounded in published cognitive-training research" is a claim
you can defend if asked for a source. "Guaranteed to improve memory" or
"recommended by [named doctor]" is not, and is likely to backfire harder
than having no evidence claim at all.

**Specifically on the caregiver dashboard's decline/improvement signal:**
frame it as "automated trend flagging to help a caregiver notice patterns
sooner" — not diagnosis, not clinical monitoring. This is a rule-based
comparison of recent vs. prior session averages (Section 6/Screen 4), which
is genuinely useful for a caregiver and does not require overclaiming to
sound valuable.
