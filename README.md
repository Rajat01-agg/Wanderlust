# WanderLust

WanderLust is a full-stack travel marketplace where hosts can publish boutique stays, guests can browse curated destinations, and authenticated users can leave verified reviews. The stack combines Express, MongoDB, and server-rendered EJS templates with Passport authentication, Multer-powered uploads, and Cloudinary asset delivery to deliver an Airbnb-style experience that stays lightweight for local development.

## Table of Contents
1. [Highlights](#highlights)
2. [Architecture & Flow](#architecture--flow)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Database Seeding](#database-seeding)
7. [Project Structure](#project-structure)
8. [Key Routes](#key-routes)
9. [Development Tips](#development-tips)
10. [Testing & Quality](#testing--quality)
11. [Scripts](#scripts)
12. [Roadmap Ideas](#roadmap-ideas)

## Highlights
- **User journeys:** Signup, login, logout, and persistent sessions powered by Passport and Express Session, with flash messaging to guide the UI.
- **Listings lifecycle:** Hosts can create, edit, and delete listings with server-side Joi validation, owner-only authorization, and Cloudinary image management via Multer storage engines.
- **Review engine:** Authenticated guests can leave 1-5 star reviews with comments; ownership checks and mongoose middleware enforce cascading deletes for orphan prevention.
- **Resilient backend:** Async route handlers are wrapped with `wrapAsync`, all errors funnel through `ExpressError`, and validation schemas protect against malformed payloads.
- **Seed + styling:** Ready-made seed data spins up example destinations, while responsive EJS layouts and custom CSS provide a polished desktop/mobile experience.

## Architecture & Flow
1. Requests enter Express 5 routers (`/listings`, `/listings/:id/reviews`, `/` for auth) where middleware enforces authentication, authorization, and payload validation.
2. Controllers handle business logic, delegating to Mongoose models (`Listing`, `Review`, `User`) for persistence.
3. Assets are uploaded directly to Cloudinary through `multer-storage-cloudinary`; transformation strings resize preview thumbnails before rendering.
4. Views are composed with `ejs-mate` layouts plus shared `navbar`, `flash`, and `footer` partials so every page stays consistent.
5. Flash messaging + locals (`currUser`, `success`, `error`) keep the UX responsive to auth state changes without additional client-side frameworks.

## Tech Stack
- **Backend:** Node.js, Express 5, Mongoose 8, method-override for RESTful forms.
- **Authentication:** Passport-local, passport-local-mongoose, bcrypt hashing (via plugin), express-session, connect-flash.
- **Templating:** EJS with `ejs-mate`, modular partials, and custom front-end assets.
- **Storage & Media:** MongoDB (local or Atlas), Multer, multer-storage-cloudinary, Cloudinary SDK.
- **Validation & Utilities:** Joi schemas, bespoke middleware guards, ExpressError helper, async wrapper utility.

## Getting Started
1. **Clone + install**
   ```bash
   git clone <repo-url>
   cd Project-WanderLust
   npm install
   ```
2. **Provision a MongoDB instance** (local `mongod` or Atlas URI) and ensure it is running.
3. **Configure Cloudinary** and populate a `.env` file using the template below.
4. **Seed demo content (optional but recommended for screenshots/testing).**
5. **Launch the dev server**
   ```bash
   npm run dev
   ```
   The server defaults to `http://localhost:8080` and connects to `mongodb://127.0.0.1:27017/wanderlust` unless overridden.

## Environment Variables
```
CLOUD_NAME=your_cloudinary_cloud
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust   # optional override
PORT=8080                                         # optional override
SESSION_SECRET=replace_with_long_random_string     # optional override
```

## Database Seeding
```
npm run dev        # ensure MongoDB is running first
node init/index.js # wipes listings and inserts curated fixtures
```
The seeding script augments each record with a default owner ID, so create at least one account (or adjust the script) before running in production environments.

## Project Structure
```
controllers/      Express route handlers for listings, reviews, users
models/           Mongoose schemas + middleware (Listing, Review, User)
routes/           REST routers with auth/validation middleware
views/            EJS templates, layouts, and reusable partials
public/           Static CSS + vanilla JS served by Express
util/             ExpressError class and wrapAsync helper
init/             Seed script and curated listing data
```

## Key Routes
| Method | Path                        | Description                            | Auth |
|--------|-----------------------------|----------------------------------------|------|
| GET    | `/listings`                 | Browse all listings                     | Public |
| POST   | `/listings`                 | Create a listing with image upload      | Logged-in |
| GET    | `/listings/:id`             | View listing detail + reviews           | Public |
| PUT    | `/listings/:id`             | Update listing (owner only)             | Owner |
| DELETE | `/listings/:id`             | Delete listing (owner only)             | Owner |
| POST   | `/listings/:id/reviews`     | Add a review                            | Logged-in |
| DELETE | `/listings/:id/reviews/:id` | Remove own review                       | Author |
| GET    | `/signup` / `/login`        | Auth flows                              | Public |

## Development Tips
- Use the `/demouser` route (temporary) to generate a sample account during local testing.
- Flash messages live in `views/includes/flash.ejs`; edit there to customize UX copy.
- When editing images, Cloudinary’s URL-based transformations (see `listingController.renderEditForm`) make responsive preview tweaks trivial.
- Middleware ordering in `app.js` matters: sessions and flash must be mounted before Passport.

## Testing & Quality
- Joi schemas (`schema.js`) validate inbound payloads before they hit controllers.
- Custom middleware (`middleware.js`) enforces auth/ownership: `isLoggedIn`, `isOwner`, `isReviewAuthor`, and `saveRedirectedUrl` for post-login redirects.
- Centralized error handling (`ExpressError`, final middleware in `app.js`) ensures users see styled error pages instead of raw stack traces.
- Future enhancements include unit tests for controllers/middleware and integration tests using SuperTest + an in-memory Mongo server.

## Scripts
- `npm run dev` → start the Express server (`app.js`).
- `node init/index.js` → wipe + seed the listings collection.

## Roadmap Ideas
- Integrate interactive maps (Mapbox or Leaflet) for each listing with geocoded pins.
- Add booking availability calendars, wishlists, and host dashboards with analytics.
- Build automated test coverage (unit + integration) and wire up GitHub Actions for CI.
- Offer social logins (Google, GitHub) and email verification for higher trust.
