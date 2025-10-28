# ThoughtStream

ThoughtStream is a simple full-stack student feedback manager built with Node.js, Express, and MongoDB (Mongoose). It demonstrates submitting feedback from a frontend form, saving it to MongoDB, and displaying all feedback.

## Features

- Submit feedback (name, rating, comment)
- View all submitted feedback
- Simple, minimal codebase for learning and extension

## Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.

2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm run start
# or for development with auto-reload
npm run dev
```

4. Open `http://localhost:3000/` to submit feedback and `http://localhost:3000/all.html` to view all feedback.

## API

- POST /api/feedback
  - Body: { name: string, rating: number (1-5), comment?: string }
  - Response: saved feedback document

- GET /api/feedback
  - Response: Array of feedback documents (most recent first)

## Project structure

- `server.js` — Express server and routes
- `models/Feedback.js` — Mongoose model
- `public/` — Frontend static files

## Notes & Next steps

- Add tests and CI
- Add form validation and better UX
- Deploy to a platform like Render, Heroku, or Vercel (server+db)

