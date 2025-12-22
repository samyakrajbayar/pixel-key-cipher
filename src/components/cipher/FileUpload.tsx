import { useCallback, useState } from "react";
import { Upload, Image, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ onFileSelect, accept = ".bmp,image/bmp", label = "BMP Image" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    onFileSelect(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    handleFile(null);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 cursor-pointer group",
            isDragging
              ? "border-primary bg-primary/10 box-glow-subtle"
              : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn(
              "p-4 rounded-full transition-all duration-300",
              isDragging ? "bg-primary/20" : "bg-secondary group-hover:bg-primary/10"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors duration-300",
                isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop your BMP file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-primary/30 rounded-lg p-4 bg-primary/5 box-glow-subtle">
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded border border-border"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-secondary rounded border border-border">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
