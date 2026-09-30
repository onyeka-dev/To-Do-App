# Project Guidelines & AI Agent Protocol — To-Do App

## 1. Project Overview & Architecture
- **App Name:** Modern To-Do App
- **Architecture:** Single-file client-side application (`index.html`) using React 18 via CDN.
- **State & Persistence:** LocalStorage for data persistence. No backend server or external database.
- **Key Features:**
  - Task lifecycle management (add, edit, complete, delete)
  - Subtask nesting & completion tracking
  - Daily progress tracking
  - Typewriter-style splash screen animation
  - Dark-themed UI with cross-platform responsive design
- **Deployment:** GitHub Pages static hosting.

---

## 2. Technical Rules & Constraints
When making updates or adding new features, you MUST adhere to the following rules:

1. **Maintain Single-File Integrity:** 
   - All HTML, modern CSS, inline React components (Babel/JSX via CDN), and scripts must remain inside `index.html` unless explicitly requested otherwise.
2. **Viewport & Mobile Standards:**
   - Preserve dynamic viewport units (`dvh` / `svh`) and native safe-area insets (`env(safe-area-inset-bottom)`) to ensure full compatibility with mobile browser navigation bars.
3. **State & Storage Handling:**
   - Always keep `LocalStorage` synchronizations in sync with React state transitions.
   - Guard against missing or corrupted `LocalStorage` keys with safe fallbacks and defensive default values.
4. **Component Design:**
   - Use clean, modular React components within the single file.
   - Maintain pure function handlers for subtask nesting and completion calculations.

---

## 3. Task Execution Workflow for AI Agents
When prompted with a change request or new feature:

1. **Step 1: Read & Analyze** — Review the target sections in `index.html`.
2. **Step 2: Plan First** — Present a concise bulleted plan outlining changes to State, UI, and Storage logic.
3. **Step 3: Execute Line-by-Line** — Provide whole updated code blocks or exact search-and-replace blocks to prevent broken HTML tags or missing closing brackets.
4. **Step 4: Verify** — Double-check that mobile viewport CSS rules and LocalStorage handlers remain untouched and fully functional.

---

## 4. Verification Checklist
Before completing any task, ensure:
- [ ] The app renders correctly without external build steps or node modules.
- [ ] LocalStorage reads/writes correctly on page refresh.
- [ ] Subtask updates correctly update parent progress bars.
- [ ] Responsive layout, safe area insets, and dark theme remain intact.
