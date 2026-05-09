import { ClipboardPaste, ImageUp, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useI18nStore } from "../../i18n";
import { Button } from "../ui/Button";

interface ImageFormulaUploaderProps {
  onLatex: (latex: string) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageFormulaUploader({ onLatex }: ImageFormulaUploaderProps) {
  const language = useI18nStore((state) => state.language);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const submitFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setStatus(language === "zh" ? "正在识别图片公式..." : "Reading formula image...");

      try {
        const image = await fileToDataUrl(file);
        const response = await fetch("/api/ocr/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, fileName: file.name }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.latex) {
          setStatus(payload.error ?? (language === "zh" ? "OCR 暂不可用。" : "OCR is not available."));
          return;
        }

        onLatex(payload.latex);
        setStatus(language === "zh" ? `已识别：${payload.provider}` : `Recognized with ${payload.provider}.`);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : language === "zh" ? "图片读取失败。" : "Could not read the image.");
      } finally {
        setIsLoading(false);
      }
    },
    [language, onLatex],
  );

  return (
    <div
      className="rounded-lg border border-dashed border-lens-line bg-slate-50 p-3 dark:bg-slate-900"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) void submitFile(file);
      }}
      onPaste={(event) => {
        const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
        if (file) void submitFile(file);
      }}
      tabIndex={0}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-lens-ink">{language === "zh" ? "图片 OCR" : "Image OCR"}</p>
          <p className="mt-1 text-xs leading-5 text-lens-muted">
            {language === "zh" ? "上传、拖放或粘贴公式截图；未配置 OCR 时会安全提示。" : "Upload, drop, or paste a formula screenshot; safe fallback appears when OCR is not configured."}
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-lens-line bg-white px-3 py-2 text-sm font-semibold text-lens-ink hover:border-lens-primary dark:bg-slate-950">
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ImageUp size={16} />}
          <span>{language === "zh" ? "上传" : "Upload"}</span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void submitFile(file);
            }}
          />
        </label>
      </div>
      <Button className="mt-3 w-full justify-center" variant="secondary" onClick={() => setStatus(language === "zh" ? "点击此区域后按 Ctrl+V 粘贴截图。" : "Focus this area and press Ctrl+V to paste a screenshot.")}>
        <ClipboardPaste size={16} />
        {language === "zh" ? "粘贴提示" : "Paste hint"}
      </Button>
      {status && <p className="mt-3 text-xs leading-5 text-lens-muted">{status}</p>}
    </div>
  );
}
