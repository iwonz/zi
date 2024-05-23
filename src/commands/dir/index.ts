import path from 'path';
import { Command } from 'commander';
import { displayDirectoryInfo, getDirectoryInfo } from '../../utils/getDirectoryInfo';
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

      displayDirectoryInfo(directoryInfo);
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
        Number(options.chunk) || 0,
      );
    });
}
