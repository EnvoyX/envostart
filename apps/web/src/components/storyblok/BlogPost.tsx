import { storyblokEditable } from "@storyblok/react";

export default function BlogPost({ blok }: { blok: any }) {
  return (
    <article {...storyblokEditable(blok)} className="prose prose-invert max-w-none">
      {blok.content && <div dangerouslySetInnerHTML={{ __html: blok.content }} />}
    </article>
  );
}
