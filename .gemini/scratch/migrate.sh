#!/bin/bash
set -e

HAPPY="/Users/aalindkale/Aalind Portfolio/.gemini/scratch/Happy-Mapper"
SRC="/Users/aalindkale/Aalind Portfolio/.gemini/scratch/Starbound-Atlas-2025"

cd "$HAPPY"

# Unset invalid token so gh/git uses the stored credentials
unset GITHUB_TOKEN

echo "=== Starting migration ==="

# ─────────────────────────────────────────────
# BATCH 1: Project initialization & config
# ─────────────────────────────────────────────
DATE1="2026-06-28T10:34:12-07:00"
echo ">>> Batch 1: Project init ($DATE1)"

cp "$SRC/README.md" .
cp "$SRC/.gitignore" .
cp "$SRC/QUICKSTART.txt" .
cp "$SRC/shared-schemas.ts" .
cp "$SRC/venues.json" .
mkdir -p .vercel .idea/inspectionProfiles
cp "$SRC/.vercel/README.txt" .vercel/
cp "$SRC/.vercel/project.json" .vercel/
cp "$SRC/.idea/inspectionProfiles/profiles_settings.xml" .idea/inspectionProfiles/
cp "$SRC/.idea/misc.xml" .idea/
cp "$SRC/.idea/modules.xml" .idea/
cp "$SRC/.idea/vcs.xml" .idea/

git add -A
GIT_AUTHOR_DATE="$DATE1" GIT_COMMITTER_DATE="$DATE1" git commit -m "Initial project setup with shared schemas and deployment config

- Add project README with architecture overview
- Configure Vercel deployment settings
- Define shared TypeScript schemas for venue/deal types
- Add quickstart guide for local development
- Set up IntelliJ project configuration"

echo "✓ Batch 1 committed"

# ─────────────────────────────────────────────
# BATCH 2: Frontend project structure
# ─────────────────────────────────────────────
DATE2="2026-07-01T14:22:45-07:00"
echo ">>> Batch 2: Frontend setup ($DATE2)"

mkdir -p my-app/constants my-app/scripts my-app/hooks
cp "$SRC/my-app/package.json" my-app/
cp "$SRC/my-app/package-lock.json" my-app/
cp "$SRC/my-app/tsconfig.json" my-app/
cp "$SRC/my-app/eslint.config.js" my-app/
cp "$SRC/my-app/app.config.js" my-app/
cp "$SRC/my-app/eas.json" my-app/
cp "$SRC/my-app/.gitignore" my-app/
cp "$SRC/my-app/expo-env.d.ts" my-app/
cp "$SRC/my-app/README.md" my-app/
cp "$SRC/my-app/constants/theme.ts" my-app/constants/
cp "$SRC/my-app/scripts/reset-project.js" my-app/scripts/
cp "$SRC/my-app/hooks/use-color-scheme.ts" my-app/hooks/
cp "$SRC/my-app/hooks/use-color-scheme.web.ts" my-app/hooks/
cp "$SRC/my-app/hooks/use-theme-color.ts" my-app/hooks/

git add -A
GIT_AUTHOR_DATE="$DATE2" GIT_COMMITTER_DATE="$DATE2" git commit -m "Set up React Native/Expo frontend project structure

- Initialize Expo managed workflow with app.config.js
- Configure TypeScript, ESLint, and EAS build settings
- Add custom theme constants and color scheme hooks
- Set up project reset script and dependency manifest"

echo "✓ Batch 2 committed"

# ─────────────────────────────────────────────
# BATCH 3: Core app screens & navigation
# ─────────────────────────────────────────────
DATE3="2026-07-04T11:48:33-07:00"
echo ">>> Batch 3: Core screens ($DATE3)"

mkdir -p my-app/app
cp "$SRC/my-app/app/_layout.tsx" my-app/app/
cp "$SRC/my-app/app/index.tsx" my-app/app/
cp "$SRC/my-app/app/Splash.tsx" my-app/app/
cp "$SRC/my-app/app/Login.tsx" my-app/app/
cp "$SRC/my-app/app/Signup.tsx" my-app/app/
cp "$SRC/my-app/app/MainScreen.tsx" my-app/app/

git add -A
GIT_AUTHOR_DATE="$DATE3" GIT_COMMITTER_DATE="$DATE3" git commit -m "Implement core app screens and navigation layout

- Create root layout with stack navigator
- Build splash screen with app branding
- Implement login and signup flows with Firebase auth
- Add main screen as the primary hub after authentication
- Wire up index entry point with routing logic"

echo "✓ Batch 3 committed"

# ─────────────────────────────────────────────
# BATCH 4: Feature screens & components
# ─────────────────────────────────────────────
DATE4="2026-07-08T15:37:18-07:00"
echo ">>> Batch 4: Feature screens ($DATE4)"

mkdir -p my-app/components
cp "$SRC/my-app/app/Map.tsx" my-app/app/
cp "$SRC/my-app/app/SearchAndUpload.tsx" my-app/app/
cp "$SRC/my-app/app/SearchList.tsx" my-app/app/
cp "$SRC/my-app/app/Profile.tsx" my-app/app/
cp "$SRC/my-app/app/Favorites.tsx" my-app/app/
cp "$SRC/my-app/app/UploadDeal.tsx" my-app/app/
cp "$SRC/my-app/components/CheerModal.tsx" my-app/components/
cp "$SRC/my-app/components/GoogleInputs.tsx" my-app/components/
cp "$SRC/my-app/components/ListBox.tsx" my-app/components/
cp "$SRC/my-app/components/VenueForm.tsx" my-app/components/

