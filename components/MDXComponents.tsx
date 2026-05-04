import Image from "next/image";

export const mdxComponents = {
  img: (props: any) => {
    const src = props.src || "";
    // Remote WordPress images are left as normal images until copied locally.
    if (src.startsWith("http")) return <img {...props} loading="lazy" />;
    return <Image src={src} alt={props.alt || ""} width={900} height={600} />;
  }
};
