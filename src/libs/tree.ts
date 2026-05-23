import type { TreeNodeType } from "@/models/treeNodeType";
import { generateUniqueId } from "@/libs/generate-unique-id";

export const findNodeById = (
  nodes: TreeNodeType[],
  id: string,
): TreeNodeType | undefined => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const findNodeByPath = (
  nodes: TreeNodeType[],
  path: string,
): TreeNodeType | undefined => {
  for (const node of nodes) {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
};

export const createNode = ({
  tree,
  parentId,
  name,
  type,
}: {
  tree: TreeNodeType[];
  parentId: string | null;
  name: string;
  type: "file" | "directory";
}): TreeNodeType[] => {
  const newNode: TreeNodeType = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    path: `/${name}`,
    type,
    ...(type === "directory" ? { children: [] } : { content: "" }),
  };

  if (!parentId) {
    return [...tree, newNode];
  }

  const addNodeToParent = (nodes: TreeNodeType[]): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        if (node.type !== "directory") {
          return node;
        }

        const childPath = `${node.path}/${name}`;
        const newNodeWithPath = { ...newNode, path: childPath };

        return {
          ...node,
          children: [...(node.children || []), newNodeWithPath],
        };
      }

      if (node.children) {
        return {
          ...node,
          children: addNodeToParent(node.children),
        };
      }

      return node;
    });
  };

  return addNodeToParent(tree);
};

export const deleteNode = ({
  tree,
  id,
}: {
  tree: TreeNodeType[];
  id: string;
}): TreeNodeType[] => {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: deleteNode({ tree: node.children, id }),
        };
      }
      return node;
    });
};

export const renameNode = ({
  tree,
  id,
  newName,
}: {
  tree: TreeNodeType[];
  id: string;
  newName: string;
}): TreeNodeType[] => {
  return tree.map((node) => {
    if (node.id === id) {
      const parentPath = node.path.substring(0, node.path.lastIndexOf("/"));
      const newPath = parentPath ? `${parentPath}/${newName}` : `/${newName}`;

      const updateChildrenPaths = (
        children: TreeNodeType[],
        basePath: string,
      ): TreeNodeType[] => {
        return children.map((child) => {
          const childNewPath = `${basePath}/${child.name}`;
          return {
            ...child,
            path: childNewPath,
            children: child.children
              ? updateChildrenPaths(child.children, childNewPath)
              : undefined,
          };
        });
      };

      return {
        ...node,
        name: newName,
        path: newPath,
        children: node.children
          ? updateChildrenPaths(node.children, newPath)
          : undefined,
      };
    }

    if (node.children) {
      return {
        ...node,
        children: renameNode({ tree: node.children, id, newName }),
      };
    }

    return node;
  });
};

export const updateFileContent = ({
  tree,
  id,
  content,
}: {
  tree: TreeNodeType[];
  id: string;
  content: string;
}): TreeNodeType[] => {
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
