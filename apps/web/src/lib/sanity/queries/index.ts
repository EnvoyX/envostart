import groq from 'groq';
export const POSTS_QUERY = groq`*[
    _type == "post" &&
    defined(slug.current)
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    readingTime,
    mainImage,
    visibility,
    author->{
      name,
      avatar
    },
    categories[]->{
      title
    }
  }`;

export const POST_SLUG_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      body,
      visibility,
      author->{
        name,
        avatar
      },
      categories[]->{
        title
      },
      tags
    }`;
