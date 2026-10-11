# Me 2 You

A separate campus marketplace concept for Hacklanta Social Good. Earnahead's application and backend are untouched.

Run from this directory with `npm start` (Node 22+). Open http://localhost:3100. No install or environment variables needed to run the app. Set PORT to change the port. For tests, run `npm ci` then `npm test`: six exchange/matching checks and DOM integration journeys using jsdom. Campus dates use America/New_York.

## Try the demo

Browse and search the Georgia State default campus; filter by category, type, pickup today, or price. Save a find with its heart. Arrange pickup on a sale or giveaway, create a demo profile, choose a meeting place/time, then confirm pickup in your dashboard. Open Rentals, reserve the camera with a later return date, confirm pickup and return. Post a calculator request to see category/budget/campus matches. Create and edit your own listing, including a photo upload or HTTPS URL. Conversations provide clearly labeled simulated replies.

All interactions persist under `me2you-v1` in this browser's localStorage. To reset the sample data, remove that key in browser developer tools. Uploaded images are limited to 1 MB; browser quota can still be exhausted after several uploads. Profile and listings are device-local. Campus changes filter the marketplace; GSU has sample listings while other campuses begin empty.

## Production gaps

This is a runnable prototype, not a deployed marketplace. Listings, people, seller acceptance, and message replies are demo data. Student status is unverified. No money is collected and there is no external messaging. Photos use remote Unsplash images as illustrative placeholders, not exact item photos; fonts use Google Fonts with local fallbacks. Some remote content requires internet access.

Production needs server-backed accounts, actual campus email verification, authorization and database transactions, seller-controlled availability and acceptance, real-time messages, moderation/reporting, privacy and deletion controls, notifications, concurrent booking protection, rental terms and dispute handling. Pickup today means the seller has marked availability and a mutually agreed time is still required. No price advantage, safety, availability, or impact outcome is guaranteed. Payment and rental enforcement remain out of scope. Do not connect Earnahead's existing Supabase tables to this unrelated demo.

Files: `index.html` entry, `style.css` responsive design, `app.js` UI and persistence, `model.js` exchange/matching rules and sample data, `server.mjs` local server, `tests.mjs` rule checks, `ui-tests.mjs` DOM journeys, `package.json` scripts, `package-lock.json` test dependency lock, this README.
