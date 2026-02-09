#!/usr/bin/env node

/**
 * Convert PDF pages to PNG images using pdf-to-png-converter (pdfjs).
 * This is the pure JS fallback. For complex PDFs, prefer system tools
 * (mutool/magick/pdftoppm) — see SKILL.md for the decision flow.
 *
 * Usage:
 *   node convert-pdf-to-png.mjs <pdf-path> [options]
 *
 * Options:
 *   --output-dir <dir>       Output directory for PNG files (default: same directory as PDF)
 *   --scale <number>         Viewport scale factor (default: 2.0)
 *   --pages <list>           Comma-separated page numbers to convert, 1-based (default: all)
 *   --password <string>      Password for encrypted PDF
 *
 * Examples:
 *   node convert-pdf-to-png.mjs paper.pdf
 *   node convert-pdf-to-png.mjs paper.pdf --output-dir ./output --scale 3
 *   node convert-pdf-to-png.mjs paper.pdf --pages 1,3,5
 *   node convert-pdf-to-png.mjs encrypted.pdf --password "secret"
 */

import { pdfToPng } from "pdf-to-png-converter";
import { resolve, relative, parse as parsePath } from "node:path";

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`Usage: node convert-pdf-to-png.mjs <pdf-path> [options]

Options:
  --output-dir <dir>       Output directory (default: same as PDF)
  --scale <number>         Viewport scale (default: 2.0)
  --pages <list>           Comma-separated pages, 1-based (default: all)
  --password <string>      Password for encrypted PDF`);
    process.exit(0);
  }

  const pdfPath = args[0];
  const options = {
    pdfPath,
    outputDir: undefined,
    scale: 2.0,
    pages: undefined,
    password: undefined,
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case "--output-dir":
        if (i + 1 >= args.length) {
          console.error("--output-dir requires a value");
          process.exit(1);
        }
        options.outputDir = args[++i];
        break;
      case "--scale": {
        if (i + 1 >= args.length) {
          console.error("--scale requires a value");
          process.exit(1);
        }
        const scale = parseFloat(args[++i]);
        if (Number.isNaN(scale) || scale <= 0) {
          console.error(`Invalid scale value: ${args[i]}. Must be a positive number.`);
          process.exit(1);
        }
        options.scale = scale;
        break;
      }
      case "--pages": {
        if (i + 1 >= args.length) {
          console.error("--pages requires a value");
          process.exit(1);
        }
        const pages = args[++i].split(",").map(Number);
        const invalid = pages.filter((n) => !Number.isInteger(n) || n < 1);
        if (invalid.length > 0) {
          console.error(`Invalid page numbers: ${invalid.join(", ")}. Must be positive integers.`);
          process.exit(1);
        }
        options.pages = pages;
        break;
      }
      case "--password":
        if (i + 1 >= args.length) {
          console.error("--password requires a value");
          process.exit(1);
        }
        options.password = args[++i];
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv);
  const pdfAbsPath = resolve(options.pdfPath);
  const pdfName = parsePath(pdfAbsPath).name;

  const absOutputDir = options.outputDir
    ? resolve(options.outputDir)
    : parsePath(pdfAbsPath).dir;
  const outputDir = relative(process.cwd(), absOutputDir) || ".";

  const pngOptions = {
    viewportScale: options.scale,
    outputFolder: outputDir,
    outputFileMaskFunc: (pageNumber) => `${pdfName}_page_${pageNumber}.png`,
    useSystemFonts: true,
    disableFontFace: true,
    verbosityLevel: 0,
  };

  if (options.pages) {
    pngOptions.pagesToProcess = options.pages;
  }

  if (options.password) {
    pngOptions.pdfFilePassword = options.password;
  }

  try {
    const pngPages = await pdfToPng(pdfAbsPath, pngOptions);

    console.log(`Converted ${pngPages.length} page(s) from: ${pdfAbsPath}`);
    for (const page of pngPages) {
      console.log(
        `  Page ${page.pageNumber}: ${page.path} (${page.width}x${page.height})`
      );
    }
  } catch (error) {
    console.error(`Failed to convert PDF: ${error.message}`);
    process.exit(1);
  }
}

main();
