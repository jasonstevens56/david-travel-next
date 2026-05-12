Restore local images fix installed.

This keeps Sanity/database posts, but when Sanity has no image, it matches the post to the old local MDX post by slug/title and uses the original local image.

Next:
cd ~/Documents/GitHub/david-travel-next
git add .
git commit -m "Restore old post images while using Sanity posts"
git push

Then redeploy in Hostinger.
