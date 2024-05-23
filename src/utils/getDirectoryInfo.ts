import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import type { GlobOptions } from 'glob';

export interface DirectoryInfoItem {
  type: 'directory' | 'file';
  path: string;
  ext?: string;
}

export interface DirectoryInfo {
  filesCount: number;
  directoriesCount: number;
  items: DirectoryInfoItem[];
}

export const getDirectoryInfo = async (
  pattern: string = '*',
  options: GlobOptions = {
    cwd: path.resolve(process.cwd()),
    absolute: true,
    nodir: false,
    dot: true,
  },
): Promise<DirectoryInfo> => {
  const files = await glob(pattern, options as Object);

  let directoriesCount = 0;
  let filesCount = 0;
  let items: DirectoryInfoItem[] = [];

  files.forEach((file) => {
    const stats = fs.statSync(file);
    if (stats.isDirectory()) {
      directoriesCount++;
      items.push({ type: 'directory', path: file });
    } else if (stats.isFile()) {
      filesCount++;
      const ext = path.extname(file);
      items.push({ type: 'file', path: file, ext });
    }
  });

  return { filesCount, directoriesCount, items };
};
