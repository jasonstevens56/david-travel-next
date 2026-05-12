Full-size image fix installed.

This changes image handling so WordPress thumbnail URLs like:
image-150x150.jpg
image-300x200.jpg
image-768x512.jpg

prefer the original image file when it exists:
image.jpg

Next:
cd ~/Documents/GitHub/david-travel-next
git add .
git commit -m "Use full size images instead of thumbnails"
git push

Then redeploy in Hostinger.
