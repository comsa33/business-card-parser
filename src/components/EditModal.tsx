"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { Contact } from "@/lib/types";

interface EditModalProps {
  isOpen: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

const fields = [
  { key: "name", label: "이름" },
  { key: "nameEn", label: "영문명" },
  { key: "company", label: "회사" },
  { key: "department", label: "부서" },
  { key: "position", label: "직책" },
  { key: "mobile", label: "휴대전화" },
  { key: "phone", label: "유선전화" },
  { key: "email", label: "이메일" },
  { key: "address", label: "주소" },
  { key: "website", label: "웹사이트" },
  { key: "fax", label: "팩스" },
  { key: "memo", label: "메모" },
];

export default function EditModal({ isOpen, contact, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Sync form data when contact changes
  if (contact && formData._id !== contact.id) {
    const data: Record<string, string> = { _id: contact.id };
    fields.forEach(({ key }) => {
      data[key] = ((contact as unknown as Record<string, unknown>)[key] as string) || "";
    });
    setFormData(data);
  }

  if (!isOpen || !contact) return null;

  const handleSave = () => {
    const updated: Contact = {
      ...contact,
      ...Object.fromEntries(
        fields.map(({ key }) => [key, formData[key]?.trim() || undefined])
      ),
      name: formData.name?.trim() || contact.name,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold">연락처 수정</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">
                {label}
              </label>
              {key === "memo" ? (
                <textarea
                  value={formData[key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={formData[key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                />
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--color-border)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[var(--color-border)] rounded-xl font-medium hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-light)] transition flex items-center justify-center gap-2"
          >
            <Check size={18} />
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
