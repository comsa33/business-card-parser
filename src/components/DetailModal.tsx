"use client";

import { Contact } from "@/lib/types";
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Pencil,
  Trash2,
  CreditCard,
  UserPlus,
} from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  contact: Contact | null;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function DetailModal({
  isOpen,
  contact,
  onClose,
  onEdit,
  onDelete,
}: DetailModalProps) {
  const handleSaveToPhone = () => {
    if (!contact) return;
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      `N:${contact.name};;;`,
    ];
    if (contact.company) lines.push(`ORG:${contact.company}`);
    if (contact.position) lines.push(`TITLE:${contact.position}`);
    if (contact.mobile) lines.push(`TEL;TYPE=CELL:${contact.mobile}`);
    if (contact.phone) lines.push(`TEL;TYPE=WORK:${contact.phone}`);
    if (contact.email) lines.push(`EMAIL:${contact.email}`);
    if (contact.address) lines.push(`ADR;TYPE=WORK:;;${contact.address};;;;`);
    if (contact.website) lines.push(`URL:${contact.website}`);
    if (contact.memo) lines.push(`NOTE:${contact.memo}`);
    lines.push("END:VCARD");

    const blob = new Blob([lines.join("\n")], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contact.name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen || !contact) return null;

  const infoRows = [
    { icon: Building2, label: "회사", value: [contact.company, contact.department].filter(Boolean).join(" · ") },
    { icon: Building2, label: "직책", value: contact.position },
    { icon: Phone, label: "휴대전화", value: contact.mobile, href: `tel:${contact.mobile}` },
    { icon: Phone, label: "유선전화", value: contact.phone, href: `tel:${contact.phone}` },
    { icon: Mail, label: "이메일", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Globe, label: "웹사이트", value: contact.website, href: contact.website?.startsWith("http") ? contact.website : `https://${contact.website}` },
    { icon: MapPin, label: "주소", value: contact.address },
  ].filter((r) => r.value);

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold truncate">{contact.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Business Card Image */}
          {contact.imageUrl ? (
            <img
              src={contact.imageUrl}
              alt={`${contact.name} 명함`}
              className="w-full rounded-xl border border-[var(--color-border)] object-contain bg-gray-50"
            />
          ) : (
            <div className="w-full py-12 rounded-xl bg-gray-50 border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
              <CreditCard size={40} className="mb-2 opacity-30" />
              <p className="text-sm">명함 이미지가 없습니다</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-3">
            {contact.nameEn && (
              <p className="text-sm text-[var(--color-text-secondary)]">{contact.nameEn}</p>
            )}
            {infoRows.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3 text-sm">
                <Icon size={16} className="text-[var(--color-text-secondary)] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="break-all">{value}</p>
                  )}
                </div>
              </div>
            ))}
            {contact.memo && (
              <div className="text-sm bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">메모</p>
                <p className="whitespace-pre-wrap">{contact.memo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex gap-3">
          <button
            onClick={handleSaveToPhone}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-light)] transition flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            연락처 저장
          </button>
          <button
            onClick={() => { onClose(); onEdit(contact); }}
            className="py-3 px-5 border border-[var(--color-border)] rounded-xl font-medium hover:bg-gray-50 transition"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm("이 연락처를 삭제하시겠습니까?")) {
                onDelete(contact.id);
                onClose();
              }
            }}
            className="py-3 px-5 border border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
