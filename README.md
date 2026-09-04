# CIC Micro-Shield

A React Native / Expo prototype built for the CIC Insurance Group — a lightweight microinsurance app concept.

## Features

- Local sign-in and registration (no backend required)
- AsyncStorage persistence
- Home, Policies, and Claims tabs
- Cover plan selection
- Policy detail screens
- Claim submission with optional photo attachment
- Claim status tracking: Pending → In Review → Approved
- CIC-inspired UI and app icon

This is a frontend-first prototype — no backend, database, or API keys needed to run it.

## Run locally

Requirements: Node.js 20+, Expo Go app (or Android Studio / Xcode)

\`\`\`bash
npm install
npx expo start
\`\`\`

Press `a` for Android emulator, `i` for iOS Simulator, or scan the QR code with Expo Go.

## Demo flow

1. Sign in with any valid Kenyan mobile number, e.g. `0712345678`
2. Use any 4-digit PIN, e.g. `1234`
3. Open a policy to see benefits and renewal date
4. Start a claim and describe an incident
5. Open the claim and advance it through the status journey

## Project structure

\`\`\`
app/                    Expo Router screens
components/CicUI.js     Shared UI components
context/AppContext.js   Local state + AsyncStorage persistence
constants/colors.ts     Theme tokens
assets/images/icon.png  App icon
\`\`\`

## What a production version would add

Authenticated REST endpoints, a real database, secure photo upload, and push 
notifications for claim status changes.