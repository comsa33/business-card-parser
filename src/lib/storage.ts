import { Contact } from "./types";

const STORAGE_KEY = "assist-phd-contacts";

export function getContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function addContact(contact: Contact): Contact[] {
  const contacts = getContacts();
  contacts.unshift(contact);
  saveContacts(contacts);
  return contacts;
}

export function updateContact(id: string, updates: Partial<Contact>): Contact[] {
  const contacts = getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updates, updatedAt: new Date().toISOString() };
    saveContacts(contacts);
  }
  return contacts;
}

export function deleteContact(id: string): Contact[] {
  const contacts = getContacts().filter((c) => c.id !== id);
  saveContacts(contacts);
  return contacts;
}

export function exportContactsJSON(): string {
  return JSON.stringify(getContacts(), null, 2);
}

export function importContactsJSON(json: string): Contact[] {
  try {
    const imported: Contact[] = JSON.parse(json);
    const existing = getContacts();
    const existingIds = new Set(existing.map((c) => c.id));
    const newContacts = imported.filter((c) => !existingIds.has(c.id));
    const merged = [...newContacts, ...existing];
    saveContacts(merged);
    return merged;
  } catch {
    throw new Error("잘못된 JSON 형식입니다.");
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
