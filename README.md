# InkSpire - Where Writers Connect ✒️

InkSpire is a mobile platform designed for writers to connect, share their progress, participate in writing sprints, exchange feedback, and tackle daily writing prompts. It acts as a dedicated social network and productivity tool tailored specifically for the creative writing community.

---

## 🏗️ Architecture & Tech Stack

This project is structured as a **Monorepo** consisting of a React Native mobile application and an Express/Prisma backend.

### **Frontend (Mobile App)**
- **Framework:** React Native with Expo (Managed Workflow)
- **Navigation:** Expo Router (File-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand (Global State) & React Query (Server State/Caching)
- **Forms & Validation:** React Hook Form + Zod
- **Animations:** React Native Reanimated, Expo Haptics
- **Bottom Sheets:** `@gorhom/bottom-sheet`

### **Backend (Server)**
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL (hosted on NeonDB)
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) with short-lived access and long-lived refresh tokens.
- **File Storage:** Cloudinary (for avatar uploads)
- **Validation:** Zod

---

## 📱 Features & App Structure

### 1. **Authentication & Onboarding**
- **Purpose:** Securely log users in and collect initial writing preferences.
- **Flow:** 
  - Splash Screen (Native UI animation) → Login / Register
  - Upon registration, users are redirected to the **Onboarding** flow to select their preferred writing genres (e.g., Sci-Fi, Romance, Poetry).
- **Validation:** Enforced via Zod schemas. Requires valid email, strong password, and display name.

### 2. **Home Dashboard (`/app/(tabs)/home.tsx`)**
- **Purpose:** The central hub for the user's daily activity.
- **Features:**
  - **Daily Progress:** Displays words written today against the user's daily goal.
  - **Quick Actions:** "Log Words" (opens a Bottom Sheet modal) and "Start Sprint".
  - **Active Matches:** Shows thumbnails of currently matched writing partners.
  - **Recent Activity:** A feed of the user's recent progress logs.

### 3. **Community Writing Prompts (`/app/(tabs)/prompts.tsx`)**
- **Purpose:** Cure writer's block and engage with the community.
- **Features:**
  - **Daily Challenge:** A highlighted, premium-styled prompt curated daily.
  - **Community Prompts:** An infinite-scrolling feed of prompts suggested by other users.
  - **Actions:** Users can **Upvote** prompts, **Write Responses**, and **Read/Comment** on others' responses (`ResponsesListModal`, `CommentThread`).
  - **Suggest a Prompt:** Users can propose new prompts (`SuggestPromptModal`).

### 4. **Matchmaking & Discovery (`/app/discover.tsx` & `/app/match/requests.tsx`)**
- **Purpose:** Find critique partners and co-writers.
- **Features:**
  - **Swipe/Discover:** Browse other writers based on shared genres and experience levels.
  - **Profiles:** Tap a writer to view their bio, genres, and portfolio link (`WriterProfileSheet`).
  - **Match Requests:** Send requests, view incoming/outgoing requests, and accept/decline.

### 5. **Feedback System (`/app/feedback/`)**
- **Purpose:** Request and provide structured critiques on writing pieces.
- **Features:**
  - **Submit Feedback Request:** Users can submit a Google Doc link or text snippet, specifying what kind of feedback they need (`submit.tsx`).
  - **Give Feedback:** Matched partners can review the submission and provide a rating (1-5 stars) and a detailed review (`give-feedback.tsx`).
  - **Feedback Filter:** Filter requests by status (Pending, Completed).

### 6. **Writing Sprints (`/app/sprint/[id].tsx`)**
- **Purpose:** Focused, timed writing sessions.
- **Features:** Set a timer, write without distractions, and log the final word count immediately when the timer finishes.

### 7. **User Profile (`/app/(tabs)/profile.tsx`)**
- **Purpose:** Manage personal identity and account settings.
- **Features:**
  - **Avatar Upload:** Direct integration with device camera/gallery, uploading securely to Cloudinary.
  - **Stats:** Total words written, feedback given, streaks.
  - **Edit Profile:** Update bio, genres, portfolio URL, and experience level.

