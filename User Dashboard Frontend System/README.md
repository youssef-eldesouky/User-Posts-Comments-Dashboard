# Freelance Dashboard (Frontend)

## Overview
A small freelance-style frontend project built with HTML, CSS, JS, jQuery, DataTables and Toastr. It uses **seeded demo data** by default (5 Egyptian users, 6 sports/transfer posts, and comments) and supports local edits stored in `localStorage`.

Features:
- Dashboard with counts (Users / Posts / Comments)
- Users page: DataTables list with Edit/Delete + Favorite star (favorites saved to `localStorage`)
- Posts page: live search, add/edit/delete posts locally (stored in `localStorage`), view comments for seeded posts
- Toastr notifications for every operation
- Loader overlay for network/seed operations
- Light/Dark mode persisted in `localStorage`
- Animate.css for subtle animations

## Seeded data
- 5 Egyptian users (IDs 1..5)
- 6 posts (IDs 1..6) about sports / football transfers
- Comments: 2 comments each for posts 1..4 (posts 5 and 6 have no seeded comments)

The app uses seeded data thanks to helpers in `assets/js/app.js`. To switch to the live JSONPlaceholder API, open `assets/js/app.js` and set `USE_SEED = false`.

## How to run
1. Clone or download the project files.
2. Serve them via a simple static server (recommended):
   - `python -m http.server 8000` then open `http://localhost:8000/index.html`
   - or `npx http-server` if you have Node.js
   - or use VS Code Live Server extension
3. Or open `index.html` directly (some browsers may block fetch when using `file://`).

## Files
- `index.html` — Dashboard
- `users.html` — Users table + local edit/delete/favorites
- `posts.html` — Posts list + local CRUD + comments
- `assets/css/styles.css` — styles (improved UI)
- `assets/js/app.js` — seeded data helpers + utilities
- `assets/js/users.js` — users page logic
- `assets/js/posts.js` — posts page logic

## LocalStorage keys
- `users_local` — local edits/deletes / added users (negative IDs)
- `posts_local` — local edits/deletes / added posts (negative IDs)
- `favorites` — array of user ids
- `theme` — 'light' or 'dark'

## Author
Youssef Eldesouky
