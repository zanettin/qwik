/* eslint-disable no-console */
import { red } from 'kleur/colors';
import { AppCommand } from './utils/app-command';
import { runAddCommand } from './add/run-add-command';
import { note, panic, pmRunCmd, printHeader, bye } from './utils/utils';
import { runBuildCommand } from './build/run-build-command';
import { intro, isCancel, select, confirm } from '@clack/prompts';

const SPACE_TO_HINT = 20;
const COMMANDS = [
  {
    value: 'add',
    label: 'add',
    hint: 'Add an integration to this app',
    run: (app: AppCommand) => runAddCommand(app),
    showInHelp: true,
    get spaceToHint() {
      return SPACE_TO_HINT - this.label.length;
    },
  },
  {
    value: 'build',
    label: 'build',
    hint: 'Parallelize builds and type checking',
    run: (app: AppCommand) => runBuildCommand(app),
    showInHelp: true,
    get spaceToHint() {
      return SPACE_TO_HINT - this.label.length;
    },
  },
  {
    value: 'build preview',
    label: 'build preview',
    hint: 'Same as "build", but for preview server',
    run: (app: AppCommand) => runBuildCommand(app),
    showInHelp: true,
    get spaceToHint() {
      return SPACE_TO_HINT - this.label.length;
    },
  },
  {
    value: 'help',
    label: 'help',
    hint: 'Show this help',
    run: (app: AppCommand) => printHelp(app),
    showInHelp: false,
  },
  {
    value: 'version',
    label: 'version',
    hint: 'Show the version',
    run: () => printVersion(),
    showInHelp: false,
  },
];

export async function runCli() {
  console.clear();
  printHeader();

  try {
    const app = new AppCommand({
      rootDir: '',
      cwd: process.cwd(),
      args: process.argv.slice(2),
    });
    await runCommand(app);
  } catch (e) {
    panic(String(e));
  }
}

async function runCommand(app: AppCommand) {
  for (let value of COMMANDS) {
    if (value.value === app.task && typeof value.run === 'function') {
      await value.run(app);
      return;
    }
  }

  if (typeof app.task === 'string') {
    console.log(red(`Unrecognized qwik command: ${app.task}`) + '\n');
  }

  await printHelp(app);
  process.exit(1);
}

async function printHelp(app: AppCommand) {
  const pmRun = pmRunCmd();
<<<<<<< HEAD

  intro(color.bgMagenta().white(` Qwik Help `));

  note(
    COMMANDS.filter((cmd) => cmd.showInHelp)
      .map(
        (cmd) =>
          `${pmRun} qwik ${color.cyan(cmd.label)}` +
          (cmd.spaceToHint && ' '.repeat(cmd.spaceToHint)) +
          color.dim(cmd.hint)
      )
      .join('\n'),
    'Available commands'
  );

  const proceed = await confirm({
    message: 'Do you want to run a command?',
    initialValue: true,
  });

  if (isCancel(proceed) || !proceed) {
    bye();
  }

  const command = await select({
    message: 'Select a command',
    options: COMMANDS.filter((cmd) => cmd.showInHelp).map((cmd) => ({
      value: cmd.value,
      label: `${pmRun} qwik ${color.cyan(cmd.label)}`,
      hint: cmd.hint,
    })),
  });

  if (isCancel(command)) {
    bye();
  }

  app.task = command as string;
  await runCommand(app);
=======
  console.log(``);
  console.log(bgMagenta(` Qwik Help `));
  console.log(``);
  console.log(`  ${pmRun} qwik ${cyan(`add`)}            ${dim(`Add an integration to this app`)}`);
  console.log(
    `  ${pmRun} qwik ${cyan(`build`)}          ${dim(`Parallelize builds and type checking`)}`
  );
  console.log(
    `  ${pmRun} qwik ${cyan(`build preview`)}  ${dim(`Same as "build", but for preview server`)}`
  );
  console.log(``);
>>>>>>> @{-1}
}

function printVersion() {
  console.log((globalThis as any).QWIK_VERSION);
}
