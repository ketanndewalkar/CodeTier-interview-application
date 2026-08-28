import fs from "fs/promises"
import path from "path"
export async function readDirectory(directoryPath = "./workspace/123") {

    const entries = await fs.readdir(
        directoryPath,
        {
            withFileTypes: true
        }
    );


    const result = [];


    for (const entry of entries) {

        const fullPath =
            path.join(directoryPath, entry.name);


        if (entry.isDirectory()) {

            result.push({

                name: entry.name,

                type: "folder",

                children:
                    await readDirectory(fullPath)

            });

        }
        else {

            result.push({

                name: entry.name,

                type: "file"

            });

        }

    }

    // Sort folders first, then files, both alphabetically
    result.sort((a, b) => {
        if (a.type === "folder" && b.type !== "folder") {
            return -1;
        }
        if (a.type !== "folder" && b.type === "folder") {
            return 1;
        }
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true });
    });

    return result;
}