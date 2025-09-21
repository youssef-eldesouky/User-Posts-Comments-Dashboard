# Freelance Dashboard (Frontend)

## Overview
A freelance-style dashboard mocking a small social media platform built with HTML, CSS, JavaScript, jQuery, DataTables, and Toastr. It uses seeded demo data by default and supports local edits stored in `localStorage`.

### Features
- Dashboard with counts (Users / Posts / Comments)
- Users page: DataTables list with Edit/Delete and Favorite star (favorites saved to `localStorage`)
- Posts page: live search, add/edit/delete posts locally, view comments for seeded posts
- Toastr notifications for every operation
- Loader overlay for network/seed operations
- Light/Dark mode persisted in `localStorage`
- Animate.css for subtle animations

## Seeded Data
- 5 Egyptian users (IDs 1..5)
- 6 sports/transfer posts (IDs 1..6)
- Comments: 2 comments each for posts 1..4 (posts 5 and 6 have no seeded comments)

To switch to the live JSONPlaceholder API, open `assets/js/app.js` and set `USE_SEED = false`.

## How to Run
1. Clone or download the project files.
2. Serve them via a static server:
   - `python -m http.server 8000` then open `http://localhost:8000/index.html`
   - or `npx http-server` if you have Node.js
   - or use VS Code Live Server extension
3. Or open `index.html` directly (some browsers may block fetch when using `file://`).

## File Structure
- `index.html` — Dashboard
- `users.html` — Users table + local edit/delete/favorites
- `posts.html` — Posts list + local CRUD + comments
- `assets/css/styles.css` — Styles
- `assets/js/app.js` — Seeded data helpers + utilities
- `assets/js/users.js` — Users page logic
- `assets/js/posts.js` — Posts page logic

## LocalStorage Keys
- `users_local` — local edits/deletes / added users (negative IDs)
- `posts_local` — local edits/deletes / added posts (negative IDs)
- `favorites` — array of user ids
- `theme` — 'light' or 'dark'
