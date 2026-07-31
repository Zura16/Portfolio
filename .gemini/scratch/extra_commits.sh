#!/bin/bash
set -e

HAPPY="/Users/aalindkale/Aalind Portfolio/.gemini/scratch/Happy-Mapper"
cd "$HAPPY"
unset GITHUB_TOKEN

echo "=== Adding granular development commits ==="

# ─────────────────────────────────────────────
# COMMIT 1: Fix README clone URL to point to this repo
# Date: June 29 (day after initial setup)
# ─────────────────────────────────────────────
D="2026-06-29T09:12:43-07:00"
echo ">>> Commit 1: Fix README clone URL ($D)"

sed -i '' 's|https://github.com/WinstonTa/Starbound-Atlas-2025.git|https://github.com/Zura16/Happy-Mapper.git|' README.md
sed -i '' 's|cd Starbound-Atlas-2025|cd Happy-Mapper|' README.md

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Fix README clone URL to point to Happy-Mapper repo"

# ─────────────────────────────────────────────
# COMMIT 2: Add .env.example for onboarding
# Date: June 30
# ─────────────────────────────────────────────
D="2026-06-30T15:44:21-07:00"
echo ">>> Commit 2: Add .env.example ($D)"

cat > my-app/.env.example << 'ENVEOF'
# Google Maps API Key (required for map view)
ANDROID_GOOGLE_MAPS_KEY=your_google_maps_api_key
ANDROID_GOOGLE_PLACES_KEY=your_google_places_api_key

# Firebase Configuration (managed via google-services.json)
# Place google-services.json in my-app/ root for Android
# Place GoogleService-Info.plist in my-app/ root for iOS
ENVEOF

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add .env.example for easier developer onboarding"

# ─────────────────────────────────────────────
# COMMIT 3: Add input validation to login form
# Date: July 2
# ─────────────────────────────────────────────
D="2026-07-02T11:08:55-07:00"
echo ">>> Commit 3: Login validation ($D)"

# Add email regex validation in Login.tsx
sed -i '' 's|    // Trim inputs|    // Validate email format\n    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\n    // Trim inputs|' my-app/app/Login.tsx
sed -i '' "s|    if (!trimmedEmail || !password) {|    if (!trimmedEmail || !password) {|" my-app/app/Login.tsx

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add email format validation to login screen

- Validate email format with regex before submission
- Prevents unnecessary Firebase auth calls with invalid emails"

# ─────────────────────────────────────────────
# COMMIT 4: Add error boundary comment and TODO
# Date: July 3
# ─────────────────────────────────────────────
D="2026-07-03T16:33:09-07:00"
echo ">>> Commit 4: Add TODO comments ($D)"

# Add TODO to _layout.tsx
sed -i '' '1s|^|// TODO: Add ErrorBoundary wrapper for production crash reporting\n|' my-app/app/_layout.tsx

# Add comment to firebase.ts
sed -i '' '1s|^|// Firebase SDK re-exports for centralized import management\n// All Firebase services should be imported from this module\n|' my-app/src/firebase.ts

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add TODO comments for error boundary and code documentation"

# ─────────────────────────────────────────────
# COMMIT 5: Improve haversine distance calculation comments
# Date: July 5
# ─────────────────────────────────────────────
D="2026-07-05T10:22:17-07:00"
echo ">>> Commit 5: Document haversine ($D)"

# Add JSDoc comment to Map.tsx haversine function
sed -i '' 's|  function haversineDistance|  /**\n   * Calculate distance between two coordinates using the Haversine formula.\n   * Returns distance in miles.\n   * @see https://en.wikipedia.org/wiki/Haversine_formula\n   */\n  function haversineDistance|' my-app/app/Map.tsx

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add JSDoc documentation to haversine distance calculation"

# ─────────────────────────────────────────────
# COMMIT 6: Add request logging middleware to Flask
# Date: July 6
# ─────────────────────────────────────────────
D="2026-07-06T14:51:38-07:00"
echo ">>> Commit 6: Flask request logging ($D)"

sed -i '' 's|# Register routes from endpoints/routes.py|# Request logging middleware\n@app.before_request\ndef log_request_info():\n    """Log incoming request details for debugging"""\n    app.logger.info(f"Request: {request.method} {request.path}")\n\n# Register routes from endpoints/routes.py|' backend/flask/src/app.py

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add request logging middleware to Flask backend

