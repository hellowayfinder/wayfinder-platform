# WayFinder Architecture

## Overview

WayFinder is designed as a lightweight, low-maintenance platform that uses Google Workspace as the backend.

```
Parents
    │
    ▼
React + TypeScript + Vite
    │
    ▼
Google Apps Script API
    │
    ▼
Google Sheets
```

---

## Frontend

- React
- TypeScript
- Vite

Responsibilities

- Display provider directory
- Search
- Filters
- Provider details
- Recommendation form
- Feedback form

---

## Backend

Google Apps Script

Responsibilities

- Read provider data
- Accept recommendations
- Accept feedback
- Return JSON

---

## Database

Google Sheets

Acts as the primary database.

Advantages

- Free
- Easy to manage
- Non-technical admins can update data
- No database server required

---

## Hosting

Development

- Replit

Production (Initial)

- Replit Deployments

Future

- Vercel / Cloudflare Pages (optional)

---

## Analytics

Google Analytics 4

Tracks

- Visits
- Searches
- Popular providers
- User journeys

---

## Guiding Principle

Keep the architecture simple.

Optimise for maintainability over complexity.