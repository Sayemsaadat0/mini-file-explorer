"use client";

import { Fragment } from "react";
import { ChevronRightIcon } from "@/components/core/icons";
import { useFileContext } from "@/context";

const getBreadcrumbs = (path: string) => {
  const parts = path.split("/").filter(Boolean);

  return parts.map((part, index) => ({
    label: part,
    path: `/${parts.slice(0, index + 1).join("/")}`,
  }));
};

const Breadcrumbs = () => {
  const { selectedPath, setSelectedPath } = useFileContext();

  if (!selectedPath) {
    return null;
  }

  const crumbs = getBreadcrumbs(selectedPath);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden text-sm"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <Fragment key={crumb.path}>
            {index > 0 && (
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            )}
            <button
              type="button"
              onClick={() => setSelectedPath(crumb.path)}
              className={`truncate ${
                isLast
                  ? "font-medium text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {crumb.label}
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
