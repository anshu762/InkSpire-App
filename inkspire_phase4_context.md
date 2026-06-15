# InkSpire App Context - End of Phase 4 (Community Prompts Module)

This file contains the architectural and structural context of the InkSpire project up to Phase 4. Please read this before making new changes or starting Phase 5.

## 1. Backend Architecture (Express.js + Prisma)
- **Routes & Services**: We have built the `prompts` module which handles Community Writing Prompts.
- **Key Models**:
  - `Prompt`: Represents a writing prompt (Daily or Community). Status becomes 'published' when it hits 10 upvotes.
  - `PromptSubmission`: User responses/stories submitted against a prompt.
  - `PromptUpvote`: Tracks user upvotes on community prompts.
  - `Comment`: Allows users to comment on prompt submissions.
- **Key Endpoints**:
  - `GET /prompts/daily`
  - `GET /prompts/community`
  - `POST /prompts/community` (Suggest prompt)
  - `POST /prompts/:id/upvote`
  - `GET /prompts/:id/submissions`
  - `POST /prompts/:id/submissions`
  - `GET /prompts/submissions/:id/comments`

## 2. Mobile Frontend Architecture (React Native + Expo)
- **Main Screen**: `mobile/app/(tabs)/prompts.tsx`
  - Premium design using LinearGradients (`#4f46e5`, `#ec4899`, etc.).
  - Features a custom Tab segment control (Explore vs. My Responses).
- **Navigation**: `mobile/app/(tabs)/_layout.tsx`
  - Custom Tab bar with premium shadows and custom `paddingBottom` calculated via `useSafeAreaInsets` to prevent cutting off text on Android/iOS bezels.
- **State Management**:
  - Exclusively using `@tanstack/react-query` for server state and caching. `queryClient.invalidateQueries` is used to trigger instant UI updates.

## 3. UI/UX Patterns (CRITICAL)
- **Swipe-to-Dismiss Modals**: We DO NOT use heavy third-party bottom sheets like `@gorhom/bottom-sheet` as they caused bugs. Instead, we use standard React Native `Modal` combined with `Animated.View`, `PanResponder`, and `KeyboardAvoidingView`.
- **Active Modals Implementing Swipe-To-Dismiss**:
  1. `SuggestPromptModal.tsx`
  2. `ResponsesListModal.tsx`
  3. `PromptResponseModal.tsx`
  4. `CommentThread.tsx`
- **Design System**:
  - Premium aesthetic focusing on glassmorphism-like clean white cards, subtle borders (`#f1f5f9`), and primary brand purple colors (`#8b5cf6`, `#4f46e5`).
  - Haptics (`expo-haptics`) are used on success actions (e.g., publishing a prompt).

## 4. Next Steps (Phase 5)
- The app is now ready for AI Integration (StudyCoach, SupportAssistant) using the same premium, stable Modal structure built in Phase 4.
