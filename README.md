# G-One Saarthi

A cognitive gaming and memory-assistance mobile application for elderly dementia patients in the North Eastern Region (NER) of India. Built as a hackathon prototype using React Native and Expo with fully on-device data storage.

---

## Overview

G-One Saarthi is a local-first Android/iOS/Web app designed to support mild-to-moderate dementia patients and their caregivers. The app combines daily reminders, cognitive stimulation games, and a caregiver-facing trend dashboard — all running entirely on the device with no backend server or authentication required.

The five cognitive game types are grounded in published research: the NICE-recommended Cognitive Stimulation Therapy (CST) framework and the NIH-funded ACTIVE trial, which associated divided-attention training with measurably lower dementia risk over a 10-year follow-up in a sample of approximately 2,800 participants.

---

## Features

<table>
  <thead>
    <tr>
      <th>Screen</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Home / Daily Companion</td>
      <td>Personalized greeting, next medicine or appointment reminder, activity streak, and a single primary call-to-action button.</td>
    </tr>
    <tr>
      <td>Cognitive Games</td>
      <td>Five game types mapped to distinct cognitive domains. Memory Recall and Pattern Recognition are fully implemented. The remaining three are shown as visible roadmap tiles.</td>
    </tr>
    <tr>
      <td>Voice Interaction (mock)</td>
      <td>Language selector (Assamese, Bodo, Khasi, Manipuri, Hindi, English), animated waveform UI, and canned responses. Designed to demonstrate the multilingual voice story; real ASR is out of scope for this prototype.</td>
    </tr>
    <tr>
      <td>Caregiver Dashboard</td>
      <td>Per-domain trend cards (improving / stable / declining), sparklines of the last 7 sessions per game type, engagement summary, and automated rule-based alerts. Not a clinical monitoring tool — surfaces patterns for a caregiver to investigate.</td>
    </tr>
    <tr>
      <td>Reminders</td>
      <td>Medicine, hydration, activity, and appointment reminders stored in SQLite with add/edit support.</td>
    </tr>
  </tbody>
</table>

### Cognitive Game Domains

| Game | Domain | Research Basis |
|---|---|---|
| Memory Recall ("Remember the Tray") | Episodic memory | Core CST domain — NICE-recommended |
| Pattern Recognition ("Find the Match") | Visuospatial processing | One of three primary Alzheimer's-affected domains |
| Attention and Speed ("Spot It Fast") | Divided attention / processing speed | ACTIVE trial's most significant training arm |
| Daily Routine Recall ("What Comes Next?") | Procedural and semantic memory | CST activities-of-daily-living retention goal |
| Reasoning and Association ("Which Belongs?") | Reasoning and categorisation | UK online brain-training study (~12,000 participants) |

---

## Tech Stack

- **React Native 0.86** with **Expo SDK 57** (managed workflow)
- **expo-sqlite** — all data lives on-device; no backend or network calls
- **React Navigation 7** — bottom tabs for patient mode, stack for caregiver mode
- **expo-speech** — speech output support
- **@expo-google-fonts/nunito-sans** — Nunito Sans typeface for the Calm Companion design system
- **react-native-gesture-handler**, **react-native-screens**, **react-native-safe-area-context**

---

## Design System

All visual tokens are defined in `theme.js` and imported everywhere. No hex values or font sizes are hardcoded in components.

```
Background:      #FAF6F0  (warm off-white)
Surface/card:    #FFFFFF
Text primary:    #2D2A26  (warm dark gray)
Text secondary:  #6B655C
Accent primary:  #4A7C74  (muted teal)
Accent warm:     #D68C45  (soft terracotta)
Success:         #6B9080
Alert:           #C97064  (soft coral)
Border:          #E8E0D5

Body text:       18sp minimum
Button labels:   20-22sp, bold
Screen headings: 26-28sp, bold
Touch targets:   64dp minimum height
Corner radius:   20-24px
```

---

## Database Schema

All SQLite access goes through `db.ts`. The schema is created and seeded on first launch with two to three weeks of mixed-trend game history so the caregiver dashboard shows realistic data immediately.

```sql
patients          -- id, name, preferred_language, created_at
game_sessions     -- id, patient_id, game_type, difficulty_level,
                  --   correct_answers, total_questions, accuracy,
                  --   avg_response_time_ms, played_at
reminders         -- id, patient_id, type, label, scheduled_time,
                  --   is_active, last_completed_at
alerts            -- id, patient_id, message, severity, created_at, is_read
sync_status       -- id, last_synced_at, status
```

---

## Adaptive Difficulty Logic

After each game session the app reads the last three sessions for that game type and applies a simple rule:

```
avgAccuracy > 0.85  →  increase difficulty (max 5)
avgAccuracy < 0.50  →  decrease difficulty (min 1)
otherwise           →  keep current difficulty
```

This is a deterministic rule-based function, not a machine-learning model. It is described in the pitch as the difficulty-adjustment engine because that is precisely what it is.

---

## Caregiver Trend Alerts

Alerts are generated by comparing rule conditions against SQLite history:

- Accuracy for a game type dropped more than 15 percent over two weeks
- No activity recorded in the last three days
- A medicine reminder was not marked done within a threshold of its scheduled time
- Average response time trending upward even where accuracy is flat

These are automated pattern flags intended to prompt a caregiver to look closer. They are not diagnostic signals and the app does not present them as such.

---

## Getting Started

**Prerequisites:** Node.js 18 or later, npm or yarn, Expo CLI.

```bash
# Clone the repository
git clone https://github.com/Soubhagyadev/G-One-Sarthi.git
cd G-One-Sarthi

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Then add your Gemini API key to .env

# Start the development server
npx expo start
```

Open the app in Expo Go on a physical device or in an Android/iOS simulator. The database schema and seed data are created automatically on first launch.

### Build for Web

```bash
npx expo export --platform web
```

---

## Environment Variables

```
GEMINI_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

The `.env` file is listed in `.gitignore` and is never committed. The `dist/` build output directory is also excluded.

---

## Prototype Scope

This is a working local prototype. The cognitive games, adaptive difficulty logic, and caregiver trend dashboard are fully functional against on-device SQLite data. Voice interaction and multilingual support are implemented as designed UI flows; the production version would integrate a real ASR service (such as Whisper or Bhashini) and a synced backend for multi-caregiver access. Onboarding, settings, push notifications, and multi-patient support are designed but out of scope for the prototype build window.

---

## License

Private — hackathon prototype. Not for redistribution.
