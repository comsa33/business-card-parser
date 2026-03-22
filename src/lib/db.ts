import { sql } from "@vercel/postgres";
import { Contact } from "./types";

export async function initTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      company TEXT,
      department TEXT,
      position TEXT,
      phone TEXT,
      mobile TEXT,
      email TEXT,
      address TEXT,
      website TEXT,
      fax TEXT,
      memo TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

function rowToContact(row: Record<string, unknown>): Contact {
  return {
    id: row.id as string,
    name: row.name as string,
    nameEn: (row.name_en as string) || undefined,
    company: (row.company as string) || undefined,
    department: (row.department as string) || undefined,
    position: (row.position as string) || undefined,
    phone: (row.phone as string) || undefined,
    mobile: (row.mobile as string) || undefined,
    email: (row.email as string) || undefined,
    address: (row.address as string) || undefined,
    website: (row.website as string) || undefined,
    fax: (row.fax as string) || undefined,
    memo: (row.memo as string) || undefined,
    imageUrl: (row.image_url as string) || undefined,
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}

export async function getContacts(): Promise<Contact[]> {
  const { rows } = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;
  return rows.map(rowToContact);
}

export async function createContact(contact: Contact): Promise<Contact> {
  const { rows } = await sql`
    INSERT INTO contacts (id, name, name_en, company, department, position, phone, mobile, email, address, website, fax, memo, image_url, created_at, updated_at)
    VALUES (${contact.id}, ${contact.name}, ${contact.nameEn || null}, ${contact.company || null}, ${contact.department || null}, ${contact.position || null}, ${contact.phone || null}, ${contact.mobile || null}, ${contact.email || null}, ${contact.address || null}, ${contact.website || null}, ${contact.fax || null}, ${contact.memo || null}, ${contact.imageUrl || null}, ${contact.createdAt}, ${contact.updatedAt})
    RETURNING *
  `;
  return rowToContact(rows[0]);
}

export async function updateContactById(id: string, contact: Partial<Contact>): Promise<Contact> {
  const { rows } = await sql`
    UPDATE contacts SET
      name = COALESCE(${contact.name ?? null}, name),
      name_en = ${contact.nameEn ?? null},
      company = ${contact.company ?? null},
      department = ${contact.department ?? null},
      position = ${contact.position ?? null},
      phone = ${contact.phone ?? null},
      mobile = ${contact.mobile ?? null},
      email = ${contact.email ?? null},
      address = ${contact.address ?? null},
      website = ${contact.website ?? null},
      fax = ${contact.fax ?? null},
      memo = ${contact.memo ?? null},
      image_url = COALESCE(${contact.imageUrl ?? null}, image_url),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rowToContact(rows[0]);
}

export async function deleteContactById(id: string): Promise<void> {
  await sql`DELETE FROM contacts WHERE id = ${id}`;
}
