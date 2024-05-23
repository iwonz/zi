import fs from 'fs';
import path from 'path';
import type { GlobOptions } from 'glob';
import { getDirectoryInfo } from './getDirectoryInfo';

export const flatDirectory = async (
  pattern: string = '**/*',
  options: GlobOptions = {
    cwd: path.resolve(process.cwd()),
    absolute: true,
    nodir: false,
    dot: true,
  },
  out: string = path.resolve(process.cwd(), `_output_${Math.random() * Number.MAX_SAFE_INTEGER}`),
) => {
  const directoryInfo = await getDirectoryInfo(pattern, options);

  if (!fs.existsSync(out)) {
    fs.mkdirSync(out, { recursive: true });
  }

  directoryInfo.items.forEach((file) => {
    if (file.type === 'file') {
      fs.copyFileSync(file.path, path.join(out, path.basename(file.path)));
    }
  });
};
