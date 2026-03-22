"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Contact, ViewMode } from "@/lib/types";
import {
  getContacts,
  saveContacts,
  addContact,
  deleteContact,
  updateContact,
} from "@/lib/storage";
import Header from "@/components/Header";
import ContactCard from "@/components/ContactCard";
import ContactListItem from "@/components/ContactListItem";
import UploadModal from "@/components/UploadModal";
import EditModal from "@/components/EditModal";
import SettingsModal from "@/components/SettingsModal";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data on mount
  useEffect(() => {
    setContacts(getContacts());
    const savedView = localStorage.getItem("view-mode") as ViewMode;
    if (savedView) setViewMode(savedView);
    setMounted(true);
  }, []);

  // Save view mode preference
  useEffect(() => {
    if (mounted) localStorage.setItem("view-mode", viewMode);
  }, [viewMode, mounted]);

  const handleAddContact = (contact: Contact) => {
    setContacts(addContact(contact));
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("이 연락처를 삭제하시겠습니까?")) {
      setContacts(deleteContact(id));
    }
  };

  const handleUpdateContact = (updated: Contact) => {
    setContacts(updateContact(updated.id, updated));
  };

  const handleImport = (imported: Contact[]) => {
    const existing = getContacts();
    const existingIds = new Set(existing.map((c) => c.id));
    const newContacts = imported.filter((c) => !existingIds.has(c.id));
    const merged = [...newContacts, ...existing];
    saveContacts(merged);
    setContacts(merged);
  };

  // Filter contacts by search
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.nameEn?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q) ||
        c.position?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.mobile?.includes(q) ||
        c.phone?.includes(q)
    );
  }, [contacts, searchQuery]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Toolbar */}
      <div className="sticky top-[60px] z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-4 py-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 회사, 직책으로 검색..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Users size={16} />
              <span>
                {filteredContacts.length}
                {searchQuery ? ` / ${contacts.length}` : ""}명
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "card"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                }`}
                title="카드 뷰"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                }`}
                title="리스트 뷰"
              >
                <List size={18} />
              </button>
              <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-gray-100 transition"
                title="설정"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4">
        {contacts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Users size={36} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-lg font-bold mb-2">아직 등록된 연락처가 없습니다</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-xs">
              명함 사진을 업로드하면 AI가 자동으로 정보를 추출합니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(true)}
                className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-light)] transition flex items-center gap-2"
              >
                <Plus size={18} />
                명함 업로드
              </button>
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          /* No search results */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={36} className="text-[var(--color-text-secondary)] mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              &ldquo;{searchQuery}&rdquo;에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : viewMode === "card" ? (
          /* Card View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={setEditingContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                onEdit={setEditingContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      {contacts.length > 0 && (
        <button
          onClick={() => setShowUpload(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary)] text-white rounded-2xl shadow-lg hover:bg-[var(--color-primary-light)] transition-all hover:shadow-xl flex items-center justify-center active:scale-95 z-20"
          title="명함 업로드"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onAdd={handleAddContact}
      />
      <EditModal
        isOpen={!!editingContact}
        contact={editingContact}
        onClose={() => setEditingContact(null)}
        onSave={handleUpdateContact}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        contacts={contacts}
        onImport={handleImport}
      />

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[var(--color-text-secondary)]">
        aSSIST AI PhD. 202603 기수
      </footer>
    </div>
  );
}
