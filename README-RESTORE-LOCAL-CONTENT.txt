Restore local content/images installed.

This puts the public website back on the local WordPress/MDX posts so the old working images are used again.

Sanity Studio still remains available at /studio, but Sanity/database posts will not drive the public homepage until image fields are properly attached in Sanity.

Next:
cd ~/Documents/GitHub/david-travel-next
git add .
git commit -m "Restore local posts and images on public site"
git push

Then redeploy in Hostinger.