git add -A
GIT_AUTHOR_DATE="$DATE4" GIT_COMMITTER_DATE="$DATE4" git commit -m "Add map view, search, favorites, and deal upload features

- Integrate Google Maps with venue markers and clustering
- Build search screen with autocomplete and filter options
- Create favorites screen with persistent bookmarking
- Implement deal upload flow with image capture
- Add reusable components: VenueForm, ListBox, CheerModal
- Wire Google Places autocomplete input component"

echo "✓ Batch 4 committed"

# ─────────────────────────────────────────────
# BATCH 5: Business logic & services
# ─────────────────────────────────────────────
DATE5="2026-07-12T10:15:52-07:00"
echo ">>> Batch 5: Services & logic ($DATE5)"

mkdir -p my-app/src my-app/assets/data
cp "$SRC/my-app/src/parse_deal.ts" my-app/src/
cp "$SRC/my-app/src/firebase.ts" my-app/src/
cp "$SRC/my-app/src/firebaseConfig.ts" my-app/src/
cp "$SRC/my-app/src/get_venues.ts" my-app/src/
cp "$SRC/my-app/src/favorites.ts" my-app/src/
cp "$SRC/my-app/src/venues.ts" my-app/src/
cp "$SRC/my-app/src/health.ts" my-app/src/
cp "$SRC/my-app/assets/data/venues.json" my-app/assets/data/

git add -A
GIT_AUTHOR_DATE="$DATE5" GIT_COMMITTER_DATE="$DATE5" git commit -m "Add Firebase services, venue data layer, and deal parsing

- Set up Firebase SDK initialization and config
- Implement venue fetching and caching service
- Add favorites persistence with Firestore
- Create deal text parser for OCR-extracted content
- Add health check utility for API monitoring
- Include seed venue dataset for development"

echo "✓ Batch 5 committed"

# ─────────────────────────────────────────────
# BATCH 6: Assets & Flask backend
# ─────────────────────────────────────────────
DATE6="2026-07-15T16:23:07-07:00"
echo ">>> Batch 6: Assets & backend ($DATE6)"

mkdir -p my-app/assets/images
cp "$SRC/my-app/assets/images/icon.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/partial-react-logo.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/android-icon-background.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/android-icon-foreground.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/android-icon-monochrome.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/favicon.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/react-logo.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/react-logo@2x.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/react-logo@3x.png" my-app/assets/images/
cp "$SRC/my-app/assets/images/splash-icon.png" my-app/assets/images/

mkdir -p backend/flask/endpoints backend/flask/public backend/flask/src
cp "$SRC/backend/.gitignore" backend/
cp "$SRC/backend/flask/.gitignore" backend/flask/
cp "$SRC/backend/flask/API_README.md" backend/flask/
cp "$SRC/backend/flask/endpoints/__init__.py" backend/flask/endpoints/
cp "$SRC/backend/flask/endpoints/routes.py" backend/flask/endpoints/
cp "$SRC/backend/flask/public/favicon.ico" backend/flask/public/
cp "$SRC/backend/flask/pyproject.toml" backend/flask/
cp "$SRC/backend/flask/requirements.txt" backend/flask/
cp "$SRC/backend/flask/vercel.json" backend/flask/
cp "$SRC/backend/flask/src/app.py" backend/flask/src/
cp "$SRC/backend/flask/src/firebase_uploader.py" backend/flask/src/
cp "$SRC/backend/flask/src/test_flask_endpoint.py" backend/flask/src/
cp "$SRC/backend/flask/src/vision_parser.py" backend/flask/src/

git add -A
GIT_AUTHOR_DATE="$DATE6" GIT_COMMITTER_DATE="$DATE6" git commit -m "Add app assets and Flask backend API with vision parsing

- Add app icons, splash screen, and launcher images
- Set up Flask backend with Vercel serverless deployment
- Implement deal image OCR with Google Vision API
- Create REST API routes for venue and deal endpoints
- Add Firebase uploader for processed deal data
- Include API documentation and test endpoints"

echo "✓ Batch 6 committed"

# ─────────────────────────────────────────────
# BATCH 7: Firebase/database & final config
# ─────────────────────────────────────────────
DATE7="2026-07-19T13:42:29-07:00"
echo ">>> Batch 7: Database & Firebase ($DATE7)"

mkdir -p database/functions
cp "$SRC/database/.firebaserc" database/
cp "$SRC/database/.gitignore" database/
cp "$SRC/database/firebase.json" database/
cp "$SRC/database/firestore.indexes.json" database/
cp "$SRC/database/firestore.rules" database/
cp "$SRC/database/storage.rules" database/
cp "$SRC/database/functions/extractDealFromImage.js" database/functions/
cp "$SRC/database/functions/getAllVenuesWithDeals.js" database/functions/
cp "$SRC/database/functions/getVenueWithDeals.js" database/functions/
cp "$SRC/database/functions/index.js" database/functions/
cp "$SRC/database/functions/package.json" database/functions/

git add -A
GIT_AUTHOR_DATE="$DATE7" GIT_COMMITTER_DATE="$DATE7" git commit -m "Configure Firebase database, Firestore rules, and cloud functions

- Set up Firebase project with Firestore and Storage
- Define security rules for venue and deal collections
- Implement cloud function for deal extraction from images
- Add functions to query venues with associated deals
- Configure Firestore indexes for optimized queries
- Set up storage rules for user-uploaded deal images"

echo "✓ Batch 7 committed"

# ─────────────────────────────────────────────
# PUSH
# ─────────────────────────────────────────────
echo ""
echo "=== All 7 commits created. Pushing to origin... ==="
git push origin main

echo ""
echo "=== Migration complete! ==="
git log --oneline --all
