import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const WORKSPACE_ROOT = path.join(process.cwd(), "workspaces");

export const createWorkspace = async ({ interviewId, repositoryUrl }) => {
  const workspacePath = path.join(WORKSPACE_ROOT, interviewId.toString());

  await fs.rm(workspacePath, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(workspacePath, {
    recursive: true,
  });

  if (repositoryUrl) {
    const gitCommand = `git clone "${repositoryUrl}" "${workspacePath}"`;
    await execAsync(gitCommand);
  }

  return workspacePath;
};
