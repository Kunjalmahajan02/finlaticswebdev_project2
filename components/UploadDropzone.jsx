import { useRef, useState } from "react";

export default function UploadDropzone({ onFile, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const pick = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFile(file);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) pick(e.dataTransfer.files[0]);
      }}
      className={`rounded-2xl border-2 border-dashed p-12 text-center transition
        ${dragging ? "border-orange-500 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => pick(e.target.files[0])}
      />
      <div className="text-5xl mb-4">📄</div>
      <p className="font-medium break-all">{fileName || "Drop your resume PDF here"}</p>
      <p className="text-sm text-zinc-400 mt-1">or click to browse · PDF only · max 4 MB</p>
    </div>
  );
}
