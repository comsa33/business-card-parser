export interface Contact {
  id: string;
  name: string;
  nameEn?: string;
  company?: string;
  department?: string;
  position?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  website?: string;
  fax?: string;
  memo?: string;
  imageUrl?: string; // Vercel Blob URL
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = "card" | "list";
export type SortMode = "name" | "recent";

export interface ParseResult {
  success: boolean;
  contact?: Partial<Contact>;
  error?: string;
}
