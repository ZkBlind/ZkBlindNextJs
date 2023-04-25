import path from "path";
import fs from "fs";
import { execSync } from "child_process";


export function setupDirectories(pathToCircom: string) {
  // Get the repository root directory using the 'git' command
  const repoRoot = path.resolve(execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim());

  // Create a 'tmp' directory in the root of the repository if it doesn't exist
  const tmpDir = path.join(repoRoot, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // Extract the directory name from pathToCircom variable
  const circomDirName = path.parse(pathToCircom).name;

  // Create a directory with the extracted name inside the 'tmp' directory
  const multiplier2Dir = path.join(tmpDir, circomDirName);
  if (!fs.existsSync(multiplier2Dir)) {
    fs.mkdirSync(multiplier2Dir);
  }

  return multiplier2Dir;
}