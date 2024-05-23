#! /usr/bin/env node

import { Command } from 'commander';
import dir from './commands/dir';

const program = new Command();

program.version('1.0.0');

dir(program);

program.parse();