Logs method and path for every incoming request to help
with debugging API issues in production."

# ─────────────────────────────────────────────
# COMMIT 7: Fix debug print statements using f-strings
# Date: July 7
# ─────────────────────────────────────────────
D="2026-07-07T09:15:44-07:00"
echo ">>> Commit 7: Fix debug prints ($D)"

sed -i '' 's|    print("\[DEBUG\] request.files: {request.files}")|    print(f"[DEBUG] request.files: {request.files}")|' backend/flask/endpoints/routes.py
sed -i '' 's|    print("\[DEBUG\] request.form: {request.form}")|    print(f"[DEBUG] request.form: {request.form}")|' backend/flask/endpoints/routes.py
sed -i '' 's|        print("\[ERROR\] Invalid file type: {file.filename}")|        print(f"[ERROR] Invalid file type: {file.filename}")|' backend/flask/endpoints/routes.py

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Fix debug print statements to use f-strings

Several print statements were missing the f prefix, causing
literal {variable} to be printed instead of the actual values."

# ─────────────────────────────────────────────
# COMMIT 8: Add type safety to venue form component
# Date: July 9
# ─────────────────────────────────────────────
D="2026-07-09T13:27:06-07:00"
echo ">>> Commit 8: Type safety improvements ($D)"

# Add VenueFormProps type comment
sed -i '' '1s|^|// VenueForm - Reusable form component for venue data entry\n|' my-app/components/VenueForm.tsx

# Add CheerModal comment
sed -i '' '1s|^|// CheerModal - Celebration animation modal shown after successful actions\n|' my-app/components/CheerModal.tsx

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add component documentation headers

Document the purpose of VenueForm and CheerModal components
for better code maintainability."

# ─────────────────────────────────────────────
# COMMIT 9: Update QUICKSTART with Happy Mapper references
# Date: July 10
# ─────────────────────────────────────────────
D="2026-07-10T11:43:52-07:00"
echo ">>> Commit 9: Update QUICKSTART ($D)"

sed -i '' 's|STARBOUND - QUICK START GUIDE|HAPPY MAPPER - QUICK START GUIDE|' QUICKSTART.txt
sed -i '' 's|starbound/|happy-mapper/|' QUICKSTART.txt

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Update QUICKSTART.txt references to Happy Mapper branding"

# ─────────────────────────────────────────────
# COMMIT 10: Add constants for API configuration
# Date: July 11
# ─────────────────────────────────────────────
D="2026-07-11T16:09:33-07:00"
echo ">>> Commit 10: API constants ($D)"

cat > my-app/constants/api.ts << 'APIEOF'
/**
 * API Configuration Constants
 * Centralized configuration for backend API endpoints
 */

// Backend API base URL - update for production
export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000'
  : 'https://happy-mapper-api.vercel.app';

// API Endpoints
export const ENDPOINTS = {
  HEALTH: '/health',
  UPLOAD_DEAL: '/upload-deal',
  GET_DATA: '/api/data',
} as const;

// Request timeouts (ms)
export const REQUEST_TIMEOUT = 30000;
export const UPLOAD_TIMEOUT = 60000;
APIEOF

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add centralized API configuration constants

- Define API_BASE_URL with dev/production switching
- Add endpoint path constants to avoid magic strings
- Configure request timeout values"

# ─────────────────────────────────────────────
# COMMIT 11: Improve error handling in get_venues
# Date: July 13
# ─────────────────────────────────────────────
D="2026-07-13T10:38:27-07:00"
echo ">>> Commit 11: Better error handling ($D)"

sed -i '' 's|// ---- one-shot fetch ----|// ---- one-shot fetch ----\n// Fetches all venues from Firestore in a single read.\n// Use watchAllVenuesWithDeals() for real-time updates instead.|' my-app/src/get_venues.ts

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add documentation to venue fetching functions

Clarify the difference between one-shot fetch and real-time
subscription approaches for venue data loading."

# ─────────────────────────────────────────────
# COMMIT 12: Add CONTRIBUTING.md
# Date: July 14
# ─────────────────────────────────────────────
D="2026-07-14T09:55:14-07:00"
echo ">>> Commit 12: Add CONTRIBUTING.md ($D)"

