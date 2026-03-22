"use client";

import { Contact } from "@/lib/types";
import { Phone, Mail, Pencil, Trash2 } from "lucide-react";

interface ContactListItemProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactListItem({ contact, onClick, onEdit, onDelete }: ContactListItemProps) {
  const initials = contact.name.slice(0, 1);

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-3 flex items-center gap-3 hover:shadow-sm transition cursor-pointer" onClick={() => onClick(contact)}>
      {/* Avatar */}
      {contact.imageUrl ? (
        <img
          src={contact.imageUrl}
          alt={contact.name}
          className="w-11 h-11 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-bold shrink-0">
          {initials}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="font-bold text-sm truncate">{contact.name}</h3>
          {contact.position && (
            <span className="text-xs text-[var(--color-text-secondary)] truncate shrink-0">
              {contact.position}
            </span>
          )}
        </div>
        {contact.company && (
          <p className="text-xs text-[var(--color-text-secondary)] truncate">
            {contact.company}
            {contact.department && ` · ${contact.department}`}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1">
          {(contact.mobile || contact.phone) && (
            <a
              href={`tel:${contact.mobile || contact.phone}`}
              className="flex items-center gap-1 text-xs text-[var(--color-primary)]"
            >
              <Phone size={12} />
              {contact.mobile || contact.phone}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1 text-xs text-[var(--color-primary)] truncate"
            >
              <Mail size={12} />
              <span className="truncate">{contact.email}</span>
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(contact); }}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(contact.id); }}
          className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
