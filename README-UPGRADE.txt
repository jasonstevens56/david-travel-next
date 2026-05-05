David Travel site upgrade pack

Copy/merge everything in this ZIP into:
Documents/GitHub/david-travel-next

Choose Replace/Merge.

Then run:
cd ~/Documents/GitHub/david-travel-next
npm run dev

Open:
http://localhost:3000
http://localhost:3000/blog
http://localhost:3000/studio

What this adds:
- Top navigation with Categories, About, Privacy Policy, Terms, Do Not Sell
- Your uploaded David Travel logo
- Search box below nav
- Homepage article cards with headline, teaser text, and image
- Most recent articles sidebar
- Newsletter signup box

Newsletter:
The form is wired for Buttondown using:
https://buttondown.email/api/emails/embed-subscribe/davidtravel

To fully activate it, create a free Buttondown account and either use the davidtravel username
or set NEXT_PUBLIC_NEWSLETTER_ACTION to your Buttondown subscribe form URL.
