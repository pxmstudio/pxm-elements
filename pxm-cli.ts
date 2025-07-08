import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// Simple logger utility
const logger = {
  verbose: false,
  quiet: false,
  log(...args: any[]) { if (!this.quiet) console.log(...args); },
  info(...args: any[]) { if (!this.quiet) console.info(...args); },
  warn(...args: any[]) { if (!this.quiet) console.warn(...args); },
  error(...args: any[]) { if (!this.quiet) console.error(...args); },
  debug(...args: any[]) { if (this.verbose && !this.quiet) console.debug('[verbose]', ...args); },
};

function toPascalCase(str: string) {
  return str.replace(/(^\w|[-_]\w)/g, m => m.replace(/[-_]/, '').toUpperCase());
}

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function hasTsFiles(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some(f => f.endsWith('.ts'));
}

function hasJsFiles(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some(f => f.endsWith('.js'));
}

async function detectProjectType(): Promise<'ts' | 'js'> {
  const hasTsConfig = fs.existsSync('tsconfig.json');
  const hasTs = hasTsFiles('src');
  const hasJs = hasJsFiles('src');
  if (hasTsConfig || (hasTs && !hasJs)) return 'ts';
  if (!hasTsConfig && hasJs && !hasTs) return 'js';
  if (hasTs && hasJs) {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Both .ts and .js files detected. Which project type do you want to use?',
        choices: [
          { name: 'TypeScript', value: 'ts' },
          { name: 'JavaScript', value: 'js' }
        ],
        default: 'ts',
      },
    ]);
    return type;
  }
  // Fallback: prompt user
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Unable to detect project type. Please select:',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' }
      ],
      default: 'ts',
    },
  ]);
  return type;
}

async function main() {
  const program = new Command();

  program
    .name('pxm')
    .description('PixelMakers Elements CLI')
    .version('0.1.17')
    .option('--verbose', 'Enable verbose output')
    .option('--quiet', 'Suppress all output except errors');

  program
    .command('init')
    .description('Initialize PixelMakers Elements configuration')
    .action(async () => {
      logger.verbose = program.opts().verbose;
      logger.quiet = program.opts().quiet;
      let projectType: 'ts' | 'js';
      try {
        projectType = await detectProjectType();
        logger.debug('Detected project type:', projectType);
      } catch (e) {
        logger.error('Error detecting project type:', e);
        process.exit(1);
      }
      const configFileName = projectType === 'ts' ? 'pxm.config.ts' : 'pxm.config.js';
      const configPath = path.resolve(process.cwd(), configFileName);
      if (fs.existsSync(configPath)) {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `${configFileName} already exists. Overwrite?`,
            default: false,
          },
        ]);
        if (!overwrite) {
          logger.log('Aborted: config not overwritten.');
          return;
        }
      }
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'animationEngine',
          message: 'Select animation engine:',
          choices: ['vanilla', 'gsap'],
          default: 'vanilla',
        },
        {
          type: 'input',
          name: 'duration',
          message: 'Default animation duration (seconds):',
          default: '0.3',
          validate: (input) => !isNaN(Number(input)) && Number(input) > 0 || 'Enter a positive number',
        },
        {
          type: 'input',
          name: 'easing',
          message: 'Default animation easing:',
          default: 'ease-in-out',
        },
      ]);
      const configTemplate = projectType === 'ts'
        ? getTypeScriptConfigTemplate(answers)
        : getJavaScriptConfigTemplate(answers);
      try {
        fs.writeFileSync(configFileName, configTemplate);
        logger.log(`Created ${configFileName} with your settings.`);
      } catch (e) {
        logger.error(`Failed to write config file: ${e}`);
        process.exit(1);
      }
    });

  program
    .command('copy <component>')
    .description('Copy a component to your project')
    .option('-n, --name <name>', 'Override component name (for template variables and destination)')
    .option('-f, --force', 'Overwrite destination file without confirmation')
    .action(async (component: string, options: { name?: string; force?: boolean }) => {
      logger.verbose = program.opts().verbose;
      logger.quiet = program.opts().quiet;
      const validComponents = [
        'accordion', 'tabs', 'lightbox', 'phone-input', 'video', 'number-input', 'toggle', 'modal'
      ];
      if (!validComponents.includes(component)) {
        logger.error(`Error: ${component} is not a valid component. Available: ${validComponents.join(', ')}`);
        process.exit(1);
      }
      let projectType: 'ts' | 'js';
      try {
        projectType = await detectProjectType();
        logger.debug('Detected project type:', projectType);
      } catch (e) {
        logger.error('Error detecting project type:', e);
        process.exit(1);
      }
      const ext = projectType === 'ts' ? '.ts' : '.js';
      const srcDir = path.join('src', component);
      const srcFile = path.join(srcDir, `index${ext}`);
      if (!fs.existsSync(srcFile)) {
        logger.error(`Source file not found: ${srcFile}`);
        process.exit(1);
      }
      // Destination
      const destDir = path.join('components', component);
      try {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
      } catch (e) {
        logger.error(`Failed to create directory ${destDir}: ${e}`);
        process.exit(1);
      }
      const destFile = path.join(destDir, `index${ext}`);
      // If destination file exists, prompt unless --force
      if (fs.existsSync(destFile) && !options.force) {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `${destFile} already exists. Overwrite?`,
            default: false,
          },
        ]);
        if (!overwrite) {
          logger.log('Aborted: file not overwritten.');
          return;
        }
      }
      // Read and transform file
      let content: string;
      try {
        content = fs.readFileSync(srcFile, 'utf8');
      } catch (e) {
        logger.error(`Failed to read source file: ${e}`);
        process.exit(1);
      }
      const compName = options.name || component;
      content = content
        .replace(/__COMPONENT_NAME__/g, compName)
        .replace(/__COMPONENT_PASCAL__/g, toPascalCase(compName))
        .replace(/__COMPONENT_KEBAB__/g, toKebabCase(compName));
      try {
        fs.writeFileSync(destFile, content);
        logger.log(`Copied ${component} to ${destFile}`);
      } catch (e) {
        logger.error(`Failed to write destination file: ${e}`);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

function getTypeScriptConfigTemplate({ animationEngine, duration, easing }: any): string {
  return `import { PxmConfig } from './types';

const config: PxmConfig = {
  animationEngine: '${animationEngine}', // 'gsap' or 'vanilla'
  defaults: {
    duration: ${duration},
    easing: '${easing}',
  }
};

export default config;
`;
}

function getJavaScriptConfigTemplate({ animationEngine, duration, easing }: any): string {
  return `const config = {
  animationEngine: '${animationEngine}', // 'gsap' or 'vanilla'
  defaults: {
    duration: ${duration},
    easing: '${easing}',
  }
};

export default config;
`;
}

main(); 