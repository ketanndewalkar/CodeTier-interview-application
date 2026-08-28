import { ControlledTreeEnvironment, Tree } from "react-complex-tree";
import TreeItem from "./TreeItem.jsx";
import { fileSystem } from "../../config/utils/fileSystem";
import { useRef, useEffect } from "react";
import { useExplorer } from "../hooks/useExplorer";
import {
  VscNewFile,
  VscNewFolder,
  VscRefresh,
  VscCollapseAll
} from "react-icons/vsc";
import "../styles/Explorer.css";

export const Explorer = ({ activeFile, onFileSelect }) => {
  const treeRef = useRef(null);
  const {
    refetch,
    isLoading,
    itemData,
    viewState,
    setExpandedItems,
    setSelectedItems,
    setFocusedItem,
    handleCreateItem,
    handleRenameItem,
    handleDrop,
    handleKeyDown,
    handleCollapseAll
  } = useExplorer(treeRef);

  // Sync editor active file tab with the file tree selection
  useEffect(() => {
    if (activeFile) {
      const activeItemId = `workspace/${activeFile}`;
      if (itemData[activeItemId]) {
        setSelectedItems([activeItemId]);
        setFocusedItem(activeItemId);
      } else {
        setSelectedItems([]);
        setFocusedItem(null);
      }
    } else {
      setSelectedItems([]);
      setFocusedItem(null);
    }
  }, [activeFile, itemData]);

  return (
    <div
      className="vscode-explorer"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {/* VS Code Explorer Header */}
      <div className="vscode-explorer-header">
        <span>Explorer</span>
        <div className="vscode-explorer-actions">
          <span>{isLoading ? "Loading" : ""}</span>
          <button title="New File..." onClick={() => handleCreateItem(false)}>
            <VscNewFile />
          </button>
          <button title="New Folder..." onClick={() => handleCreateItem(true)}>
            <VscNewFolder />
          </button>
          <button title="Refresh Explorer" onClick={() => refetch()}>
            <VscRefresh />
          </button>
          <button title="Collapse All Folders" onClick={handleCollapseAll}>
            <VscCollapseAll />
          </button>
        </div>
      </div>

      {/* Tree container */}
      <div
        className="vscode-tree-container"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const activeItemId = `workspace/${activeFile}`;
            if (activeFile && itemData[activeItemId]) {
              setSelectedItems([activeItemId]);
              setFocusedItem(activeItemId);
            } else {
              setSelectedItems([]);
              setFocusedItem(null);
            }
          }
        }}
      >
        <ControlledTreeEnvironment
          items={itemData}
          getItemTitle={(item) => item.data.name}
          viewState={viewState}
          onExpandItem={(item) => {
            setExpandedItems((prev) => [...prev, item.index]);
          }}
          onCollapseItem={(item) => {
            setExpandedItems((prev) => prev.filter((id) => id !== item.index));
          }}
          onSelectItems={(items) => {
            setSelectedItems(items);
          }}
          onFocusItem={(item) => {
            setFocusedItem(item.index);
          }}
          onRenameItem={handleRenameItem}
          canRename
          canDragAndDrop
          canDropOnFolder
          canDropOnNonFolder={false}
          onDrop={handleDrop}
          onPrimaryAction={(item) => {
            if (item.data.type === "file") {
              onFileSelect?.(item.index.replace("workspace/", ""));
            }
          }}
          renderRenameInput={({ inputProps, inputRef, formProps }) => (
            <form
              {...formProps}
              className="vscode-rename-form"
              style={{ display: "flex", width: "100%" }}
            >
              <input
                {...inputProps}
                ref={inputRef}
                className="vscode-rename-input"
                style={{
                  backgroundColor: "#3c3c3c",
                  color: "#cccccc",
                  border: "1px solid #007fd4",
                  outline: "none",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  padding: "1px 4px",
                  width: "100%",
                  height: "18px",
                  boxSizing: "border-box"
                }}
              />
            </form>
          )}
          renderItem={TreeItem}
        >
          <Tree ref={treeRef} treeId="workspace-tree" rootItem="workspace" />
        </ControlledTreeEnvironment>
      </div>
    </div>
  );
};