---

## 🧪 Testing Instructions & User Flows

To test the application as a new developer or QA engineer, follow these flows:

### **Flow 1: New User Registration & Onboarding**
1. Launch the app. Wait for the Animated Splash Screen to finish.
2. Tap **Sign Up**. Enter a valid email, name, and password. Tap Submit.
3. **Expected:** You are redirected to the Onboarding Screen.
4. Select 1-3 genres and continue.
5. **Expected:** You are routed to the Home Dashboard.

### **Flow 2: Logging Writing Progress**
1. On the Home tab, tap **Log Words**.
2. A Bottom Sheet appears. Enter a number (e.g., `500`) and an optional note.
3. Tap **Save**.
4. **Expected:** The Daily Progress ring updates instantly. A success toast appears.

### **Flow 3: Interacting with Prompts**
1. Navigate to the **Prompts** tab (Sparkle icon).
2. Scroll through Community Prompts. Tap the **Heart** icon to upvote.
3. Tap **Write** on a prompt. A modal opens.
4. Enter a 50+ word response and submit.
5. **Expected:** The response is saved, and you can see it under the "My Responses" tab.

### **Flow 4: Sending a Match Request**
1. From Home, tap the search/discover icon in the header.
2. View the list of recommended writers.
3. Tap a writer's card to open their profile.
4. Tap **Connect**.
5. **Expected:** The button changes to "Requested". The other user will see this in their Notifications/Requests page.

### **Flow 5: Providing Feedback**
1. Navigate to the **Feedback** section (via Home quick actions or matches).
2. Open a pending feedback request.
3. Read the attached document link.
4. Fill out the rating (stars) and write a detailed review in the text area.
5. Tap **Submit Review**. (Note: The button is in a sticky footer to avoid keyboard overlap).
6. **Expected:** The request moves to the "Completed" tab.

---

## 🛠️ Setup & Local Development

### **1. Prerequisites**
- Node.js (v18+)
- PostgreSQL (Local or NeonDB)
- Expo CLI (`npm install -g expo-cli`)

### **2. Environment Variables**
You need two `.env` files.

**Backend (`server/.env`):**
```env
DATABASE_URL="postgresql://user:pass@host/db"
PORT=8000
JWT_SECRET="supersecret_access"
JWT_REFRESH_SECRET="supersecret_refresh"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Frontend (`mobile/.env`):**
```env
# Point this to your machine's local IP address during development
EXPO_PUBLIC_API_URL=http://192.168.1.X:8000/api
```

### **3. Running the Backend**
```bash
cd server
npm install
npx prisma db push
npx prisma db seed # (Optional) Populates mock users and prompts
npm run dev
```

### **4. Running the Mobile App**
```bash
cd mobile
npm install
npx expo start -c
```
Use the Expo Go app on your phone to scan the QR code, or press `i` for iOS Simulator / `a` for Android Emulator.

---

## ⚠️ Edge Cases & Handled Scenarios
- **Keyboard Avoidance:** All forms use a custom `KeyboardAvoidingWrapper` or Sticky Footer pattern. Android uses `behavior="height"` combined with `adjustResize`, while iOS uses `padding` to prevent UI overlap.
- **Image Fallbacks:** If a user hasn't uploaded an avatar, the app dynamically generates a PNG initials avatar via the DiceBear API to prevent blank spaces.
- **Token Expiration:** The app utilizes Axios interceptors. If the `accessToken` expires (401 error), it automatically calls the `/auth/refresh` endpoint using the stored refresh token to silently re-authenticate the user.

---

## 🚀 Production Deployment
- **Backend:** Ready for deployment on **Railway**. Refer to the `server/RAILWAY_DEPLOYMENT.md` file and `railway.json` for automated builds.
- **Mobile:** Configured for **EAS (Expo Application Services)**. Store assets (`icon.png`, `splash.png`) are located in `mobile/assets/`. Use `eas build --profile production` to generate APK/AAB and IPA files.
