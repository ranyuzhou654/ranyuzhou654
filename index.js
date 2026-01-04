const fs = require('fs');

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const thisYear = new Date().getFullYear();
const startTime = new Date(`${thisYear}-01-01T00:00:00Z`).getTime();
const endTime = new Date(`${thisYear}-12-31T23:59:59Z`).getTime();
const progress = (Date.now() - startTime) / (endTime - startTime);

function generateProgressBar() {
  const cap = 30;
  const passed = Math.floor(progress * cap);
  // 用░避免 Markdown 把空格压缩导致进度条“变短/不齐”
  const bar = '█'.repeat(passed) + '░'.repeat(cap - passed);
  return `{ ${bar} }`;
}

const textToInsert =
`⏳ Year progress \`${generateProgressBar()}\` ${(progress * 100).toFixed(2)} %

⏰ Updated on ${new Date().toUTCString()}`;

const readmePath = './README.md';
let readme = fs.readFileSync(readmePath, 'utf8');

const START = '<!--YEAR_PROGRESS_START-->';
const END = '<!--YEAR_PROGRESS_END-->';

if (!readme.includes(START) || !readme.includes(END)) {
  throw new Error(`README.md 中找不到标记：请加入\n${START}\n...\n${END}`);
}

const regex = new RegExp(
  `(${escapeRegExp(START)})[\\s\\S]*?(${escapeRegExp(END)})`,
  'm'
);

const newReadme = readme.replace(regex, `$1\n${textToInsert}\n$2`);
fs.writeFileSync(readmePath, newReadme);

console.log('README updated successfully with year progress!');
