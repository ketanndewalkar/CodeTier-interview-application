function transformTree(rootNodes) {
  const items = {};
  const nodes = Array.isArray(rootNodes) ? rootNodes : [rootNodes];
  const rootId = "workspace";

  items[rootId] = {
    index: rootId,
    data: {
      name: "workspace",
      type: "folder",
    },
    isFolder: true,
    children: nodes.map((node) => (node?.name ? `${rootId}/${node.name}` : rootId)),
  };

  function traverse(node, parentId = null) {
    if (!node || typeof node !== "object") {
      return;
    }

    const id = parentId ? `${parentId}/${node.name}` : `${rootId}/${node.name}`;
    const childIds = Array.isArray(node.children)
      ? node.children.map((child) => `${id}/${child.name}`)
      : [];

    items[id] = {
      index: id,
      data: {
        name: node.name,
        type: node.type,
      },
      isFolder: node.type === "folder",
      children: childIds,
    };

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => traverse(child, id));
    }
  }

  nodes.forEach((node) => traverse(node, rootId));

  return items;
}

export default transformTree;
