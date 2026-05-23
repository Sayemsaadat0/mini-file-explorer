"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import type { TreeNodeType } from "@/models/treeNodeType";
import { findNodeById } from "@/libs/tree";

type FileContextValue = {
  tree: TreeNodeType[];
  currentPath: string;
  isSidebarCollapse: boolean;
  collapsedDirectoryIds: string[];
  selectedPath: string | null;
  isLoaded: boolean;
  setTree: (tree: TreeNodeType[]) => void;
  setCurrentPath: (path: string) => void;
  setIsSidebarCollapse: (value: boolean) => void;
  setSelectedPath: (path: string | null) => void;
  collapseDirectory: (id: string) => void;
  uncollapseDirectory: (id: string) => void;
  mainPanelPendingCreate: "file" | "directory" | null;
  setMainPanelPendingCreate: (value: "file" | "directory" | null) => void;
};

const FileContext = createContext<FileContextValue | null>(null);

export const useFileContext = () => {
  const context = useContext(FileContext);

  if (!context) {
    throw new Error("useFileContext must be used within FileContextProvider");
  }

  return context;
};

type FileContextProviderProps = {
  children: React.ReactNode;
};

const FileContextProvider = ({ children }: FileContextProviderProps) => {
  const [tree, setTree] = useState<TreeNodeType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("file-explorer-tree");
    if (saved) {
      try {
        setTree(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tree from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("file-explorer-tree", JSON.stringify(tree));
    }
  }, [tree, isLoaded]);
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSidebarCollapse, setIsSidebarCollapse] = useState(false);
  const [collapsedDirectoryIds, setCollapsedDirectoryIds] = useState<string[]>(
    [],
  );
  const [mainPanelPendingCreate, setMainPanelPendingCreate] = useState<"file" | "directory" | null>(null);

  const collapseDirectory = useCallback(
    (id: string) => {
      const folder = findNodeById(tree, id);

      if (!folder || folder.type !== "directory") {
        return;
      }

      setCollapsedDirectoryIds((prev) =>
        prev.includes(id) ? prev : [...prev, id],
      );
    },
    [tree],
  );

  const uncollapseDirectory = useCallback((id: string) => {
    setCollapsedDirectoryIds((prev) => prev.filter((itemId) => itemId !== id));
  }, []);

  const value = useMemo(
    () => ({
      tree,
      currentPath,
      isSidebarCollapse,
      collapsedDirectoryIds,
      selectedPath,
      isLoaded,
      mainPanelPendingCreate,
      setTree,
      setCurrentPath,
      setIsSidebarCollapse,
      setSelectedPath,
      collapseDirectory,
      uncollapseDirectory,
      setMainPanelPendingCreate,
    }),
    [
      tree,
      currentPath,
      isSidebarCollapse,
      collapsedDirectoryIds,
      selectedPath,
      isLoaded,
      mainPanelPendingCreate,
      collapseDirectory,
      uncollapseDirectory,
    ],
  );

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export default FileContextProvider;
