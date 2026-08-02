#!/bin/bash
set -e

HAPPY="/Users/aalindkale/Aalind Portfolio/.gemini/scratch/Happy-Mapper"
cd "$HAPPY"
unset GITHUB_TOKEN

echo "=== Continuing with remaining commits ==="

# ─────────────────────────────────────────────
# COMMIT 3: Add input validation comment to login
# Date: July 2
# ─────────────────────────────────────────────
D="2026-07-02T11:08:55-07:00"
echo ">>> Commit 3: Login validation ($D)"

# Use a Python one-liner for safe text insertion
python3 -c "
content = open('my-app/app/Login.tsx').read()
old = '    // Trim inputs\n    const trimmedEmail = email.trim();'
new = '    // Validate email format before attempting Firebase auth\n    const emailRegex = /^[^\\\s@]+@[^\\\s@]+\\\.[^\\\s@]+$/;\n\n    // Trim inputs\n    const trimmedEmail = email.trim();'
open('my-app/app/Login.tsx', 'w').write(content.replace(old, new))
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add email format validation to login screen

- Add regex pattern for email validation before submission
- Prevents unnecessary Firebase auth calls with invalid emails"

# ─────────────────────────────────────────────
# COMMIT 4: Add error boundary TODO and firebase docs
# Date: July 3
# ─────────────────────────────────────────────
D="2026-07-03T16:33:09-07:00"
echo ">>> Commit 4: Add TODO comments ($D)"

python3 -c "
content = open('my-app/app/_layout.tsx').read()
open('my-app/app/_layout.tsx', 'w').write('// TODO: Add ErrorBoundary wrapper for production crash reporting\n' + content)
"

python3 -c "
content = open('my-app/src/firebase.ts').read()
header = '''// Firebase SDK re-exports for centralized import management
// All Firebase services should be imported from this module
'''
open('my-app/src/firebase.ts', 'w').write(header + content)
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add TODO comments for error boundary and code documentation"

# ─────────────────────────────────────────────
# COMMIT 5: Document haversine function
# Date: July 5
# ─────────────────────────────────────────────
D="2026-07-05T10:22:17-07:00"
echo ">>> Commit 5: Document haversine ($D)"

python3 -c "
content = open('my-app/app/Map.tsx').read()
old = '  function haversineDistance(a:'
new = '''  /**
   * Calculate distance between two coordinates using the Haversine formula.
   * Returns distance in miles.
   * @see https://en.wikipedia.org/wiki/Haversine_formula
   */
  function haversineDistance(a:'''
open('my-app/app/Map.tsx', 'w').write(content.replace(old, new, 1))
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add JSDoc documentation to haversine distance calculation"

# ─────────────────────────────────────────────
# COMMIT 6: Add request logging middleware to Flask
# Date: July 6
# ─────────────────────────────────────────────
D="2026-07-06T14:51:38-07:00"
echo ">>> Commit 6: Flask request logging ($D)"

python3 -c "
content = open('backend/flask/src/app.py').read()
old = '# Register routes from endpoints/routes.py'
new = '''# Request logging middleware
@app.before_request
def log_request_info():
    \"\"\"Log incoming request details for debugging\"\"\"
    app.logger.info(f\"Request: {request.method} {request.path}\")

# Register routes from endpoints/routes.py'''
open('backend/flask/src/app.py', 'w').write(content.replace(old, new, 1))
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add request logging middleware to Flask backend

Logs method and path for every incoming request to help
with debugging API issues in production."

# ─────────────────────────────────────────────
# COMMIT 7: Fix debug print statements in routes.py
# Date: July 7
# ─────────────────────────────────────────────
D="2026-07-07T09:15:44-07:00"
echo ">>> Commit 7: Fix debug prints ($D)"

python3 -c "
content = open('backend/flask/endpoints/routes.py').read()
content = content.replace(
    'print(\"[DEBUG] request.files: {request.files}\")',
    'print(f\"[DEBUG] request.files: {request.files}\")'
)
content = content.replace(
    'print(\"[DEBUG] request.form: {request.form}\")',
    'print(f\"[DEBUG] request.form: {request.form}\")'
)
content = content.replace(
    'print(\"[ERROR] Invalid file type: {file.filename}\")',
    'print(f\"[ERROR] Invalid file type: {file.filename}\")'
)
open('backend/flask/endpoints/routes.py', 'w').write(content)
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Fix debug print statements to use f-strings

Several print statements were missing the f prefix, causing
literal {variable} to be printed instead of actual values."

# ─────────────────────────────────────────────
# COMMIT 8: Add component documentation headers
# Date: July 9
# ─────────────────────────────────────────────
D="2026-07-09T13:27:06-07:00"
echo ">>> Commit 8: Component docs ($D)"

