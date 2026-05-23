"use client";

import Breadcrumbs from "@/components/core/Breadcrumbs/Breadcrumbs";
import { HamburgerIcon, FolderAddIcon, FileAddIcon } from "@/components/core/icons";
import { useFileContext } from "@/context/FileContextProvider";
import { findNodeByPath } from "@/libs/tree";

const Navbar = () => {
  const { isSidebarCollapse, setIsSidebarCollapse, selectedPath, tree, setMainPanelPendingCreate } =
    useFileContext();

  const toggleSidebar = () => {
    setIsSidebarCollapse(!isSidebarCollapse);
  };

  const selectedNode = selectedPath ? findNodeByPath(tree, selectedPath) : null;
  const isDirectoryView = !selectedNode || selectedNode.type === "directory";

  return (
    <header className="flex h-9 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapse ? "Open sidebar" : "Close sidebar"}
        aria-expanded={!isSidebarCollapse}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        <HamburgerIcon className="h-4 w-4" />
      </button>

      <Breadcrumbs />

      {isDirectoryView && (
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMainPanelPendingCreate("directory")}
            className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <FolderAddIcon className="h-3.5 w-3.5" />
            New Folder
          </button>
          <button
            type="button"
            onClick={() => setMainPanelPendingCreate("file")}
            className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <FileAddIcon className="h-3.5 w-3.5" />
            New File
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
