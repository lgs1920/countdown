const args = new Set(Bun.argv.slice(2));
const increments = ['patch', 'minor', 'major'].filter(increment => args.has(`--${increment}`));

if (increments.length !== 1 || args.size !== 1) {
  console.error('Usage: bun run publish --patch|--minor|--major');
  process.exit(1);
}

const increment = increments[0];

async function run(command, commandArgs) {
  const process = Bun.spawn([command, ...commandArgs], {
    stdout: 'inherit',
    stderr: 'inherit'
  });

  const exitCode = await process.exited;
  if (exitCode !== 0) process.exit(exitCode);
}

await run('bun', ['pm', 'version', increment]);
await run('git', ['push', 'origin', 'main', '--follow-tags']);
