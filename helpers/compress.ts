const brotli = require('brotli');
const webp = require('webp-converter');
const fs = require('fs');
const fileFind = require('find');
const fileSize = require('filesize');
const chalk = require('chalk');
const zlib = require('zlib');

function processBrotli(fileBuffer: Buffer): Buffer {
  return brotli.compress(fileBuffer);
}

function processGzip(fileBuffer: Buffer): Buffer {
  return zlib.gzipSync(fileBuffer, {
    level: zlib.constants.Z_BEST_COMPRESSION
  });
}

async function processWebp(oldFile: string, newFile: string): Promise<void> {
  return new Promise<void>(resolve => {
    webp.cwebp(oldFile, newFile, '-q 100', () => resolve());
  });
}

async function processFile(opts: {
  prefix: string;
  dir: string;
  regex: RegExp;
  fileExt: string;
  processFunc?: (fileBuffer: Buffer) => Buffer;
  asyncFunc?: (oldFile: string, newFile: string) => Promise<void>;
}): Promise<void> {
  console.log(chalk.blue(opts.prefix) + ' | Begin');
  const files = fileFind.fileSync(opts.regex, opts.dir);
  console.log(chalk.blue(opts.prefix) + ' | Files: ' + chalk.green(files.length));

  // Stats variabless
  let compressedFiles = 0;
  let normalSizeAll = 0;
  let compressedSizeAll = 0;

  for (const file of files) {
    const newFile = file.replace(opts.regex, opts.fileExt);

    if (opts.processFunc) {
      fs.writeFileSync(newFile, opts.processFunc(fs.readFileSync(file)));
    }

    if (opts.asyncFunc) {
      await opts.asyncFunc(file, newFile);
    }

    const normalSize = fs.statSync(file).size;
    const compressedSize = fs.statSync(newFile).size;
    if (compressedSize >= normalSize) {
      fs.unlinkSync(newFile);
      console.log(chalk.blue(opts.prefix) + ' | ' + chalk.green(file) + ': ' + chalk.red('File cannot be optimized.'));
    } else {
      compressedFiles++;
      normalSizeAll += normalSize;
      compressedSizeAll += compressedSize;
      const difference = getSizeDifference(normalSize, compressedSize);
      console.log(
        chalk.blue(opts.prefix) +
          ' | ' +
          chalk.green(file) +
          ': ' +
          chalk.yellow(fileSize(normalSize)) +
          ' -> ' +
          chalk.yellow(fileSize(compressedSize)) +
          ' : ' +
          chalk.green(difference + '%')
      );
    }
  }
  const differenceAll = getSizeDifference(normalSizeAll, compressedSizeAll);
  console.log(chalk.blue(opts.prefix) + ' | Savings total');
  console.log(chalk.blue(opts.prefix) + ' | Compressed files: ' + compressedFiles);
  console.log(chalk.blue(opts.prefix) + ' | Non-compressed files: ' + (files.length - compressedFiles));
  console.log(chalk.blue(opts.prefix) + ' | Savings total');
  console.log(
    chalk.blue(opts.prefix) +
      ' | ' +
      chalk.yellow(fileSize(normalSizeAll)) +
      ' -> ' +
      chalk.yellow(fileSize(compressedSizeAll)) +
      ' : ' +
      chalk.green(differenceAll + '%')
  );
  console.log('\n');
}

function getSizeDifference(oldSize: number, newSize: number): string {
  return (100 - newSize / oldSize * 100).toFixed(2);
}

processFile({
  prefix: 'Brotli',
  dir: './dist',
  regex: /\.(js|json|html|txt|xml)$/,
  fileExt: '.br',
  processFunc: processBrotli
});

processFile({
  prefix: 'GZip',
  dir: './dist',
  regex: /\.(js|json|html|txt|xml)$/,
  fileExt: '.gz',
  processFunc: processGzip
});

processFile({
  prefix: 'WebP',
  dir: './dist',
  regex: /\.(png|jpg|jpeg)$/,
  fileExt: '.webp',
  asyncFunc: processWebp
});
