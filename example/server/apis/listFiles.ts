const { promisify } = require("util");
// reference for exec: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
const exec = promisify(require("child_process").exec);

export default function listFiles(): {
  stdout: string | Buffer;
  stderr: string | Buffer;
} {
  return exec("ls -la /");
}
