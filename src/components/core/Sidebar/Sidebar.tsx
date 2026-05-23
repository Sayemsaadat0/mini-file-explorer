"use client";

import { useState, useCallback, useEffect } from "react";
import { FileAddIcon, FolderAddIcon } from "@/components/core/icons";
import { useFileContext } from "@/context/FileContextProvider";
import { createNode } from "@/libs/tree";
import type { TreeNodeType } from "@/models/treeNodeType";
import { TreeItem, type PendingCreate } from "./TreeItem";
import { NewItemInput } from "./NewItemInput";

const Sidebar = () => {
  const {
    tree,
    setTree,
    isSidebarCollapse,
    selectedPath,
    setSelectedPath,
    uncollapseDirectory,
    isLoaded,
  } = useFileContext();
  const [pendingCreate, setPendingCreate] = useState<PendingCreate | null>(
    null,
  );
  
  const [sidebarWidth, setSidebarWidth] = useState(224);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 150 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("pointercancel", handlePointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isResizing]);

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
      className={`relative flex shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 ${
        isSidebarCollapse ? "border-r-0" : ""
      } ${!isResizing ? "transition-[width] duration-200 ease-in-out" : ""}`}
      style={{ width: isSidebarCollapse ? 0 : sidebarWidth }}
      aria-hidden={isSidebarCollapse}
    >
      <div className="flex h-9 w-full shrink-0 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
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
        className="w-full flex-1 overflow-y-auto p-2 text-sm text-zinc-700 dark:text-zinc-300"
        onClick={handleNavClick}
      >
        {!isLoaded ? (
          <div className="flex flex-col gap-2 p-2">
            <div className="h-4 w-3/4 rounded bg-zinc-200 animate-pulse dark:bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-200 animate-pulse dark:bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-200 animate-pulse dark:bg-zinc-800" />
          </div>
        ) : tree.length === 0 && !pendingCreate ? (
          <p className="px-2 py-1.5 text-zinc-400 dark:text-zinc-500">
            No folders yet
          </p>
        ) : (
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
        )}
      </nav>
      {/* Drag handle */}
      {!isSidebarCollapse && (
        <div
          onPointerDown={startResizing}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-zinc-300 dark:hover:bg-zinc-700 active:bg-zinc-400 dark:active:bg-zinc-600 transition-colors touch-none"
        />
      )}
    </aside>
  );
};

export default Sidebar;
