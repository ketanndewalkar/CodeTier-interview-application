export const fileSystem = {
  name: "workspace",
  type: "folder",
  path: "workspace",
  children: [
    {
      name: "Backend",
      type: "folder",
      path: "workspace/Backend",
      children: [
        {
          name: "workspace\\123",
          type: "folder",
          path: "workspace/Backend/workspace\\123",
          children: [
            {
              name: "src",
              type: "folder",
              path: "workspace/Backend/workspace\\123/src",
              children: [
                {
                  name: "rtc.handle.js",
                  type: "file",
                  path: "workspace/Backend/workspace\\123/src/rtc.handle.js"
                }
              ]
            },
            {
              name: "techno",
              type: "folder",
              path: "workspace/Backend/workspace\\123/techno",
              children: [
                {
                  name: "socket.js",
                  type: "file",
                  path: "workspace/Backend/workspace\\123/techno/socket.js"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Frontend",
      type: "folder",
      path: "workspace/Frontend",
      children: [
        {
          name: "src",
          type: "folder",
          path: "workspace/Frontend/src",
          children: [
            {
              name: "components",
              type: "folder",
              path: "workspace/Frontend/src/components",
              children: [
                {
                  name: "App.jsx",
                  type: "file",
                  path: "workspace/Frontend/src/components/App.jsx"
                },
                {
                  name: "Explorer.jsx",
                  type: "file",
                  path: "workspace/Frontend/src/components/Explorer.jsx"
                },
                {
                  name: "EditorArea.jsx",
                  type: "file",
                  path: "workspace/Frontend/src/components/EditorArea.jsx"
                }
              ]
            }
          ]
        },
        {
          name: "package.json",
          type: "file",
          path: "workspace/Frontend/package.json"
        },
        {
          name: "vite.config.js",
          type: "file",
          path: "workspace/Frontend/vite.config.js"
        },
        {
          name: "eslint.config.js",
          type: "file",
          path: "workspace/Frontend/eslint.config.js"
        },
        {
          name: ".gitignore",
          type: "file",
          path: "workspace/Frontend/.gitignore"
        },
        {
          name: "README.md",
          type: "file",
          path: "workspace/Frontend/README.md"
        }
      ]
    }
  ]
};
