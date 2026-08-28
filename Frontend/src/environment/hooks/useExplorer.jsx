import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  fetchinterviewWorkspace,
  createWorkspaceEntity,
  deleteWorkspaceEntity,
  renameWorkspaceEntity
} from "../functions/explorer.function";
import transformTree from "../../utils/transformTree";
import toast from "react-hot-toast";

export const useExplorer = (initialFileSystem, treeRef) => {
  const { interviewId } = useParams();
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [itemData, setItemData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [focusedItem, setFocusedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);

  // Fetch the workspace initial state
  const { data, isPending, isLoading, refetch } = useQuery({
    queryFn: () => fetchinterviewWorkspace(interviewId),
    queryKey: ["workspace", interviewId],
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: ({ path, type }) => createWorkspaceEntity(interviewId, path, type),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["workspace", interviewId], updatedData);
    },
    onError: (err) => {
      console.error("Failed to create entity:", err);
      toast.error(err.response?.data?.message || "Failed to create entity");
      // Rollback to cached state
      const cached = queryClient.getQueryData(["workspace", interviewId]);
      if (cached) setItemData(transformTree(cached));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({ path }) => deleteWorkspaceEntity(interviewId, path),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["workspace", interviewId], updatedData);
    },
    onError: (err) => {
      console.error("Failed to delete entity:", err);
      toast.error(err.response?.data?.message || "Failed to delete entity");
      // Rollback to cached state
      const cached = queryClient.getQueryData(["workspace", interviewId]);
      if (cached) setItemData(transformTree(cached));
    }
  });

  const renameMutation = useMutation({
    mutationFn: ({ oldPath, newPath }) => renameWorkspaceEntity(interviewId, oldPath, newPath),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["workspace", interviewId], updatedData);
    },
    onError: (err) => {
      console.error("Failed to rename entity:", err);
      toast.error(err.response?.data?.message || "Failed to rename/move entity");
      // Rollback to cached state
      const cached = queryClient.getQueryData(["workspace", interviewId]);
      if (cached) setItemData(transformTree(cached));
    }
  });

  useEffect(() => {
    if (data) {
      Promise.resolve().then(() => {
        setItemData(transformTree(data));
        setIsInitialized(true);
      });
    }
  }, [data]);

  const viewState = {
    "workspace-tree": {
      expandedItems,
      selectedItems,
      focusedItem
    },
  };

  const handleCollapseAll = () => {
    setExpandedItems(["workspace"]);
  };

  // Helper to find the parent index of any item in the tree state
  const getParentId = (treeData, childId) => {
    return Object.keys(treeData).find((key) =>
      treeData[key].children && treeData[key].children.includes(childId)
    );
  };

  // Recursively deletes children and the item itself from the tree data
  const deleteItemRecursive = (treeData, id) => {
    const item = treeData[id];
    if (!item) return;
    if (item.children) {
      item.children.forEach((childId) => {
        deleteItemRecursive(treeData, childId);
      });
    }
    delete treeData[id];
  };

  // Handle Drag & Drop of one or multiple items
  const handleDrop = (draggedItems, target) => {
    if (target.targetType === 'item') {
      const destFolderId = target.targetItem;
      const destFolder = itemData[destFolderId];

      if (!destFolder || !destFolder.isFolder) return;

      setItemData((prev) => {
        const next = { ...prev };
        draggedItems.forEach((draggedItem) => {
          if (destFolderId.startsWith(draggedItem.index)) return;

          // 1. Remove from current parent
          const parentId = getParentId(next, draggedItem.index);
          if (parentId && next[parentId]) {
            next[parentId] = {
              ...next[parentId],
              children: next[parentId].children.filter((c) => c !== draggedItem.index)
            };
          }

          // 2. Add to destination folder
          if (!next[destFolderId].children.includes(draggedItem.index)) {
            next[destFolderId] = {
              ...next[destFolderId],
              children: [...next[destFolderId].children, draggedItem.index]
            };
          }
        });

        return next;
      });

      draggedItems.forEach((draggedItem) => {
        if (destFolderId.startsWith(draggedItem.index)) return;

        const oldRelativePath = draggedItem.index.replace("workspace/", "");
        const fileName = oldRelativePath.substring(oldRelativePath.lastIndexOf('/') + 1);
        const destRelativePath = destFolderId === "workspace" ? "" : destFolderId.replace("workspace/", "") + "/";
        const newRelativePath = `${destRelativePath}${fileName}`;

        renameMutation.mutate({ oldPath: oldRelativePath, newPath: newRelativePath });
      });
    }
  };

  // Handle inline renaming
  const handleRenameItem = (item, newName) => {
    if (!newName || !newName.trim()) {
      if (itemData[item.index]?.isNew) {
        setItemData((prev) => {
          const next = { ...prev };
          const parentId = getParentId(next, item.index);
          if (parentId && next[parentId]) {
            next[parentId].children = next[parentId].children.filter(c => c !== item.index);
          }
          delete next[item.index];
          return next;
        });
      }
      return;
    }

    const isNew = itemData[item.index]?.isNew;
    const parentId = getParentId(itemData, item.index) || "workspace";
    const parentRelativePath = parentId === "workspace" ? "" : parentId.replace("workspace/", "") + "/";
    const relativePath = `${parentRelativePath}${newName.trim()}`;

    setItemData((prev) => {
      const next = { ...prev };
      if (next[item.index]) {
        next[item.index] = {
          ...next[item.index],
          data: {
            ...next[item.index].data,
            name: newName.trim()
          }
        };
      }
      return next;
    });

    if (isNew) {
      createMutation.mutate({ path: relativePath, type: item.isFolder ? "folder" : "file" });
    } else {
      const oldRelativePath = item.index.replace("workspace/", "");
      const newRelativePath = `${parentRelativePath}${newName.trim()}`;
      renameMutation.mutate({ oldPath: oldRelativePath, newPath: newRelativePath });
    }
  };

  // Handle item deletion (triggered by Delete key)
  const handleDeleteItems = (itemIds) => {
    setItemData((prev) => {
      const next = { ...prev };
      itemIds.forEach((id) => {
        if (id === "workspace") return; // Keep workspace root

        const parentId = getParentId(next, id);
        if (parentId && next[parentId]) {
          next[parentId] = {
            ...next[parentId],
            children: next[parentId].children.filter((c) => c !== id)
          };
        }
        deleteItemRecursive(next, id);
      });
      return next;
    });

    setSelectedItems([]);
    setFocusedItem(null);

    itemIds.forEach((id) => {
      if (id === "workspace") return;
      const relativePath = id.replace("workspace/", "");
      deleteMutation.mutate({ path: relativePath });
    });
  };

  // Handle creating a new file or folder
  const handleCreateItem = (isFolder) => {
    let parentId = "workspace";
    if (focusedItem) {
      const focusedNode = itemData[focusedItem];
      if (focusedNode) {
        if (focusedNode.isFolder) {
          parentId = focusedItem;
        } else {
          parentId = getParentId(itemData, focusedItem) || "workspace";
        }
      }
    }

    const defaultName = isFolder ? "new-folder" : "untitled";
    const extension = "";
    let name = `${defaultName}${extension}`;
    let newId = `${parentId}/${name}`;

    let counter = 1;
    while (itemData[newId]) {
      name = `${defaultName}-${counter}${extension}`;
      newId = `${parentId}/${name}`;
      counter++;
    }

    setItemData((prev) => ({
      ...prev,
      [newId]: {
        index: newId,
        data: { name, type: isFolder ? "folder" : "file" },
        isFolder: isFolder,
        children: [],
        isNew: true
      },
      [parentId]: {
        ...prev[parentId],
        children: [...prev[parentId].children, newId]
      }
    }));

    if (!expandedItems.includes(parentId)) {
      setExpandedItems((prev) => [...prev, parentId]);
    }

    setSelectedItems([newId]);
    setFocusedItem(newId);

    setTimeout(() => {
      treeRef.current?.startRenamingItem(newId);
    }, 50);
  };

  // Captures the Delete keypress to delete items
  const handleKeyDown = (e) => {
    if (e.key === "Delete" && selectedItems.length > 0) {
      handleDeleteItems(selectedItems);
    }
  };

  const isMutating = createMutation.isPending || renameMutation.isPending || deleteMutation.isPending;
  const combinedLoading = (isPending && isLoading && isInitialized) || isMutating;

  return {
    isLoading: combinedLoading,
    refetch,
    itemData,
    viewState,
    selectedItems,
    focusedItem,
    expandedItems,
    setExpandedItems,
    setSelectedItems,
    setFocusedItem,
    handleCreateItem,
    handleDeleteItems,
    handleRenameItem,
    handleDrop,
    handleKeyDown,
    handleCollapseAll
  };
};
