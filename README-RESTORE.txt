FULL RESTORE + SANITY CONNECTION PACKAGE

This package restores files that were accidentally deleted and connects the public site to Sanity posts.

Install:
1. Unzip this package.
2. Copy ALL folders/files into:
   Documents/GitHub/david-travel-next
3. Choose Replace/Merge.
4. Run:
   cd ~/Documents/GitHub/david-travel-next
   git add .
   git commit -m "Restore site and connect Sanity content"
   git push
5. Redeploy in Hostinger.

This restores:
- app/layout.tsx
- app/globals.css
- Homepage
- Blog index
- Blog article pages
- Categories
- Search
- About / Privacy / Terms / Do Not Sell pages
- Sanity Studio route
- Header / Footer / Search / Article cards / Sidebar
- lib/posts.ts local fallback
- lib/content.ts Sanity + local combined source
- sanity/env.ts
- sanity/schemaTypes/index.ts
- sanity.config.ts
