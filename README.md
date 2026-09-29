# To-Do-App
Simple Tasks

A minimalist, responsive local-first task manager built with a "Midnight Emerald" dark aesthetic. Optimized for both mobile viewports (with native safe-area inset scaling) and desktop browsers.

Key Features

•Local-First Data Persistence: Automatically saves all tasks and state to browser localStorage so your data persists without needing an account or server.
•Smart Task Lifecycle Logic:
•Active Tasks: Tasks created today remain active and available for completion.
•Overdue Tasks: Incomplete tasks carried over from previous days are automatically flagged and highlighted under an Overdue section.
•Daily Progress Bar: A dynamic progress tracker displaying real-time completion percentage for the current day's tasks.
•Subtasks Architecture: Supports nested subtasks under primary tasks to break down larger objectives.
•Typewriter Splash Screen: A custom welcome animation ("Welcome to Tasks") on app launch.
•Reward Animations: Integrated confetti dynamic effects on task completions.
•Mobile & Desktop Responsive Layout:
•Scaled with dynamic viewport units (100dvh) to prevent overlap with native mobile navigation bars (home, back, app switcher).
•Built-in env(safe-area-inset-bottom) support for notch-to-notch mobile support.

Tech Stack

Frontend Framework: React 18 (Browser Standalone via Babel)
Styling: Modern CSS3 (Flexbox, Dynamic Viewport Units, Safe Area Insets)
Storage: Web Storage API (localStorage)
Effects: Canvas Confetti API