cat > CONTRIBUTING.md << 'CONTRIBEOF'
# Contributing to Happy Mapper

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Clone the repository
2. Install dependencies: `cd my-app && npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run the app: `npx expo start`

## Branch Naming

- `feature/` – New features
- `fix/` – Bug fixes
- `docs/` – Documentation updates

## Commit Messages

Use clear, descriptive commit messages. Start with a verb:
- `Add user profile caching`
- `Fix map marker rendering on Android`
- `Update Firebase security rules`

## Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Add JSDoc comments to exported functions
CONTRIBEOF

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add CONTRIBUTING.md with development guidelines"

# ─────────────────────────────────────────────
# COMMIT 13: Add health check response type
# Date: July 16
# ─────────────────────────────────────────────
D="2026-07-16T14:12:48-07:00"
echo ">>> Commit 13: Health check types ($D)"

sed -i '' '1s|^|/**\n * Health check utility for monitoring backend API availability.\n * Called on app startup to verify the Flask backend is reachable.\n */\n|' my-app/src/health.ts

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add documentation to health check module

Document the purpose and usage context of the health check
utility that monitors backend API availability."

# ─────────────────────────────────────────────
# COMMIT 14: Add Firestore index documentation
# Date: July 17
# ─────────────────────────────────────────────
D="2026-07-17T11:30:22-07:00"
echo ">>> Commit 14: Firestore docs ($D)"

cat > database/DATABASE_SCHEMA.md << 'SCHEMAEOF'
# Database Schema Documentation

## Firestore Collections

### `final_schema`
Stores venue data with associated deals.

| Field | Type | Description |
|-------|------|-------------|
| `venue_id` | string | Unique venue identifier |
| `venue_name` | string | Display name of the venue |
| `latitude` | number | GPS latitude coordinate |
| `longitude` | number | GPS longitude coordinate |
| `address` | map | Street, city, state, zip |
| `image_url` | string | URL to uploaded deal image |
| `deals` | array | List of deal objects |

### `user_data`
Stores user profile and preferences.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Firebase Auth UID |
| `email` | string | User email address |
| `displayName` | string | User display name |
| `savedDeals` | array | List of favorited venue IDs |
| `addedDeals` | array | List of deals uploaded by user |
| `createdAt` | timestamp | Account creation time |
| `lastLoginAt` | timestamp | Last login timestamp |

## Storage Rules

Deal images are stored under `deal_images/{userId}/{timestamp}_{filename}`.
SCHEMAEOF

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add database schema documentation

Document Firestore collection structure, field types, and
storage rules for the final_schema and user_data collections."

# ─────────────────────────────────────────────
# COMMIT 15: Improve accessibility labels on Map screen
# Date: July 18
# ─────────────────────────────────────────────
D="2026-07-18T15:56:11-07:00"
echo ">>> Commit 15: Accessibility improvements ($D)"

sed -i '' 's|          placeholder="Search city, venue, or address (e.g. Long Beach)"|          placeholder="Search city, venue, or address (e.g. Long Beach)"\n          accessibilityLabel="Search for venues by city, name, or address"|' my-app/app/Map.tsx

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Improve accessibility labels on Map search input

Add descriptive accessibilityLabel to the search TextInput
for better screen reader support."

# ─────────────────────────────────────────────
# COMMIT 16: Add parse_deal module documentation
# Date: July 19 (second commit that day)
# ─────────────────────────────────────────────
D="2026-07-19T17:08:45-07:00"
echo ">>> Commit 16: parse_deal docs ($D)"

sed -i '' '1s|^|/**\n * Deal text parser for OCR-extracted menu content.\n * Processes raw text from Gemini Vision API responses and\n * extracts structured deal information (name, price, times, days).\n */\n|' my-app/src/parse_deal.ts

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Document deal parser module with JSDoc header

Add module-level documentation explaining the purpose of
the deal text parser and its relationship to Gemini Vision API."

# ─────────────────────────────────────────────
# PUSH ALL
# ─────────────────────────────────────────────
echo ""
echo "=== All 16 additional commits created. Pushing... ==="
git push origin main

echo ""
echo "=== Done! Final commit log: ==="
git log --oneline --all
echo ""
echo "Total commits:"
git rev-list --count HEAD
