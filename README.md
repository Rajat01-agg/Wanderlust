# WanderLust

WanderLust is a full-stack travel marketplace where hosts can publish boutique stays, guests can browse curated destinations, and authenticated users can leave verified reviews. The stack combines Express, MongoDB, and server-rendered EJS templates with Passport authentication, Multer-powered uploads, and Clgoudinary asset delivery to deliver a seamless booking experience that stays lightweight for local development.

## 🌐 Live Demo
**[View Live Application](https://tripnest-nb7z.onrender.com/)**

> **Note:** The application is deployed on Render's free tier, so the first request may take 30-60 seconds to wake up the server.

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
12. [Deployment](#deployment)
13. [Roadmap Ideas](#roadmap-ideas)

## Highlights
- **User journeys:** Signup, login, logout, and persistent sessions powered by Passport and Express Session with MongoStore, plus flash messaging to guide the UI.
- **Cloud database:** MongoDB Atlas integration for production-ready cloud database with secure connection handling and session storage.
- **Listings lifecycle:** Hosts can create, edit, and delete listings with server-side Joi validation, owner-only authorization, and Cloudinary image management via Multer storage engines.
- **Review engine:** Authenticated guests can leave 1-5 star reviews with comments; ownership checks and mongoose middleware enforce cascading deletes for orphan prevention.
- **Legal compliance:** Dedicated Privacy Policy and Terms of Service pages accessible from the footer, ensuring transparency and user trust.
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
- **Authentication:** Passport-local, passport-local-mongoose, bcrypt hashing (via plugin), express-session with connect-mongo for session storage, connect-flash.
- **Templating:** EJS with `ejs-mate`, modular partials, and custom front-end assets.
- **Storage & Media:** MongoDB Atlas (cloud) or local MongoDB, Multer, multer-storage-cloudinary, Cloudinary SDK.
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
Create a `.env` file in the root directory with the following variables:
```
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

DB_URL=mongodb+srv://username:password@cluster.mongodb.net/WanderLust
# For local MongoDB, use: mongodb://127.0.0.1:27017/wanderlust

MAP_TOKEN=your_mapbox_token_here
SECRET_KEY=your_session_secret_key_here
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
  ├── listings/   Listing-related views (index, show, edit, new)
  ├── users/      User authentication views (signup, login)
  ├── includes/   Shared partials (navbar, footer, flash)
  ├── layouts/    Base layout templates
  ├── privacy.ejs Privacy Policy page
  └── terms.ejs   Terms of Service page
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
| GET    | `/privacy`                  | Privacy Policy page                     | Public |
| GET    | `/terms`                    | Terms of Service page                   | Public |

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

## Deployment
The application is deployed on **Render** and is accessible at:
- **Live URL:** [https://tripnest-nb7z.onrender.com/](https://tripnest-nb7z.onrender.com/)

### Deployment Configuration
- **Platform:** Render (Free Tier)
- **Database:** MongoDB Atlas (Cloud)
- **Media Storage:** Cloudinary
- **Session Storage:** MongoDB (via connect-mongo)

### Important Notes
- Free tier instances may spin down after inactivity; first request may take 30-60 seconds to wake up
- Environment variables are configured in Render's dashboard
- Automatic deployments are enabled from the main branch

## Roadmap Ideas
- Integrate interactive maps (Mapbox or Leaflet) for each listing with geocoded pins.
- Add booking availability calendars, wishlists, and host dashboards with analytics.
- Build automated test coverage (unit + integration) and wire up GitHub Actions for CI.
- Offer social logins (Google, GitHub) and email verification for higher trust.
