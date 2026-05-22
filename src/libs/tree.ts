import type { TreeNodeType } from "@/models/treeNodeType";
import { generateUniqueId } from "@/libs/generate-unique-id";

// Find a node anywhere in the tree
export const findNodeById = (
  tree: TreeNodeType[],
  id: string,
): TreeNodeType | null => {
  for (const node of tree) {
    if (node.id === id) {
      return node;
    }

    if (node.children) {
      const found = findNodeById(node.children, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

// Create a file or folder
export type CreateNodeProps = {
  tree: TreeNodeType[];
  parentId: string | null;
  name: string;
  type: "file" | "directory";
};

export const createNode = ({
  tree,
  parentId,
  name,
  type,
}: CreateNodeProps): TreeNodeType[] => {
  const cleanName = name.trim();

  if (!cleanName) {
    return tree;
  }

  const newNode: TreeNodeType = {
    id: generateUniqueId(),
    name: cleanName,
    path: parentId ? "" : `/${cleanName}`,
    type,
    content: type === "file" ? "" : undefined,
    children: type === "directory" ? [] : undefined,
  };

  // Add to root
  if (!parentId) {
    return [...tree, newNode];
  }

  // Add inside a folder
  return tree.map((node) => {
    if (node.id === parentId && node.type === "directory") {
      newNode.path = `${node.path}/${cleanName}`;

      return {
        ...node,
        children: [...(node.children ?? []), newNode],
      };
    }

    if (node.children) {
      return {
        ...node,
        children: createNode({
          tree: node.children,
          parentId,
          name: cleanName,
          type,
        }),
      };
    }

    return node;
  });
};

// Delete a file or folder
export type DeleteNodeProps = {
  tree: TreeNodeType[];
  id: string;
};

export const deleteNode = ({ tree, id }: DeleteNodeProps): TreeNodeType[] => {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      if (!node.children) {
        return node;
      }

      return {
        ...node,
        children: deleteNode({ tree: node.children, id }),
      };
    });
};

// Rename a file or folder
export type RenameNodeProps = {
  tree: TreeNodeType[];
  id: string;
  newName: string;
};

export const renameNode = ({
  tree,
  id,
  newName,
}: RenameNodeProps): TreeNodeType[] => {
  const cleanName = newName.trim();

  if (!cleanName) {
    return tree;
  }

  return tree.map((node) => {
    if (node.id === id) {
      const parentPath = node.path.slice(0, node.path.lastIndexOf("/")) || "";
      const path =
        parentPath === "" || parentPath === "/"
          ? `/${cleanName}`
          : `${parentPath}/${cleanName}`;

      return { ...node, name: cleanName, path };
    }

    if (node.children) {
      return {
        ...node,
        children: renameNode({ tree: node.children, id, newName: cleanName }),
      };
    }

    return node;
  });
};

// Update text inside a file
export type UpdateFileContentProps = {
  tree: TreeNodeType[];
  id: string;
  content: string;
};

export const updateFileContent = ({
  tree,
  id,
  content,
}: UpdateFileContentProps): TreeNodeType[] => {
  return tree.map((node) => {
    if (node.id === id && node.type === "file") {
      return { ...node, content };
    }

    if (node.children) {
      return {
        ...node,
        children: updateFileContent({ tree: node.children, id, content }),
      };
    }

    return node;
  });
};
