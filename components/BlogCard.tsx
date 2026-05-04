import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card">
      <div className="meta">{post.date}</div>
      <h2>{post.title}</h2>
      {post.excerpt ? <p className="excerpt">{post.excerpt}</p> : null}
    </Link>
  );
}
