/* eslint-disable no-console */

const { execFileSync } = require("child_process");

function exec(cmd, args, opts) {
  console.log({ input: `${cmd} ${args.join(" ")}`, cwd: opts?.cwd });
  const output = execFileSync(cmd, args, opts).toString().trim();
  console.log({ output });
  console.log();
  return output;
}

module.exports = async ({ github, context } = {}) => {
  if (!github || !context) {
    console.error("Error: missing github or context");
    return;
  }

  exec("git", ["config", "--global", "user.email", "infra+release@vercel.com"]);
  exec("git", ["config", "--global", "user.name", "vercel-release-bot"]);
  exec("git", ["checkout", "main"]);
  exec("git", ["commit", "--allow-empty", "-m", '"Bump."']);
  exec("git", ["push", "origin", "main"]);
};
