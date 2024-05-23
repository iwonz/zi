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

export const displayDirectoryInfo = (directoryInfo: DirectoryInfo) => {
  if (directoryInfo.items.length) {
    const exts = directoryInfo.items.reduce((counters, file) => {
      if (file.type === 'file') {
        const key = file.ext || 'Without extension';

        if (!counters[key]) {
          counters[key] = 0;
        }

        counters[key]++;
      }

      return counters;
    }, Object.create(null));

    console.table(directoryInfo.items);
    console.table(exts);
    console.table({
      'Files count': directoryInfo.filesCount,
      'Directories count': directoryInfo.directoriesCount,
      'Total count': directoryInfo.items.length,
    });
  } else {
    console.log('Not found...');
  }
};

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
