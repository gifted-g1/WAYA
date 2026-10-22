# WAYA — Where You At? 🇳🇬
### African-Inspired, Highly Animated Mobile Logistics & Rider-Tracking App

Waya is a state-of-the-art mobile logistics platform built with **React Native, Expo, and TypeScript**. Designed initially for the Nigerian and wider African markets, Waya connects customers, dispatch riders, and merchants through a fluid, culturally expressive delivery experience.

---

## 🎨 1. African Art Direction & Design Vision

Waya’s visual identity is deeply rooted in contemporary African creativity, Nigerian urban life, and traditional textile motifs:

- **Adire Eleko Motifs:** Concentric spiral ripples, comb strokes, and organic rhythm geometries.
- **Ankara & Kente Weave:** Precision stepped chevron diamonds, vibrant alternating color bars, and sacred geometric trims.
- **Afro-Futurism:** Glowing neon telemetry route lines, pulsing sonar radar rings, and high-tech map marker beacons.
- **Cultural Color Tokens:**
  - **Deep Forest Green** (`#0C3823`): Primary brand color representing African earth, growth, and trust.
  - **Warm Cream & Ivory** (`#FAF6EF`): Primary light backgrounds, replacing generic cold white with warm earthen tones.
  - **Terracotta & Burnt Orange** (`#C8522C`): African accent inspired by traditional pottery, warmth, and high-visibility dispatch vests.
  - **Golden Yellow** (`#F5B731`): Highlights, primary action pills, and radiant Nigerian sunshine.
  - **Deep Charcoal & Obsidian** (`#151917` / `#0B110E`): High-contrast typography and sleek dark mode surfaces.

---

## 🚀 2. Screen & Feature Walkthrough

### A. Animated Splash Screen
- **Waya Monogram Reveal:** Animated self-weaving geometric **W** glyph combining textile chevron lines and a geolocation pinhead.
- **Brand Tagline:** *"Waya — Where You At?"*
- Cultural subtitle: *"Made with Pride for Nigeria & Africa 🇳🇬"*.

### B. Onboarding Experience
1. **Send anything. Move with Waya:** Animated African dispatch rider vector illustration with motorcycle wheels and road dust ripples.
2. **Track every move, live:** Interactive Afro-futuristic radar graphic with live telemetry distance badge.
3. **Know when it arrives. Confirmed by OTP:** Interactive delivery PIN display preview (`WY-8492`).

### C. Authentication & Phone Verification
- Sign In & Sign Up tabs with formatted Nigerian phone numbers (`🇳🇬 +234 803 123 4567`).
- **OTP Verification Modal:** 4-digit auto-focus pin inputs, resend countdown timer, and 1-tap demo auto-fill (`1234`).
- **One-Tap Demo Login:** Instant authentication as verified customer **Chidi Okafor**.

### D. Home Dashboard
- **Personalized Nigerian Greetings:** *"Ẹ n lẹ o / Ńdēwó / Sannu, Chidi 👋"*.
- **Active Delivery Banner:** Live pulse ring indicator if a parcel is currently on the move.
- **Hero Actions:** Prominent *"Send a Package"* card with Waya Swift badge and quick *"Track by Code"* input.
- **Delivery Categories:** Parcels & Boxes, Legal Documents, Hot Meals, Market & Groceries.
- **Live Dispatch Radar Map Preview:** Embedded vector Lagos map with online riders and 60 FPS status.
- **Saved Addresses:** Lekki Phase 1, Sabo Yaba Tech Hub, Mum's Store in GRA Ikeja.
- **Floating Action Button (FAB):** Quick-order trigger.

### E. Create Delivery (4-Step Flow)
1. **Locations:** Pickup and Drop-off address input with landmark and contact numbers, plus quick-pick Nigerian landmarks.
2. **Package Details:** Size selector cards (Envelope, Small Box, Medium Box, Large/Bulk), fragile handling switch, special instructions.
3. **Service Tier Selection:**
   - **Waya Swift Express** (20-35 mins, priority bike dispatch)
   - **Standard Dispatch** (45-60 mins)
   - **Eco Saver** (Same-day afternoon)
4. **Live Fare Summary:** Haversine distance calculator, toll & weight breakdown in Naira (`₦`), and payment options (Waya Wallet, Debit Card, Pay on Pickup).

