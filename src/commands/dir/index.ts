import path from 'path';
import { Command } from 'commander';
import { getDirectoryInfo } from '../../utils/getDirectoryInfo';
import { flatDirectory } from '../../utils/flatDirectory';

export default function (program: Command) {
  const dir = program.command('dir').description('Directories utils');

  dir
    .command('info <directory>')
    .description('Get info about directory and files into it')
    .option('-p, --pattern <pattern>', 'Glob pattern')
    .option('-i, --ignore <pattern>', 'Glob pattern to ignore')
    .action(async (directory, options) => {
      const directoryInfo = await getDirectoryInfo(options.pattern || '*', {
        cwd: path.resolve(process.cwd(), directory),
        absolute: true,
        nodir: false,
        dot: true,
        ignore: options.ignore,
      });

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
    });

  dir
    .command('flat <directory> <output>')
    .description('Flat all files from directory to output directory')
    .option('-p, --pattern <pattern>', 'Glob pattern')
    .option('-i, --ignore <pattern>', 'Glob pattern to ignore')
    .option('--chunk <chunk>', 'Max files in folder')
    .action(async (directory, output, options) => {
      await flatDirectory(
        options.pattern || '**/*',
        {
          cwd: path.resolve(process.cwd(), directory),
          absolute: true,
          nodir: false,
          dot: true,
          ignore: options.ignore,
        },
        path.resolve(process.cwd(), output),
        options.chunk || 0,
      );
    });
}
