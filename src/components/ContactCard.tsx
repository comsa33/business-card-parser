"use client";

import { Contact } from "@/lib/types";
import { Building2, Phone, Mail, MapPin, Globe, Pencil, Trash2, User } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const initials = contact.name.slice(0, 1);

  return (
    <div className="contact-card bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] p-4 flex items-center gap-3">
        {contact.imageData ? (
          <img
            src={contact.imageData}
            alt={contact.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-bold text-base truncate">{contact.name}</h3>
          {contact.nameEn && (
            <p className="text-white/60 text-xs truncate">{contact.nameEn}</p>
          )}
          {contact.position && (
            <p className="text-white/80 text-xs truncate">
              {contact.position}
            </p>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2.5">
        {contact.company && (
          <div className="flex items-center gap-2.5 text-sm">
            <Building2 size={15} className="text-[var(--color-text-secondary)] shrink-0" />
            <span className="truncate">
              {contact.company}
              {contact.department && ` · ${contact.department}`}
            </span>
          </div>
        )}
        {(contact.mobile || contact.phone) && (
          <div className="flex items-center gap-2.5 text-sm">
            <Phone size={15} className="text-[var(--color-text-secondary)] shrink-0" />
            <a
              href={`tel:${contact.mobile || contact.phone}`}
              className="text-[var(--color-primary)] hover:underline truncate"
            >
              {contact.mobile || contact.phone}
            </a>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2.5 text-sm">
            <Mail size={15} className="text-[var(--color-text-secondary)] shrink-0" />
            <a
              href={`mailto:${contact.email}`}
              className="text-[var(--color-primary)] hover:underline truncate"
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.address && (
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin size={15} className="text-[var(--color-text-secondary)] shrink-0 mt-0.5" />
            <span className="text-[var(--color-text-secondary)] line-clamp-2">{contact.address}</span>
          </div>
        )}
        {contact.website && (
          <div className="flex items-center gap-2.5 text-sm">
            <Globe size={15} className="text-[var(--color-text-secondary)] shrink-0" />
            <a
              href={contact.website.startsWith("http") ? contact.website : `https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline truncate"
            >
              {contact.website}
            </a>
          </div>
        )}

        {/* No info fallback */}
        {!contact.company && !contact.mobile && !contact.phone && !contact.email && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <User size={15} />
            <span>추가 정보 없음</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="border-t border-[var(--color-border)] px-4 py-2.5 flex justify-end gap-1">
        <button
          onClick={() => onEdit(contact)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition"
          title="수정"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          title="삭제"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
