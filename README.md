# david.travel Next.js Migration Scaffold

This is a static Next.js + MDX rebuild scaffold generated from the WordPress XML exports.

## What is included

- 250 migrated MDX posts in `content/posts`
- App Router pages for home, blog index, and blog post routes
- Sitemap and robots generation
- WordPress XML to MDX migration script
- Used-image extraction list in `used-images.txt`
- Optional image-copy script for `wp-content/uploads`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Re-run migration

The XML exports are stored in `wordpress-exports`.

```bash
npm run migrate
```

## Copy only used images

Extract your WordPress files, then point `WP_UPLOADS_DIR` at `wp-content/uploads`:

```bash
WP_UPLOADS_DIR=/absolute/path/to/wp-content/uploads npm run copy-used-images
```

Copied files go to:

```text
public/images
```

Missing files are reported in:

```text
missing-images.txt
```

## Deploy

Recommended targets:

- Vercel
- Netlify
- Cloudflare Pages

Before production, set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-new-domain.com
```

## Notes

The SQL backup appeared incomplete. The WordPress XML exports are the content source of truth.
MDX files currently preserve much of the WordPress HTML so the migration remains faithful. You can clean individual posts later as needed.
