import { useEffect, useRef, useState } from "react";
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  PencilIcon,
  DeleteIcon,
} from "@/components/core/icons";
import { useFileContext } from "@/context/FileContextProvider";
import { deleteNode, renameNode } from "@/libs/tree";
import type { TreeNodeType } from "@/models/treeNodeType";
export type PendingCreate = {
  type: "file" | "directory";
  parentId: string | null;
};
import { NewItemInput } from "./NewItemInput";

export type TreeItemProps = {
  node: TreeNodeType;
  depth?: number;
  pendingCreate: PendingCreate | null;
  onConfirmCreate: (name: string) => void;
  onCancelCreate: () => void;
};

export const TreeItem = ({
  node,
  depth = 0,
  pendingCreate,
  onConfirmCreate,
  onCancelCreate,
}: TreeItemProps) => {
  const {
    tree,
    setTree,
    collapsedDirectoryIds,
    selectedPath,
    setSelectedPath,
    collapseDirectory,
    uncollapseDirectory,
  } = useFileContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTree(deleteNode({ tree, id: node.id }));
    if (selectedPath?.startsWith(node.path)) {
      setSelectedPath(null);
    }
  };

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(node.name);
  };

  const finishEdit = () => {
    if (!isEditing) return;
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== node.name) {
      setTree(renameNode({ tree, id: node.id, newName: trimmed }));
    } else {
      setEditValue(node.name);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEdit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(node.name);
    }
  };

  const isFolder = node.type === "directory";
  const isCollapsed = collapsedDirectoryIds.includes(node.id);
  const isSelected = selectedPath === node.path;
  const paddingLeft = 8 + depth * 12;
  const showInputHere =
    pendingCreate?.parentId === node.id && isFolder && !isCollapsed;

  const handleRowClick = () => {
    if (isSelected) {
      setSelectedPath(null);
    } else {
      setSelectedPath(node.path);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isCollapsed) {
      uncollapseDirectory(node.id);
    } else {
      collapseDirectory(node.id);
    }
  };

  return (
    <div>
      <div
        className={`group flex w-full items-center gap-1 rounded px-2 py-1 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 ${
          isSelected ? "bg-zinc-200 dark:bg-zinc-800" : ""
        }`}
        style={{ paddingLeft }}
      >
        {isFolder ? (
          <button
            type="button"
            onClick={handleChevronClick}
            className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500"
          >
            <ChevronRightIcon
              className={`h-3.5 w-3.5 transition-transform ${
                isCollapsed ? "" : "rotate-90"
              }`}
            />
          </button>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        <button
          type="button"
          onClick={handleRowClick}
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
        >
          {isFolder ? (
            <FolderIcon className="h-4 w-4 shrink-0 text-yellow-500" />
          ) : (
            <FileIcon className="h-4 w-4 shrink-0 text-blue-500" />
          )}
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={finishEdit}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-1.5 py-0 text-sm outline-none focus:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:border-zinc-500"
            />
          ) : (
            <span className="truncate">{node.name}</span>
          )}
        </button>

        {!isEditing && (
          <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-auto text-zinc-400">
            <button
              type="button"
              onClick={handleStartRename}
              aria-label="Rename"
              className="flex items-center justify-center h-5 w-5 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete"
              className="flex items-center justify-center h-5 w-5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
            >
              <DeleteIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {isFolder && !isCollapsed && (
        <div>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              pendingCreate={pendingCreate}
              onConfirmCreate={onConfirmCreate}
              onCancelCreate={onCancelCreate}
            />
          ))}
          {showInputHere && pendingCreate && (
            <NewItemInput
              type={pendingCreate.type}
              depth={depth + 1}
              onConfirm={onConfirmCreate}
              onCancel={onCancelCreate}
            />
          )}
        </div>
      )}
    </div>
  );
};
