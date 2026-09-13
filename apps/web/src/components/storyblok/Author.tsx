import { storyblokEditable } from "@storyblok/react";

export default function Author({ blok }: { blok: any }) {
  return (
    <div {...storyblokEditable(blok)} className="flex items-center gap-4">
      {blok.avatar?.filename && (
        <img
          src={blok.avatar.filename}
          alt={blok.name}
          className="h-12 w-12 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="font-semibold">{blok.name}</h3>
        {blok.bio && (
          <div
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: blok.bio }}
          />
        )}
      </div>
    </div>
  );
}
