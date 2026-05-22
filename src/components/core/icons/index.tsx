import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export const HamburgerIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const FileIcon = ({
  className = "h-4 w-4 text-yellow-500",
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-4a1 1 0 0 1-1-1V4z" />
  </svg>
);

export const FileOpenIcon = ({
  className = "h-4 w-4 text-yellow-500",
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h6" />
  </svg>
);

export const PencilIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

export const DeleteIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
  </svg>
);

export const FolderIcon = ({
  className = "h-4 w-4 text-yellow-500",
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7l-2-2z" />
  </svg>
);

export const FileAddIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M11.5 17.5a6 6 0 1 0 12 0 6 6 0 1 0 -12 0" />
    <path d="m17.5 14.5 0 6" />
    <path d="m20.5 17.5 -6 0" />
    <path d="M10.5 23.5h-9a1 1 0 0 1 -1 -1v-21a1 1 0 0 1 1 -1h13.293a1 1 0 0 1 0.707 0.293L19.207 4.5a1 1 0 0 1 0.293 0.707V8.5" />
  </svg>
);

export const FolderAddIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M20.5 8.5v-4a1 1 0 0 0 -1 -1H9.618a1 1 0 0 1 -0.894 -0.553l-0.948 -1.894A1 1 0 0 0 6.882 0.5H1.5a1 1 0 0 0 -1 1v15a1 1 0 0 0 1 1h7" />
    <path d="M11.5 17.5a6 6 0 1 0 12 0 6 6 0 1 0 -12 0" />
    <path d="m17.5 14.5 0 6" />
    <path d="m20.5 17.5 -6 0" />
  </svg>
);

export const ChevronRightIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);
