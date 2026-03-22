"use client";

import { useState } from "react";
import { X, Download, Upload, FileSpreadsheet, AlertCircle, Check } from "lucide-react";
import { Contact } from "@/lib/types";
import * as XLSX from "xlsx";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onImport: (contacts: Contact[]) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  contacts,
  onImport,
}: SettingsModalProps) {
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleExportExcel = () => {
    if (contacts.length === 0) {
      showToast("내보낼 연락처가 없습니다.");
      return;
    }

    const data = contacts.map((c) => ({
      이름: c.name || "",
      영문명: c.nameEn || "",
      회사: c.company || "",
      부서: c.department || "",
      직책: c.position || "",
      휴대전화: c.mobile || "",
      유선전화: c.phone || "",
      이메일: c.email || "",
      주소: c.address || "",
      웹사이트: c.website || "",
      팩스: c.fax || "",
      메모: c.memo || "",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
      { wch: 15 }, { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "연락처");
    XLSX.writeFile(wb, `aSSIST_PhD_202603_연락처_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("엑셀 파일이 다운로드되었습니다.");
  };

  const handleExportJSON = () => {
    if (contacts.length === 0) {
      showToast("내보낼 연락처가 없습니다.");
      return;
    }
    const json = JSON.stringify(contacts, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aSSIST_PhD_202603_연락처_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON 파일이 다운로드되었습니다.");
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (Array.isArray(imported)) {
            onImport(imported);
            showToast(`${imported.length}개 연락처를 가져왔습니다.`);
          } else {
            showToast("올바른 JSON 형식이 아닙니다.");
          }
        } catch {
          showToast("파일을 읽을 수 없습니다.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold">설정</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Export/Import */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet size={18} className="text-[var(--color-primary)]" />
              <h3 className="font-bold text-sm">데이터 내보내기 / 가져오기</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleExportExcel}
                className="w-full flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition text-left"
              >
                <Download size={18} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium">엑셀로 내보내기</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    .xlsx 파일로 다운로드 ({contacts.length}명)
                  </p>
                </div>
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition text-left"
              >
                <Download size={18} className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium">JSON으로 내보내기</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    데이터 백업 및 공유용
                  </p>
                </div>
              </button>
              <button
                onClick={handleImportJSON}
                className="w-full flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition text-left"
              >
                <Upload size={18} className="text-purple-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium">JSON에서 가져오기</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    동기에게 받은 JSON 파일 불러오기
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-xl p-3 flex gap-2 text-sm">
            <AlertCircle size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div className="text-[var(--color-text-secondary)]">
              <p>데이터는 브라우저에 저장됩니다. 동기들과 공유하려면 JSON으로 내보내기 후 파일을 공유해주세요.</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 toast-enter shadow-lg">
            <Check size={16} />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
