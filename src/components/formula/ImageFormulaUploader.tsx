import { ClipboardPaste, ImageUp, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useI18nStore } from "../../i18n";
import { Button } from "../ui/Button";

interface ImageFormulaUploaderProps {
  imagePreview?: string;
  onImage: (image: string, fileName: string) => void;
  onClearImage: () => void;
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

export function ImageFormulaUploader({ imagePreview, onImage, onClearImage, onLatex }: ImageFormulaUploaderProps) {
  const language = useI18nStore((state) => state.language);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const submitFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setStatus(language === "zh" ? "请选择 PNG、JPEG 或 WebP 图片。" : "Choose a PNG, JPEG, or WebP image.");
        return;
      }

      setIsLoading(true);
      setStatus(language === "zh" ? "正在读取图片并尝试 OCR..." : "Reading the image and attempting OCR...");

      try {
        const image = await fileToDataUrl(file);
        onImage(image, file.name);

        const response = await fetch("/api/ocr/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, fileName: file.name }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.latex) {
          setStatus(
            language === "zh"
              ? "图片已保留，可直接点击“LLM 深度解释”；OCR 未配置时不影响多模态解析。"
              : "The image is retained for LLM analysis. Multimodal explanation still works when OCR is unavailable.",
          );
          return;
        }

        onLatex(payload.latex);
        setStatus(language === "zh" ? `OCR 已识别：${payload.provider}` : `Recognized with ${payload.provider}.`);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : language === "zh" ? "图片读取失败。" : "Could not read the image.");
      } finally {
        setIsLoading(false);
      }
    },
    [language, onImage, onLatex],
  );

  return (
    <div
      className="rounded-xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-3 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-slate-950"
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-lens-ink">{language === "zh" ? "公式图片 / 截图" : "Formula image / screenshot"}</p>
          <p className="mt-1 text-xs leading-5 text-lens-muted">
            {language === "zh"
              ? "上传、拖放或 Ctrl+V 粘贴。图片会同时用于 OCR 和 LLM 视觉解析。"
              : "Upload, drop, or paste with Ctrl+V. The image is used for both OCR and LLM vision analysis."}
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-lens-line bg-white px-3 py-2 text-sm font-semibold text-lens-ink shadow-sm hover:border-lens-primary dark:bg-slate-950">
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ImageUp size={16} />}
          <span>{language === "zh" ? "上传" : "Upload"}</span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void submitFile(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-lg border border-lens-line bg-white p-2 dark:bg-slate-950">
          <img className="max-h-44 w-full rounded-md object-contain" src={imagePreview} alt={language === "zh" ? "已上传公式" : "Uploaded formula"} />
          <button
            type="button"
            aria-label={language === "zh" ? "移除图片" : "Remove image"}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-lens-line bg-white/95 text-lens-muted shadow-sm hover:text-lens-danger dark:bg-slate-950/95"
            onClick={() => {
              onClearImage();
              setStatus("");
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <Button
        className="mt-3 w-full justify-center"
        variant="secondary"
        onClick={() => setStatus(language === "zh" ? "点击此区域后按 Ctrl+V 粘贴截图。" : "Focus this area and press Ctrl+V to paste a screenshot.")}
      >
        <ClipboardPaste size={16} />
        {language === "zh" ? "粘贴截图提示" : "Paste screenshot hint"}
      </Button>
      {status && <p className="mt-3 text-xs leading-5 text-lens-muted">{status}</p>}
    </div>
  );
}
