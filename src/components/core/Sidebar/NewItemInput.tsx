import { useEffect, useRef, useState } from "react";
import { FileIcon, FolderIcon } from "@/components/core/icons";

export type NewItemInputProps = {
  type: "file" | "directory";
  depth?: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
};

export const NewItemInput = ({
  type,
  depth = 0,
  onConfirm,
  onCancel,
}: NewItemInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);
  const [value, setValue] = useState("");
  const isFolder = type === "directory";
  const paddingLeft = 8 + depth * 12;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const finish = (name: string) => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    const trimmed = name.trim();

    if (trimmed) {
      onConfirm(trimmed);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finish(value);
    }

    if (e.key === "Escape") {
      finishedRef.current = true;
      onCancel();
    }
  };

  const handleBlur = () => {
    finish(value);
  };

  return (
    <div
      className="flex w-full items-center gap-1 rounded px-2 py-1"
      style={{ paddingLeft }}
    >
      {isFolder ? (
        <>
          <span className="h-4 w-4 shrink-0" />
          <FolderIcon className="h-4 w-4 shrink-0 text-yellow-500" />
        </>
      ) : (
        <>
          <span className="h-4 w-4 shrink-0" />
          <FileIcon className="h-4 w-4 shrink-0 text-blue-500" />
        </>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={isFolder ? "Folder name" : "File name"}
        className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-sm outline-none focus:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:border-zinc-500"
      />
    </div>
  );
};
