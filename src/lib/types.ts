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
  imageData?: string; // base64 thumbnail
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = "card" | "list";

export interface ParseResult {
  success: boolean;
  contact?: Partial<Contact>;
  error?: string;
}