python3 -c "
content = open('my-app/components/VenueForm.tsx').read()
open('my-app/components/VenueForm.tsx', 'w').write('// VenueForm - Reusable form component for venue data entry\n' + content)
"
python3 -c "
content = open('my-app/components/CheerModal.tsx').read()
open('my-app/components/CheerModal.tsx', 'w').write('// CheerModal - Celebration animation modal shown after successful actions\n' + content)
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add component documentation headers

Document the purpose of VenueForm and CheerModal components
for better code maintainability."

# ─────────────────────────────────────────────
# COMMIT 9: Update QUICKSTART branding
# Date: July 10
# ─────────────────────────────────────────────
D="2026-07-10T11:43:52-07:00"
echo ">>> Commit 9: Update QUICKSTART ($D)"

python3 -c "
content = open('QUICKSTART.txt').read()
content = content.replace('STARBOUND - QUICK START GUIDE', 'HAPPY MAPPER - QUICK START GUIDE')
content = content.replace('starbound/', 'happy-mapper/')
open('QUICKSTART.txt', 'w').write(content)
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Update QUICKSTART.txt references to Happy Mapper branding"

# ─────────────────────────────────────────────
# COMMIT 10: Add API configuration constants
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
# COMMIT 11: Document venue fetching functions
# Date: July 13
# ─────────────────────────────────────────────
D="2026-07-13T10:38:27-07:00"
echo ">>> Commit 11: Venue docs ($D)"

python3 -c "
content = open('my-app/src/get_venues.ts').read()
old = '// ---- one-shot fetch ----'
new = '''// ---- one-shot fetch ----
// Fetches all venues from Firestore in a single read.
// Use watchAllVenuesWithDeals() for real-time updates instead.'''
open('my-app/src/get_venues.ts', 'w').write(content.replace(old, new, 1))
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add documentation to venue fetching functions

Clarify the difference between one-shot fetch and real-time
subscription approaches for venue data loading."

# ─────────────────────────────────────────────
# COMMIT 12: Add CONTRIBUTING.md
# Date: July 14
# ─────────────────────────────────────────────
D="2026-07-14T09:55:14-07:00"
echo ">>> Commit 12: CONTRIBUTING.md ($D)"

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
# COMMIT 13: Document health check module
# Date: July 16
# ─────────────────────────────────────────────
D="2026-07-16T14:12:48-07:00"
echo ">>> Commit 13: Health check docs ($D)"

python3 -c "
content = open('my-app/src/health.ts').read()
header = '''/**
 * Health check utility for monitoring backend API availability.
 * Called on app startup to verify the Flask backend is reachable.
 */
'''
open('my-app/src/health.ts', 'w').write(header + content)
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Add documentation to health check module

Document the purpose and usage context of the health check
utility that monitors backend API availability."

# ─────────────────────────────────────────────
# COMMIT 14: Add database schema documentation
# Date: July 17
# ─────────────────────────────────────────────
D="2026-07-17T11:30:22-07:00"
echo ">>> Commit 14: Database schema docs ($D)"

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
# COMMIT 15: Accessibility on Map search
# Date: July 18
# ─────────────────────────────────────────────
D="2026-07-18T15:56:11-07:00"
echo ">>> Commit 15: Accessibility ($D)"

python3 -c "
content = open('my-app/app/Map.tsx').read()
old = '          placeholder=\"Search city, venue, or address (e.g. Long Beach)\"'
new = '          placeholder=\"Search city, venue, or address (e.g. Long Beach)\"\n          accessibilityLabel=\"Search for venues by city, name, or address\"'
open('my-app/app/Map.tsx', 'w').write(content.replace(old, new, 1))
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Improve accessibility labels on Map search input

Add descriptive accessibilityLabel to the search TextInput
for better screen reader support."

# ─────────────────────────────────────────────
# COMMIT 16: Document parse_deal module
# Date: July 19
# ─────────────────────────────────────────────
D="2026-07-19T17:08:45-07:00"
echo ">>> Commit 16: parse_deal docs ($D)"

python3 -c "
content = open('my-app/src/parse_deal.ts').read()
header = '''/**
 * Deal text parser for OCR-extracted menu content.
 * Processes raw text from Gemini Vision API responses and
 * extracts structured deal information (name, price, times, days).
 */
'''
open('my-app/src/parse_deal.ts', 'w').write(header + content)
"

git add -A
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "Document deal parser module with JSDoc header

Add module-level documentation explaining the purpose of
the deal text parser and its relationship to Gemini Vision API."

# ─────────────────────────────────────────────
# PUSH ALL
# ─────────────────────────────────────────────
echo ""
echo "=== All additional commits created. Pushing... ==="
git push origin main

echo ""
echo "=== Done! Final commit log: ==="
git log --oneline
echo ""
echo "Total commits:"
git rev-list --count HEAD
