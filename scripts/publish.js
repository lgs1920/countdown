if (process.env.COUNTDOWN_BUN_PUBLISH_LIFECYCLE === '1') process.exit(0);

const args = Bun.argv.slice(2);
const increments = ['patch', 'minor', 'major'];

if (args.length > 1 || args.some(arg => !increments.includes(arg.slice(2)) || !arg.startsWith('--'))) {
  console.error('Usage: bun run publish [--patch|--minor|--major]');
  process.exit(1);
}

const increment = args.length === 0 ? 'patch' : args[0].slice(2);

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

async function run(command, commandArgs) {
  const process = Bun.spawn([command, ...commandArgs], {
    stdout: 'inherit',
    stderr: 'inherit'
  });

  const exitCode = await process.exited;
  if (exitCode !== 0) process.exit(exitCode);
}

if (output('git', ['status', '--porcelain'])) {
  console.error('Publication arrêtée : le dépôt contient des changements non commités.');
  process.exit(1);
}

const latestTag = output('git', ['tag', '--list', 'v*', '--sort=-version:refname']).split('\n')[0];
if (latestTag && !output('git', ['diff', '--name-only', `${latestTag}..HEAD`, '--', 'src', 'scripts'])) {
  console.error(`Publication arrêtée : aucun changement de code dans src ou scripts depuis ${latestTag}.`);
  process.exit(1);
}

const packageJson = await Bun.file('./package.json').json();
const currentVersion = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(packageJson.version);

if (!currentVersion) {
  console.error(`Version invalide dans package.json : ${packageJson.version}`);
  process.exit(1);
}

let [major, minor, patch] = currentVersion.slice(1).map(Number);
if (increment === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (increment === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const nextVersion = `${major}.${minor}.${patch}`;
const readme = await Bun.file('./README.md').text();
const releaseLine = /^The current release is `[^`]+`/m;

if (!releaseLine.test(readme)) {
  console.error('Publication arrêtée : ligne de version introuvable dans README.md.');
  process.exit(1);
}

const updatedReadme = readme.replace(releaseLine, `The current release is \`${nextVersion}\``);
await Bun.write('./package.json', `${JSON.stringify({...packageJson, version: nextVersion}, null, 2)}\n`);
await Bun.write('./README.md', updatedReadme);
await run('git', ['add', 'package.json', 'README.md']);
await run('git', ['commit', '-m', `v${nextVersion}`]);
await run('git', ['tag', '-a', `v${nextVersion}`, '-m', `v${nextVersion}`]);
await run('git', ['push', 'origin', 'main', '--follow-tags']);
