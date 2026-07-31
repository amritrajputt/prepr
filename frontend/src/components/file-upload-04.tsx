'use client';

import { File, X } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function FileUpload04() {
  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      toast.error('Only PDF files are accepted.', {
        position: 'bottom-right',
        duration: 3000,
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the 2MB limit.', {
        position: 'bottom-right',
        duration: 3000,
      });
      return;
    }

    setUploadState({ file, progress: 0, uploading: true });

    const interval = setInterval(() => {
      setUploadState((prev) => {
        const newProgress = prev.progress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, progress: 100, uploading: false };
        }
        return { ...prev, progress: newProgress };
      });
    }, 200);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  const { file, progress, uploading } = uploadState;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 flex justify-center items-center">
      <div className="w-full rounded-2xl border border-border bg-card shadow-sm p-6 text-center">
        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          <h3 className="font-semibold text-foreground text-base mb-1 text-center">
            Upload Resume
          </h3>
          <p className="text-xs text-muted-foreground mb-4 text-center">
            Upload your PDF resume to extract experience and target practice questions to your background.
          </p>

          <div
            className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed px-6 py-10 hover:bg-secondary/40 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <File className="h-10 w-10 text-emerald-500 mb-3" />
            <div className="flex items-center justify-center text-muted-foreground text-sm leading-6">
              <p>Drag and drop or</p>
              <label
                className="relative cursor-pointer rounded-sm pl-1 font-semibold text-emerald-500 hover:underline"
                htmlFor="file-upload-03"
              >
                <span>choose file</span>
                <input
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  id="file-upload-03"
                  name="file-upload-03"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                />
              </label>
              <p className="pl-1">to upload</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Accepted type: PDF only</span>
            <span>Max size: 2MB</span>
          </div>

          {file && (
            <Card className="relative mt-4 gap-4 bg-muted p-4 shadow-none border border-border rounded-xl text-left">
              <Button
                aria-label="Remove"
                className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
                onClick={resetFile}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <X className="h-5 w-5 shrink-0" />
              </Button>

              <div className="flex items-center space-x-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border ring-inset">
                  <File className="h-5 w-5 text-emerald-500" />
                </span>
                <div>
                  <p className="font-medium text-foreground text-xs">{file?.name}</p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-2">
                <Progress className="h-1.5" value={progress} />
                <span className="text-muted-foreground text-xs">{progress}%</span>
              </div>
            </Card>
          )}

          <div className="mt-6 flex items-center justify-center space-x-3">
            {file && (
              <Button
                className="whitespace-nowrap rounded-xl"
                onClick={resetFile}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            )}
            <Button
              className="whitespace-nowrap rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 h-10 cursor-pointer disabled:opacity-50"
              disabled={!file || uploading || progress < 100}
              type="submit"
            >
              Start AI Interview
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
