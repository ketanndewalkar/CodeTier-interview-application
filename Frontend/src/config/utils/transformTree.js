const transformTree = (node) => {
  if (!node) return {};
  const flatTree = {};

  const traverse = (currentNode) => {
    const id = currentNode.path;
    const isFolder = currentNode.type === "folder";
    const childrenIds = isFolder && currentNode.children 
      ? currentNode.children.map(child => child.path) 
      : [];

    flatTree[id] = {
      index: id,
      data: {
        name: currentNode.name,
        type: currentNode.type
      },
      isFolder: isFolder,
      children: childrenIds
    };

    if (isFolder && currentNode.children) {
      currentNode.children.forEach(traverse);
    }
  };

  traverse(node);
  return flatTree;
};

export default transformTree;
