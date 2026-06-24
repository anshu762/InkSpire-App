# InkSpire - Comprehensive Testing Guide

This guide is designed for QA testers, clients, and developers to systematically test every feature of the InkSpire mobile application. Follow these step-by-step instructions to ensure all functionalities are working as expected.

---

## 1. Authentication & Onboarding Flow
**Objective:** Verify that a new user can create an account, select genres, and log in securely.

*   **Test 1.1: Registration Validation**
    *   Open the app. On the Login screen, tap "Sign up".
    *   Leave all fields blank and tap "Sign Up".
    *   **Expected:** Validation errors should appear (e.g., "Email is required").
*   **Test 1.2: Successful Registration**
    *   Enter a valid email, display name, and password. Tap "Sign Up".
    *   **Expected:** You are successfully registered and immediately routed to the Onboarding (Genre Selection) screen.
*   **Test 1.3: Onboarding Process**
    *   Select 2-3 genres from the list.
    *   Tap "Continue".
    *   **Expected:** You are routed to the Home Dashboard.
*   **Test 1.4: Logout and Login**
    *   Go to the "Profile" tab (bottom right). Scroll down and tap "Log out".
    *   **Expected:** You are routed back to the Login screen.
    *   Log back in using the credentials you just created.
    *   **Expected:** You bypass onboarding and go straight to the Home Dashboard.

---

## 2. Home Dashboard & Progress Logging
**Objective:** Verify the user can log their daily word count and start sprints.

*   **Test 2.1: View Daily Goal**
    *   Check the circular progress indicator on the Home screen.
    *   **Expected:** It should display `0 / 500 words` (or whatever the default goal is).
*   **Test 2.2: Log Words**
    *   Tap the **"Log Words"** button. A bottom sheet should slide up.
    *   Type a word count (e.g., `250`) and an optional note. Tap "Save".
    *   **Expected:** The bottom sheet closes, a success toast appears, and the circular progress bar updates immediately to reflect the new total. The note should appear in the "Recent Activity" feed below.
*   **Test 2.3: Start Sprint**
    *   Tap **"Start Sprint"**.
    *   **Expected:** You are navigated to the Sprint Setup/Timer screen.

---

## 3. Community Writing Prompts
**Objective:** Verify the user can interact with prompts, write responses, and engage with the community.

*   **Test 3.1: View Prompts**
    *   Navigate to the **Prompts** tab (sparkle icon).
    *   **Expected:** You should see a highlighted "Daily Challenge" at the top and a list of "Community Prompts" below.
*   **Test 3.2: Upvote a Prompt**
    *   Tap the **Heart** icon on any Community Prompt.
    *   **Expected:** The heart turns pink, the number increases by 1, and the app provides a light vibration (haptic feedback).
*   **Test 3.3: Write a Response**
    *   Tap the **"Write"** button on a prompt. A modal will open.
    *   Type a short story or response (minimum 50 characters).
    *   Tap "Publish".
    *   **Expected:** The modal closes, a success message appears.
*   **Test 3.4: View Your Responses**
    *   On the Prompts tab, tap the **"My Responses"** segmented control at the top.
    *   **Expected:** The response you just wrote should appear in this list.

---

## 4. Matchmaking & Discovery
**Objective:** Verify users can find critique partners and send/receive match requests.

*   **Test 4.1: Discover Writers**
    *   From the Home screen, tap the Search/Compass icon in the top header.
    *   **Expected:** You see a list of recommended writers based on your genres.
*   **Test 4.2: View Profile & Send Request**
    *   Tap on any writer's card.
    *   **Expected:** A bottom sheet opens showing their bio, genres, and portfolio link.
    *   Tap the **"Connect"** button.
    *   **Expected:** The button state changes to "Requested" and a success toast appears.
*   **Test 4.3: Manage Requests**
    *   From the Home screen, tap the Bell/Notifications icon in the top header.
    *   Navigate to the **Match Requests** section.
    *   **Expected:** You can see "Incoming" and "Outgoing" requests. Your recent request should be in the "Outgoing" tab.

---

## 5. Feedback System
**Objective:** Verify users can ask for feedback and provide ratings/reviews.

*   **Test 5.1: Submit Feedback Request**
    *   Go to the Home tab and tap the **"Request Feedback"** quick action.
    *   Fill out the Title, select a Match (partner), choose the Feedback Type (e.g., General, Plot), and paste a Google Doc link.
    *   Tap **Submit Request**.
    *   **Expected:** The request is successfully created and you return to the Home screen.
*   **Test 5.2: Give Feedback (Partner View)**
    *   *(Note: This requires logging in as the partner who received the request).*
    *   Navigate to the Feedback requests list. Tap on the pending request.
    *   Tap on the stars to give a rating (e.g., 4 stars). Write a review in the text box.
    *   Tap **Submit Review**.
    *   **Expected:** The request is marked as "Completed", and the original author is notified.

---

## 6. User Profile & Settings
**Objective:** Verify users can update their identity and settings.

*   **Test 6.1: Avatar Upload**
    *   Navigate to the **Profile** tab.
    *   Tap the camera icon on the avatar placeholder.
    *   Select an image from your device gallery.
    *   **Expected:** The image uploads, and your avatar updates instantly.
*   **Test 6.2: Edit Profile Details**
    *   Tap the **"Edit"** (pencil) icon next to your name.
    *   Update your bio, change your experience level (e.g., Beginner to Intermediate), and add a Portfolio URL.
    *   Tap **Save Changes**.
    *   **Expected:** The profile screen updates with your new information.

---
*End of Testing Guide.*