### F. Rider Matching Radar
- Radiating circular sonar pulses with spinning radar compass.
- Dynamic matching status progression:
  - *"Broadcasting order to nearby Waya dispatch riders..."*
  - *"3 riders detected near pickup location. Checking ratings..."*
  - *"Rider selected: Babajide Adekunle (4.94★). Confirming route..."*
- Cancel option with instant refund to Waya Wallet.

### G. Live Delivery Tracking (Core Experience)
- **Interactive Lagos Vector Map:** Renders Lagos Lagoon, Third Mainland Bridge corridor, Admiralty Way, and Ikorodu Road.
- **Moving Rider Marker:** Live animated motorbike marker with heading pointer and pulsing sonar rings.
- **Rider Profile Card:** Babajide Adekunle (4.94★, 1,240 trips, Bajaj Boxer 150 `KJA-482QX`).
- **Direct Communication:** Direct phone call and pre-filled WhatsApp chat link.
- **Secure Delivery OTP Handshake:** Displays customer verification OTP (`WY-7842`) with 1-tap copy and rider release confirmation modal.
- **Simulation Control Panel:** Step rider GPS forward and simulate instant delivery completion.

### H. Delivery Activity & Order History
- Segmented filter tabs: **Active**, **Completed**, and **Cancelled**.
- Real-time search query filtering by tracking code or recipient location.
- Detailed modal receipt inspection with "Repeat / Send Again" action.

### I. Notifications Center
- Real-time status cards: Rider Assigned, Package Picked Up, In Transit, Delivery Confirmation, and Wallet Cashback alerts.
- Unread badge counter, mark-all-as-read action, and tap-to-track shortcuts.

### J. Profile & Settings
- **Customer Verification:** Verified Nigerian Customer badge.
- **Waya Wallet:** Balance management with interactive Top-Up modal (`₦2,000`, `₦5,000`, `₦10,000`, `₦25,000`).
- **Saved Addresses Manager:** Add new addresses with custom landmarks.
- **Accessibility & Motion Settings:**
  - Dark Mode switch (Obsidian Green high-tech Afro-futuristic theme).
  - Reduced Motion toggle (disables looping animations and heavy transforms).
  - Controlled Demo Mode toggle (switch between offline simulation and Go backend).
- **24/7 WhatsApp Support Concierge** and Terms of Service.

---

## 🛠️ 3. Technology Stack

- **Framework:** React Native with Expo (SDK 58)
- **Language:** TypeScript with strict type checking
- **State Management:** Zustand (`useAuthStore`, `useDeliveryStore`, `useSettingsStore`, `useNotificationStore`)
- **Server Queries:** `@tanstack/react-query`
- **Vector Graphics & Icons:** `react-native-svg` & `lucide-react-native`
- **Feedback & Motion:** `expo-haptics`, `expo-linear-gradient`, native `Animated` APIs

---

## 🔌 4. Go & Gin Backend Integration Readiness

The application is structured for direct plug-and-play integration with a Go and Gin backend:

- **Central API Client:** [`src/services/apiClient.ts`](file:///C:/Users/A1/.gemini/antigravity-ide/scratch/waya-mobile/src/services/apiClient.ts) reads `EXPO_PUBLIC_API_URL` from the environment.
- **Auth Interceptor:** Automatically attaches `Authorization: Bearer <token>` to all protected endpoints.
- **Service Modules:**
  - `authService.ts` (`/auth/login`, `/auth/register`, `/auth/otp/verify`)
  - `deliveryService.ts` (`/deliveries`, `/deliveries/:id`, `/deliveries/:id/verify-otp`, `/deliveries/:id/cancel`)
  - `addressService.ts` (`/addresses`, `/addresses/search`)
- **Controlled Demo Mode:** Toggle in Profile settings to seamlessly develop and test even when the backend is offline.

---

## 📱 5. Running the Application

Navigate to the project directory:
```bash
cd C:\Users\A1\.gemini\antigravity-ide\scratch\waya-mobile
```

### Run on iOS:
```bash
npm run ios
```

### Run on Android:
```bash
npm run android
```

### Run on Web Preview:
```bash
npm run web
```

### Run TypeScript Verification:
```bash
npx tsc --noEmit
```

---

*Designed and engineered with cultural authenticity, high-octane motion, and enterprise-grade reliability.*
