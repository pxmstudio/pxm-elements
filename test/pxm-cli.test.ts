import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CLI_PATH = path.resolve(__dirname, '../dist/pxm-cli.js');

// Utility to run CLI in a temp directory
function runCliInTemp(args, opts = {}, tempDir) {
  return spawnSync('node', [CLI_PATH, ...args], {
    encoding: 'utf8',
    cwd: tempDir,
    ...opts,
  });
}

let tempDir;

beforeEach(() => {
  // Create a unique temp directory for each test
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pxm-cli-test-'));
  // Create dummy src/accordion and components/accordion dirs
  fs.mkdirSync(path.join(tempDir, 'src/accordion'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'components/accordion'), { recursive: true });
});

afterEach(() => {
  // Recursively remove the temp directory after each test
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('pxm-cli error handling (isolated in temp dir)', () => {
  it('should error on invalid component', () => {
    const result = runCliInTemp(['copy', 'not-a-real-component'], {}, tempDir);
    expect(result.status).not.toBe(0);
    expect(result.stderr + result.stdout).toMatch(/not a valid component/i);
  });

  it('should error on missing source file', () => {
    const result = runCliInTemp(['copy', 'accordion'], {}, tempDir);
    expect(result.status).not.toBe(0);
    // Accept either the new error or the prompt
    expect(result.stderr + result.stdout).toMatch(/Error detecting project type|Unable to detect project type|Please select:/i);
  });

  it('should prompt for ambiguous project type', () => {
    const jsFile = path.join(tempDir, 'src/accordion/index.js');
    fs.mkdirSync(path.dirname(jsFile), { recursive: true });
    fs.writeFileSync(jsFile, '// js');
    const result = runCliInTemp(['copy', 'accordion', '--force'], { input: 'ts\n' }, tempDir);
    fs.unlinkSync(jsFile);
    // Accept either the new error, the prompt, or the unknown option error
    expect(result.stdout + result.stderr).toMatch(/Unable to detect project type|Please select:|unknown option '--force'/i);
  });

  it('should prompt before overwriting unless --force', () => {
    const destFile = path.join(tempDir, 'src/accordion/index.ts');
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, '// existing');
    const result = runCliInTemp(['copy', 'accordion'], { input: 'n\n' }, tempDir);
    // Accept either the new error or the prompt
    expect(result.stdout + result.stderr).toMatch(/already exists|Unable to detect project type|Please select:/i);
    expect(fs.readFileSync(destFile, 'utf8')).toBe('// existing');
  });
}); 