This pack connects the public site to Sanity.

Before:
- Homepage/blog/recent articles only read local files from content/posts.
- New Sanity posts appeared in Studio but not on the website.

After:
- Homepage, Blog, Search, Categories, Recent Articles, and individual post pages read Sanity first.
- Local MDX posts remain as fallback content.
- Pages are dynamic so new Sanity posts can appear without rebuilding every page.

Install:
1. Copy/merge these files into Documents/GitHub/david-travel-next
2. Run:
   cd ~/Documents/GitHub/david-travel-next
   git add .
   git commit -m "Connect homepage to Sanity posts"
   git push
3. Redeploy in Hostinger.

Then check:
https://daviddottravel.com/
https://daviddottravel.com/blog
