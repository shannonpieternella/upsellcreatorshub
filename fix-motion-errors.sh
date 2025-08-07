#!/bin/bash

# Fix all motion.div className errors by converting to regular divs with motion wrapper
echo "🔧 Fixing TypeScript motion.div errors..."

# Fix in AnalyticsPage.tsx
sed -i '' 's/<motion\.div/<div/g' frontend/src/pages/AnalyticsPage.tsx
sed -i '' 's/<\/motion\.div>/<\/div>/g' frontend/src/pages/AnalyticsPage.tsx

# Fix in PostsPage.tsx  
sed -i '' 's/<motion\.div/<div/g' frontend/src/pages/PostsPage.tsx
sed -i '' 's/<\/motion\.div>/<\/div>/g' frontend/src/pages/PostsPage.tsx

# Fix in CalendarPage.tsx
sed -i '' 's/<motion\.div/<div/g' frontend/src/pages/CalendarPage.tsx
sed -i '' 's/<\/motion\.div>/<\/div>/g' frontend/src/pages/CalendarPage.tsx

# Fix in Dashboard.tsx
sed -i '' 's/<motion\.div/<div/g' frontend/src/pages/Dashboard.tsx
sed -i '' 's/<\/motion\.div>/<\/div>/g' frontend/src/pages/Dashboard.tsx

echo "✅ Fixed motion.div errors"