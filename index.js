const fs = require('fs');

const thisYear = new Date().getFullYear();
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime();
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime();
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);
const progressBarOfThisYear = generateProgressBar();

function generateProgressBar() {
    const progressBarCapacity = 30;
    const passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity);
    const progressBar =
      '█'.repeat(passedProgressBarIndex) +
      ' '.repeat(progressBarCapacity - passedProgressBarIndex);
    return `{ ${progressBar} }`;
}

// 生成要插入的文本内容
const textToInsert = `\
⏳ Year progress ${progressBarOfThisYear} ${(progressOfThisYear * 100).toFixed(2)} %

⏰ Updated on ${new Date().toUTCString()}`;

// 核心逻辑：读取 README -> 替换占位符内容 -> 写回 README
const readmePath = './README.md';
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// 正则表达式：寻找 和 之间的内容
const regex = /()[\s\S]*?()/;

// 执行替换
const newReadmeContent = readmeContent.replace(regex, `$1\n${textToInsert}\n$2`);

// 写入文件
fs.writeFileSync(readmePath, newReadmeContent);

console.log('README updated successfully with year progress!');
