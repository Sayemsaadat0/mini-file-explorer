"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronRightIcon,
  FileAddIcon,
  FileIcon,
  FolderAddIcon,
  FolderIcon,
} from "@/components/core/icons";
import { useFileContext } from "@/context";
import { createNode } from "@/libs/tree";
import type { TreeNodeType } from "@/models/treeNodeType";

type PendingCreate = {
  type: "file" | "directory";
  parentId: string | null;
};

type NewItemInputProps = {
  type: "file" | "directory";
  depth?: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
};

const NewItemInput = ({
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
          <FolderIcon className="h-4 w-4 shrink-0" />
        </>
      ) : (
        <>
          <span className="h-4 w-4 shrink-0" />
          <FileIcon className="h-4 w-4 shrink-0" />
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

type TreeItemProps = {
  node: TreeNodeType;
  depth?: number;
  pendingCreate: PendingCreate | null;
  onConfirmCreate: (name: string) => void;
  onCancelCreate: () => void;
};

const TreeItem = ({
  node,
  depth = 0,
  pendingCreate,
  onConfirmCreate,
  onCancelCreate,
}: TreeItemProps) => {
  const {
    collapsedDirectoryIds,
    selectedPath,
    setSelectedPath,
    collapseDirectory,
    uncollapseDirectory,
  } = useFileContext();

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
        className={`flex w-full items-center gap-1 rounded px-2 py-1 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 ${
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
            <FolderIcon className="h-4 w-4 shrink-0" />
          ) : (
            <FileIcon className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
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

const Sidebar = () => {
  const {
    tree,
    setTree,
    isSidebarCollapse,
    selectedPath,
    setSelectedPath,
    uncollapseDirectory,
  } = useFileContext();
  const [pendingCreate, setPendingCreate] = useState<PendingCreate | null>(
    null,
  );

  const getAllNodes = (nodes: TreeNodeType[]): TreeNodeType[] => {
    return nodes.flatMap((node) => [
      node,
      ...(node.children ? getAllNodes(node.children) : []),
    ]);
  };

  const selectedNode = selectedPath
    ? getAllNodes(tree).find((node) => node.path === selectedPath)
    : undefined;

  const parentId =
    selectedNode?.type === "directory" ? selectedNode.id : null;

  const startCreate = (type: "file" | "directory") => {
    if (parentId) {
      uncollapseDirectory(parentId);
    }

    setPendingCreate({ type, parentId });
  };

  const handleNavClick = () => {
    setSelectedPath(null);
  };

  const handleConfirmCreate = (name: string) => {
    if (!pendingCreate) {
      return;
    }

    const trimmed = name.trim();

    if (!trimmed) {
      setPendingCreate(null);
      return;
    }

    setTree(
      createNode({
        tree,
        parentId: pendingCreate.parentId,
        name: trimmed,
        type: pendingCreate.type,
      }),
    );
    setPendingCreate(null);
  };

  const handleCancelCreate = () => {
    setPendingCreate(null);
  };

  return (
    <aside
      className={`flex shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50 transition-[width] duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 ${
        isSidebarCollapse ? "w-0 border-r-0" : "w-56"
      }`}
      aria-hidden={isSidebarCollapse}
    >
      <div className="flex h-9 w-56 shrink-0 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Explorer
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => startCreate("directory")}
            aria-label="New folder"
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <FolderAddIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => startCreate("file")}
            aria-label="New file"
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <FileAddIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <nav
        className="w-56 flex-1 overflow-y-auto p-2 text-sm text-zinc-700 dark:text-zinc-300"
        onClick={handleNavClick}
      >
        {tree.length === 0 && !pendingCreate && (
          <p className="px-2 py-1.5 text-zinc-400 dark:text-zinc-500">
            No folders yet
          </p>
        )}
        <div onClick={(e) => e.stopPropagation()}>
          {tree.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              pendingCreate={pendingCreate}
              onConfirmCreate={handleConfirmCreate}
              onCancelCreate={handleCancelCreate}
            />
          ))}
          {pendingCreate?.parentId === null && (
            <NewItemInput
              type={pendingCreate.type}
              onConfirm={handleConfirmCreate}
              onCancel={handleCancelCreate}
            />
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
