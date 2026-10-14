import { useState } from 'react';
import { Camera, Upload, X, ImageIcon, CheckCircle2 } from 'lucide-react';

interface CameraUploadProps {
  onUpload: (fileName: string) => void;
}

export function CameraUpload({ onUpload }: CameraUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [pendingFile, setPendingFile] = useState<string | null>(null);

  const handleUpload = () => {
    const fakeNames = [
      'work_quadratic_01.jpg',
      'homework_factoring.jpg',
      'notes_parabola.jpg',
      'practice_set_3.jpg',
    ];
    const name = fakeNames[uploadedFiles.length % fakeNames.length];
    setPendingFile(name);
    setShowPreview(true);
  };

  const confirmUpload = () => {
    if (pendingFile) {
      setUploadedFiles([...uploadedFiles, pendingFile]);
      onUpload(pendingFile);
      setPendingFile(null);
      setShowPreview(false);
    }
  };

  const cancelUpload = () => {
    setPendingFile(null);
    setShowPreview(false);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="text-sky2-500" size={18} />
        <h3 className="font-display text-base font-bold text-ink-900">Upload Your Work</h3>
      </div>

      <p className="mb-4 text-xs text-ink-500">
        Snap a photo of your handwritten work and the tutor will guide you through it.
      </p>

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/50 py-8 transition-all hover:border-brand-300 hover:bg-brand-50/30"
        onClick={handleUpload}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky2-400 to-sky2-600 shadow-md">
          <Camera className="text-white" size={24} />
        </div>
        <p className="text-sm font-semibold text-ink-700">Take Photo or Upload</p>
        <p className="mt-0.5 text-xs text-ink-400">JPG, PNG up to 10MB</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-sky2-500">
          <Upload size={13} />
          Click to browse
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-ink-600">Recent Uploads</p>
          {uploadedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-ink-50/50 p-2.5 animate-fade-in"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky2-50">
                <ImageIcon className="text-sky2-500" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-ink-700">{file}</p>
                <p className="text-[10px] text-brand-500 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Analyzed by tutor
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload preview modal */}
      {showPreview && pendingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 backdrop-blur-sm animate-fade-in" onClick={cancelUpload}>
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-display text-lg font-bold text-ink-900">Preview</h4>
              <button onClick={cancelUpload} className="text-ink-400 hover:text-ink-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 flex flex-col items-center rounded-2xl bg-gradient-to-br from-ink-50 to-ink-100 py-10">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky2-400 to-sky2-600 shadow-lg">
                <ImageIcon className="text-white" size={28} />
              </div>
              <p className="text-sm font-semibold text-ink-700">{pendingFile}</p>
              <p className="mt-1 text-xs text-ink-400">Handwritten work preview</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={cancelUpload}
                className="flex-1 rounded-xl border border-ink-200 py-2.5 text-sm font-semibold text-ink-600 transition-all hover:bg-ink-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                Send to Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
