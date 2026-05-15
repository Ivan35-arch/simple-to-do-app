---
name: Simple To-Do App
overview: "Bootstrap a zero-build static To-Do list: one HTML page, one stylesheet, and one script with add, toggle complete, delete, and optional browser persistence via localStorage."
todos:
  - id: scaffold-html
    content: Create index.html with form, ul#todo-list, link to styles.css and defer app.js
    status: completed
  - id: styles-css
    content: "Add styles.css: layout, list/checkbox/delete button, completed state, focus-visible"
    status: completed
  - id: app-logic
    content: "Implement app.js: model array, localStorage load/save, add/toggle/delete, render()"
    status: completed
isProject: false
---

# Simple To-Do list (HTML/CSS/JS)

## Assumptions

- **No bundler or framework** — open `index.html` in a browser or serve the folder with any static server.
- **Persistence** — tasks saved in `localStorage` so a refresh does not wipe the list (easy to remove if you prefer session-only).
- **Scope** — single list, text tasks only (no dates, categories, or accounts).

## File layout

| File | Role |
|------|------|
| [index.html](index.html) | Semantic structure: heading, form (input + add button), list container (`<ul>`), optional empty state. |
| [styles.css](styles.css) | Layout, typography, focus states, completed-task styling (e.g. line-through + muted color), responsive spacing. |
| [app.js](app.js) | All behavior and data. |

Link assets from HTML: `<link rel="stylesheet" href="styles.css">` before `</head>`, `<script src="app.js" defer></script>` before `</body>`.

## Data model (in JavaScript)

- Array of objects, e.g. `{ id, text, done }` where `id` is a string from `crypto.randomUUID()` (with a tiny fallback if needed for very old browsers).
- **Load** on startup: `JSON.parse(localStorage.getItem('todos'))` with validation (must be an array of expected shape; otherwise start empty).
- **Save** after every mutation: `localStorage.setItem('todos', JSON.stringify(tasks))`.

## UI behavior

1. **Add** — Submit form (or click Add): trim text; reject empty; push new task; re-render; clear input; keep focus on input.
2. **Toggle done** — Checkbox per row updates `done` and re-renders (or toggles a class on the row for performance; still persist the boolean).
3. **Delete** — Button per row removes that `id`, save, re-render.
4. **Render** — Clear list, loop tasks, build DOM (or one template function) so there is a single code path for initial load and updates.

Optional niceties that stay “simple”: Enter to submit, **empty state** message when the list has no tasks, **aria** attributes on the list and checkboxes for basic accessibility.

## Styling direction

- System font stack, comfortable max-width container, clear hierarchy (title, form, list).
- Distinct styles for default vs completed rows; visible `:focus-visible` outlines on interactive elements.

## How you will run it

- Double-click `index.html`, or from the project folder: `npx serve .` (or Python `http.server`) if you prefer same-origin behavior — `localStorage` works with `file://` in modern desktop browsers, but a tiny local server avoids any edge cases.

## What we will not add (unless you ask later)

- Backend, auth, sync, drag-and-drop reorder, due dates, or multiple lists.
