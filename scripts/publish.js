const args = new Set(Bun.argv.slice(2));
const increments = ['patch', 'minor', 'major'].filter(increment => args.has(`--${increment}`));

if (increments.length !== 1 || args.size !== 1) {
  console.error('Usage: bun run publish --patch|--minor|--major');
  process.exit(1);
}

const increment = increments[0];

function output(command, commandArgs) {
  const result = Bun.spawnSync([command, ...commandArgs], {
    stdout: 'pipe',
    stderr: 'pipe'
  });

  if (result.exitCode !== 0) {
    const error = new TextDecoder().decode(result.stderr).trim();
    console.error(error || `Command failed: ${command} ${commandArgs.join(' ')}`);
    process.exit(result.exitCode || 1);
  }

  return new TextDecoder().decode(result.stdout).trim();
}

if (output('git', ['status', '--porcelain'])) {
  console.error('Publication arrêtée : le dépôt contient des changements non commités.');
  process.exit(1);
}

const latestTag = output('git', ['tag', '--list', 'v*', '--sort=-version:refname']).split('\n')[0];
if (latestTag && !output('git', ['diff', '--name-only', `${latestTag}..HEAD`, '--', 'src'])) {
  console.error(`Publication arrêtée : aucun changement de code dans src depuis ${latestTag}.`);
  process.exit(1);
}

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
