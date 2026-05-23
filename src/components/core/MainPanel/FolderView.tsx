"use client";

import { useState, useRef, useEffect } from "react";
import { useFileContext } from "@/context/FileContextProvider";
import { createNode, deleteNode, renameNode } from "@/libs/tree";
import type { TreeNodeType } from "@/models/treeNodeType";
import {
  FileIcon,
  FolderIcon,
  PencilIcon,
  DeleteIcon,
  FileAddIcon,
  FolderAddIcon,
} from "@/components/core/icons";

export const FolderView = ({ folderNode }: { folderNode?: TreeNodeType }) => {
  const { tree, setTree, setSelectedPath, mainPanelPendingCreate: pendingCreate, setMainPanelPendingCreate: setPendingCreate } = useFileContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [createValue, setCreateValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);

  const items = folderNode ? folderNode.children || [] : tree;
  const parentId = folderNode ? folderNode.id : null;

  useEffect(() => {
    if (editingId) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (pendingCreate) {
      createInputRef.current?.focus();
    }
  }, [pendingCreate]);

  const handleStartRename = (e: React.MouseEvent, node: TreeNodeType) => {
    e.stopPropagation();
    setEditingId(node.id);
    setEditValue(node.name);
  };

  const finishRename = (node: TreeNodeType) => {
    if (editingId !== node.id) return;
    setEditingId(null);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== node.name) {
      setTree(renameNode({ tree, id: node.id, newName: trimmed }));
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTree(deleteNode({ tree, id }));
  };

  const finishCreate = () => {
    if (!pendingCreate) return;
    const trimmed = createValue.trim();
    if (trimmed) {
      setTree(createNode({ tree, parentId, name: trimmed, type: pendingCreate }));
    }
    setPendingCreate(null);
    setCreateValue("");
  };

  return (
    <div className="flex h-full w-full flex-col bg-white p-6">
      {items.length === 0 && !pendingCreate ? (
        <div className="flex flex-1 w-full flex-col items-center justify-center text-zinc-400">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
            <FolderIcon className="h-8 w-8 text-zinc-300" />
          </div>
          <p className="text-sm font-medium">This folder is empty</p>
        </div>
      ) : (
        <div className="flex flex-wrap content-start gap-4">
          {pendingCreate && (
            <div className="group relative flex w-28 h-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg p-3 hover:bg-zinc-100">
              {pendingCreate === "directory" ? (
                <FolderIcon className="h-12 w-12 shrink-0 text-yellow-500" />
              ) : (
                <FileIcon className="h-12 w-12 shrink-0 text-blue-500" />
              )}
              <input
                ref={createInputRef}
                type="text"
                value={createValue}
                onChange={(e) => setCreateValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishCreate();
                  if (e.key === "Escape") {
                    setPendingCreate(null);
                    setCreateValue("");
                  }
                }}
                onBlur={finishCreate}
                className="w-full rounded bg-white px-1.5 py-0.5 text-center text-xs outline-none focus:border-zinc-400"
                placeholder="Name..."
              />
            </div>
          )}
          {items.map((node) => (
            <div
              key={node.id}
              onClick={() => {
                if (editingId !== node.id) setSelectedPath(node.path);
              }}
              className="group relative flex w-28 h-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg p-3 hover:bg-zinc-100"
            >
              {node.type === "directory" ? (
                <FolderIcon className="h-12 w-12 shrink-0 text-yellow-500" />
              ) : (
                <FileIcon className="h-12 w-12 shrink-0 text-blue-500" />
              )}

              {editingId === node.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finishRename(node);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => finishRename(node)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-center text-xs outline-none focus:border-zinc-400"
                />
              ) : (
                <span className="w-full border border-transparent px-1.5 py-0.5 text-center text-sm text-zinc-700">
                  {node.name}
                </span>
              )}

              {/* Hover Actions */}
              {!editingId && (
                <div className="absolute right-0 top-0 hidden gap-1 rounded-md bg-white/90 p-1 shadow-sm backdrop-blur group-hover:flex">
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(e, node)}
                    className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <PencilIcon className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, node.id)}
                    className="rounded p-1 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <DeleteIcon className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
