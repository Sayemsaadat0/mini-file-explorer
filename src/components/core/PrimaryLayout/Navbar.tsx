"use client";

import Breadcrumbs from "@/components/core/PrimaryLayout/Breadcrumbs";
import { HamburgerIcon } from "@/components/core/icons";
import { useFileContext } from "@/context";

const Navbar = () => {
  const { isSidebarCollapse, setIsSidebarCollapse, selectedPath } =
    useFileContext();

  const toggleSidebar = () => {
    setIsSidebarCollapse(!isSidebarCollapse);
  };

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

      {selectedPath ? (
        <Breadcrumbs />
      ) : (
        <h1 className="min-w-0 truncate text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-100">
          Mini File Explorer
        </h1>
      )}
    </header>
  );
};

export default Navbar;
