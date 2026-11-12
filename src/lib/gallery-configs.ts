import galleryData from "../../public/data/gallery.json";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  sourceType: string;
  useCase: string;
  format: string;
  tags: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = galleryData as GalleryItem[];

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "logos", label: "Logos" },
  { id: "illustration", label: "Illustration" },
  { id: "photo", label: "Photo" },
  { id: "print", label: "Print" },
  { id: "craft", label: "Craft & Vinyl" },
  { id: "apparel", label: "Apparel" },
  { id: "manufacturing", label: "Manufacturing" },
];

export function getItemsByCategory(category: string): GalleryItem[] {
  if (category === "all") return GALLERY_ITEMS;
  return GALLERY_ITEMS.filter((item) => item.category === category);
}
