import { 
  DiJavascript1, 
  DiReact, 
  DiCss3, 
  DiHtml5, 
  DiGit 
} from "react-icons/di";
import { 
  SiJson, 
  SiEslint, 
  SiVite, 
  SiMarkdown 
} from "react-icons/si";
import { 
  VscFolder, 
  VscFolderOpened, 
  VscFile,
  VscChevronRight,
  VscChevronDown
} from "react-icons/vsc";

// Icon resolver matching VS Code themes
const getFileIcon = (name, isFolder, isExpanded) => {
  if (isFolder) {
    if (name === "node_modules") return <VscFolder style={{ color: "#61b258" }} />;
    if (name === "public") return <VscFolder style={{ color: "#3ba2f5" }} />;
    if (name === "dist") return <VscFolder style={{ color: "#f27983" }} />;
    if (name === "components") return <VscFolder style={{ color: "#a2d9af" }} />;
    if (name === "assets") return <VscFolder style={{ color: "#d9a2d0" }} />;
    if (name === "utils") return <VscFolder style={{ color: "#d9c5a2" }} />;
    
    return isExpanded 
      ? <VscFolderOpened style={{ color: "#e5b54f" }} /> 
      : <VscFolder style={{ color: "#e5b54f" }} />;
  }

  const extension = name.split('.').pop().toLowerCase();
  
  switch (extension) {
    case "js":
      if (name.includes("config.js")) {
        return <SiEslint style={{ color: "#4b32c3" }} />;
      }
      return <DiJavascript1 style={{ color: "#f1e05a" }} />;
    case "jsx":
      return <DiReact style={{ color: "#61dafb" }} />;
    case "css":
      return <DiCss3 style={{ color: "#512da8" }} />;
    case "html":
      return <DiHtml5 style={{ color: "#e34c26" }} />;
    case "json":
      return <SiJson style={{ color: "#cbcb41" }} />;
    case "gitignore":
      return <DiGit style={{ color: "#ea4e31" }} />;
    case "md":
      return <SiMarkdown style={{ color: "#007acc" }} />;
    default:
      if (name === ".gitignore") {
        return <DiGit style={{ color: "#ea4e31" }} />;
      }
      if (name.includes("vite.config")) {
        return <SiVite style={{ color: "#bd34fe" }} />;
      }
      if (name.includes("eslint.config")) {
        return <SiEslint style={{ color: "#4b32c3" }} />;
      }
      return <VscFile style={{ color: "#cccccc" }} />;
  }
};

function TreeItem({ title, item, arrow, context, children, depth }) {
  const isFolder = item.data.type === "folder";

  // Build row classes
  const rowClasses = [
    "vscode-tree-item-row",
    context.isSelected && "is-selected",
    context.isFocused && "is-focused"
  ].filter(Boolean).join(" ");

  return (
    <li 
      {...context.itemContainerWithChildrenProps} 
      style={{ listStyleType: "none", margin: 0, padding: 0 }}
    >
      <div
        {...context.itemContainerWithoutChildrenProps}
        {...context.interactiveElementProps}
        className={rowClasses}
        style={{
          paddingLeft: `${depth * 8 + 4}px`
        }}
      >
        {/* Render Nesting Guides */}
        {Array.from({ length: depth }).map((_, index) => (
          <div
            key={index}
            className="vscode-tree-item-guide"
            style={{
              left: `${index * 8 + 10}px`
            }}
          />
        ))}

        {/* Chevron Button for Folders */}
        {isFolder ? (
          <button
            {...context.arrowProps}
            className="vscode-tree-item-chevron"
          >
            {context.isExpanded ? <VscChevronDown /> : <VscChevronRight />}
          </button>
        ) : (
          <div style={{ width: 16, height: 16, marginRight: 4, flexShrink: 0 }} />
        )}

        {/* Icon */}
        <span className="vscode-tree-item-icon">
          {getFileIcon(item.data.name, isFolder, context.isExpanded)}
        </span>

        {/* Title */}
        {context.isRenaming ? (
          <div style={{ flexGrow: 1 }} onClick={(e) => e.stopPropagation()}>
            {title}
          </div>
        ) : (
          <span className="vscode-tree-item-title">{title}</span>
        )}
      </div>
      
      {/* Children list items */}
      {children}
    </li>
  );
}

export default TreeItem;
