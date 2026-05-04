#!/usr/bin/env python3
"""Convert WordPress WXR XML exports to MDX files for this Next.js project.

Usage:
  python scripts/migrate-wordpress.py wordpress-exports/*.xml
"""
from __future__ import annotations
import argparse
import html
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "content" / "posts"
REPORT = ROOT / "migration-report.md"
IMAGE_LIST = ROOT / "used-images.txt"

NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "wp": "http://wordpress.org/export/1.2/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
}


def text(el, path: str, default: str = "") -> str:
    found = el.find(path, NS)
    return found.text if found is not None and found.text is not None else default


def slugify(value: str) -> str:
    value = html.unescape(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "post"


def yaml_string(value: str) -> str:
    value = (value or "").replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    return f'"{value}"'


def yaml_array(values: list[str]) -> str:
    return "[" + ", ".join(yaml_string(v) for v in values if v) + "]"


def clean_content(raw: str) -> str:
    raw = raw or ""
    raw = html.unescape(raw)
    raw = re.sub(r"<!--\s*/?wp:.*?-->", "", raw, flags=re.S)
    raw = re.sub(r"\[(caption|gallery|embed|video|audio|playlist)[^\]]*\]", "", raw, flags=re.I)
    raw = re.sub(r"\[/caption\]", "", raw, flags=re.I)
    raw = raw.replace("<br>", "<br />").replace("<hr>", "<hr />")
    raw = re.sub(r"\n{3,}", "\n\n", raw).strip()
    return raw


def extract_images(content: str) -> list[str]:
    refs = set()
    for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', content, flags=re.I):
        refs.add(m.group(1))
    for m in re.finditer(r'https?://[^\s"\')]+/wp-content/uploads/[^\s"\')]+', content, flags=re.I):
        refs.add(m.group(0))
    return sorted(refs)


def path_from_upload_url(url: str) -> str | None:
    try:
        path = unquote(urlparse(url).path)
    except Exception:
        return None
    marker = "/wp-content/uploads/"
    if marker in path:
        return path.split(marker, 1)[1]
    if path.startswith("/wp-content/uploads/"):
        return path[len("/wp-content/uploads/"):]
    return None


def category_terms(item) -> tuple[list[str], list[str]]:
    categories, tags = [], []
    for c in item.findall("category"):
        domain = c.attrib.get("domain", "")
        label = c.text or c.attrib.get("nicename", "")
        if domain == "category":
            categories.append(label)
        elif domain == "post_tag":
            tags.append(label)
    return categories, tags


def postmeta(item) -> dict[str, list[str]]:
    meta: dict[str, list[str]] = {}
    for pm in item.findall("wp:postmeta", NS):
        key = text(pm, "wp:meta_key")
        val = text(pm, "wp:meta_value")
        meta.setdefault(key, []).append(val)
    return meta


def unique_path(slug: str, seen: set[str]) -> str:
    base = slug
    i = 2
    while slug in seen:
        slug = f"{base}-{i}"
        i += 1
    seen.add(slug)
    return slug


def migrate(xml_paths: list[Path]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    migrated = 0
    image_refs: set[str] = set()
    warnings: list[str] = []

    for xml_path in xml_paths:
        tree = ET.parse(xml_path)
        channel = tree.getroot().find("channel")
        if channel is None:
            warnings.append(f"No channel found in {xml_path.name}")
            continue
        for item in channel.findall("item"):
            post_type = text(item, "wp:post_type")
            status = text(item, "wp:status")
            if post_type != "post" or status != "publish":
                continue
            title = text(item, "title", "Untitled")
            slug = text(item, "wp:post_name") or slugify(title)
            slug = unique_path(slugify(slug), seen)
            date = text(item, "wp:post_date")[:10] or text(item, "pubDate")
            link = text(item, "link")
            excerpt = clean_content(text(item, "excerpt:encoded"))
            content = clean_content(text(item, "content:encoded"))
            categories, tags = category_terms(item)
            meta = postmeta(item)
            seo_title = (meta.get("_yoast_wpseo_title") or meta.get("rank_math_title") or [""])[0]
            seo_description = (meta.get("_yoast_wpseo_metadesc") or meta.get("rank_math_description") or [""])[0]
            images = extract_images(content)
            image_refs.update(images)
            featured = images[0] if images else ""

            frontmatter = [
                "---",
                f"title: {yaml_string(title)}",
                f"slug: {yaml_string(slug)}",
                f"date: {yaml_string(date)}",
                f"excerpt: {yaml_string(re.sub('<[^<]+?>', '', excerpt)[:240])}",
                f"originalUrl: {yaml_string(link)}",
                f"canonical: {yaml_string(link)}",
                f"featuredImage: {yaml_string(featured)}",
                f"categories: {yaml_array(categories)}",
                f"tags: {yaml_array(tags)}",
                f"seoTitle: {yaml_string(seo_title)}",
                f"seoDescription: {yaml_string(seo_description)}",
                "---",
                "",
            ]
            body = content or excerpt or ""
            if not body.strip():
                warnings.append(f"Empty content: {slug}")
            (OUT_DIR / f"{slug}.mdx").write_text("\n".join(frontmatter) + body + "\n", encoding="utf-8")
            migrated += 1

    upload_rel_paths = sorted(filter(None, (path_from_upload_url(u) for u in image_refs)))
    IMAGE_LIST.write_text("\n".join(upload_rel_paths) + ("\n" if upload_rel_paths else ""), encoding="utf-8")
    REPORT.write_text(
        "# Migration Report\n\n"
        f"- Posts migrated: {migrated}\n"
        f"- Unique image references found: {len(image_refs)}\n"
        f"- Upload-relative image paths written to: `used-images.txt`\n"
        f"- Warnings: {len(warnings)}\n\n"
        + ("## Warnings\n\n" + "\n".join(f"- {w}" for w in warnings) + "\n" if warnings else ""),
        encoding="utf-8",
    )
    print(f"Migrated {migrated} posts. Found {len(image_refs)} image references.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("xml", nargs="+", type=Path)
    args = parser.parse_args()
    migrate(args.xml)
