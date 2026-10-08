// Where the eval gets the Anthropic key, in this order: ANTHROPIC_API_KEY in the shell, a private file (~/.config/kern/anthropic-key), or a prompt in your terminal.
// The prompt shows one * per character (so you can see a paste worked), drops the escape codes a terminal wraps around a paste, and never prints or stores the key.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

export const KEYFILE = path.join(homedir(), '.config/kern/anthropic-key');
const LOOKS_LIKE_KEY = /^sk-ant-[\w-]+$/;

const askKey = () => new Promise((resolve, reject) => {
  const { stdin, stdout } = process;
  if (!stdin.isTTY) return reject(new Error('there is no terminal to ask in'));
  stdout.write('Anthropic key (paste it: you will see * for each character, then press Enter): ');
  stdin.setRawMode(true); stdin.resume(); stdin.setEncoding('utf8');
  let key = '';
  const finish = (err) => { stdin.setRawMode(false); stdin.pause(); stdin.off('data', onData); stdout.write('\n'); if (err) reject(err); else resolve(key.trim()); };
  const onData = (chunk) => {
    for (const ch of chunk.replace(/\x1b\[20[01]~/g, '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')) { // bracketed-paste markers and other escape codes
      if (ch === '\r' || ch === '\n') return finish();
      if (ch === '\u0003') return finish(new Error('cancelled'));
      if (ch === '\u007f' || ch === '\b') { if (key) { key = key.slice(0, -1); stdout.write('\b \b'); } continue; }
      if (ch >= ' ') { key += ch; stdout.write('*'); }
    }
  };
  stdin.on('data', onData);
});

export const getKey = async (file = KEYFILE) => {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY.trim();
  let key;
  if (existsSync(file)) {
    if (statSync(file).mode & 0o077) throw new Error(`${file} can be read by other users: run  chmod 600 ${file}  and try again.`);
    key = readFileSync(file, 'utf8').trim();
  } else key = await askKey();
  if (!LOOKS_LIKE_KEY.test(key)) throw new Error(`That does not look like an Anthropic key (${key.length} characters; it should be one line starting with sk-ant-). Copy it again from the Console.`);
  console.log(`Key accepted (${key.length} characters). It is only used for this run.`);
  return key;
};
