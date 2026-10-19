import type { Metadata } from "next";

type SocialImage = { url: string; alt: string };

const portfolioImage: SocialImage = {
  url: "/opengraph-image.jpg",
  alt: "Alan Sahlan, Product Designer, beside his portrait and AS mark.",
};

// Nested metadata is replaced by each route, so include its text and image together.
export function createPageMetadata(title: string, description: string, image: SocialImage = portfolioImage): Metadata {
  return {
    title,
    description,
    openGraph: { type: "website", title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
