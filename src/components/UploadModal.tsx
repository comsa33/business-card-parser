"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, Camera, Loader2, Check, AlertCircle } from "lucide-react";
import { Contact } from "@/lib/types";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Contact) => void;
}

export default function UploadModal({ isOpen, onClose, onAdd }: UploadModalProps) {
  const [step, setStep] = useState<"upload" | "parsing" | "review">("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<Contact>>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setStep("upload");
    setImagePreview(null);
    setImageUrl(null);
    setParsedData({});
    setError(null);
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const processImage = async (file: File) => {
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setStep("parsing");

      try {
        const base64 = dataUrl.split(",")[1];
        const mimeType = file.type;

        const response = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        });

        const result = await response.json();

        if (result.success) {
          setParsedData(result.contact);
          setImageUrl(result.imageUrl || null);
          setStep("review");
        } else {
          setError(result.error || "파싱에 실패했습니다.");
          setStep("upload");
        }
      } catch {
        setError("서버 연결에 실패했습니다.");
        setStep("upload");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) processImage(file);
  };

  const handleFieldChange = (field: string, value: string) => {
    setParsedData((prev) => ({ ...prev, [field]: value || null }));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const contact: Contact = {
      id: crypto.randomUUID(),
      name: parsedData.name || "이름 없음",
      nameEn: parsedData.nameEn || undefined,
      company: parsedData.company || undefined,
      department: parsedData.department || undefined,
      position: parsedData.position || undefined,
      phone: parsedData.phone || undefined,
      mobile: parsedData.mobile || undefined,
      email: parsedData.email || undefined,
      address: parsedData.address || undefined,
      website: parsedData.website || undefined,
      fax: parsedData.fax || undefined,
      imageUrl: imageUrl || undefined,
      createdAt: now,
      updatedAt: now,
    };
    onAdd(contact);
    handleClose();
  };

  if (!isOpen) return null;

  const fields = [
    { key: "name", label: "이름", required: true },
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
  ];

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold">
            {step === "upload" && "명함 업로드"}
            {step === "parsing" && "분석 중..."}
            {step === "review" && "정보 확인"}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === "upload" && (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-8 text-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-blue-50/30 transition-all upload-pulse"
              >
                <Upload size={40} className="mx-auto mb-3 text-[var(--color-primary)]" />
                <p className="font-medium text-[var(--color-text)]">
                  명함 이미지를 올려주세요
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  클릭 또는 드래그 앤 드롭
                </p>
              </div>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-light)] transition sm:hidden"
              >
                <Camera size={20} />
                카메라로 촬영
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {step === "parsing" && (
            <div className="flex flex-col items-center py-12 gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="명함"
                  className="w-48 h-28 object-cover rounded-xl shadow-md"
                />
              )}
              <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
              <p className="text-[var(--color-text-secondary)]">
                Gemini AI로 명함을 분석하고 있습니다...
              </p>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="명함"
                  className="w-full h-40 object-contain bg-gray-50 rounded-xl"
                />
              )}

              <div className="space-y-3">
                {fields.map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={(parsedData as Record<string, string | null | undefined>)[key] || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      placeholder={`${label}을(를) 입력하세요`}
                      className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {step === "review" && (
          <div className="p-4 border-t border-[var(--color-border)] flex gap-3">
            <button
              onClick={resetState}
              className="flex-1 py-3 border border-[var(--color-border)] rounded-xl font-medium hover:bg-gray-50 transition"
            >
              다시 스캔
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-light)] transition flex items-center justify-center gap-2"
            >
              <Check size={18} />
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
