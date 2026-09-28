#!/usr/bin/env node
/**
 * WeChat MP headline cover, 2.35:1 (1080x460).
 * Scale is always uniform. A source that is already 2.35:1 fills the frame.
 * A different ratio is center-cropped to 2.35:1, never stretched.
 * Also writes cover-11.jpg, the center 1:1 share crop.
 *
 * Usage:
 *   node compose-cover.mjs --image <src> --out <cover-235.jpg>
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

export const COVER_W = 1080;
export const COVER_H = 460;

function arg(name, fallback = '') {
  const i = process.argv.indexOf(name);
  if (i === -1 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

async function writeSquare(widePath, out) {
  const side = COVER_H;
  const left = Math.floor((COVER_W - side) / 2);
  const squarePath = path.join(path.dirname(out), 'cover-11.jpg');
  await sharp(widePath)
    .extract({ left, top: 0, width: side, height: side })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(squarePath);
  return squarePath;
}

export async function composeCover(src, out) {
  await mkdir(path.dirname(out), { recursive: true });
  const meta = await sharp(src).rotate().metadata();
  const sw = meta.width || COVER_W;
  const sh = meta.height || COVER_H;
  await sharp(src)
    .rotate()
    .resize({
      width: COVER_W,
      height: COVER_H,
      fit: 'cover',
      position: 'centre',
    })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(out);
  const squarePath = await writeSquare(out, out);
  const written = await sharp(out).metadata();
  console.log(
    'cover',
    out,
    `${written.width}x${written.height}`,
    `from ${sw}x${sh}`,
    'uniform',
    'square',
    squarePath,
  );
}

async function main() {
  const src = arg('--image');
  const out = arg('--out');
  if (!src || !out) {
    console.error('usage: node compose-cover.mjs --image <src> --out <cover-235.jpg>');
    process.exit(2);
  }
  await composeCover(src, out);
}

const invoked =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invoked) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
