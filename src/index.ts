import { cac } from 'cac';
import chalk from 'chalk';
import { configCmd } from './cmd/config';
import { createLogger } from './lib/logger';
const cli = cac('ccli');

cli
  .command('deploy [target]')
  .option('--dir', `[string] static source dir`)
  .option('--env', `[string] target dir`)
  .action(async (target: string, options: { dir?: string; env?: string }) => {
    const { deployCmd } = await import('./cmd/deploy/index');
    try {
      await deployCmd(target, options.dir);
    } catch (e: any) {
      createLogger('info').error(
        chalk.red(`error when deploy deps:\n${e.stack}`),
        { error: e },
      );
      process.exit(1);
    }
  });

cli.command('config [mode]').action(async (mode: 'reset' | undefined) => {
  try {
    await configCmd(mode === 'reset');
  } catch (e: any) {
    createLogger('info').error(
      chalk.red(`error when starting preview server:\n${e.stack}`),
      { error: e },
    );
    process.exit(1);
  }
});

cli.help();
cli.version(require('../package.json').version);

cli.parse();
