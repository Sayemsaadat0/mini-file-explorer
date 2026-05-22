export type TreeNodeType = {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  children?: TreeNodeType[];
};
