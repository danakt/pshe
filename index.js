const { spawn } = require('child_process');

/**
 * Returns correspondence map between English and Russian layout
 * @param {'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32'} platform
 * @return {Record<string, string>}
 */
const getLayout = (platform) => {
  const isMac = platform == 'darwin';

  const layout = {
    й: 'q',
    ц: 'w',
    у: 'e',
    к: 'r',
    е: 't',
    н: 'y',
    г: 'u',
    ш: 'i',
    щ: 'o',
    з: 'p',
    х: '[',
    Х: '{',
    ъ: ']',
    Ъ: '}',
    ф: 'a',
    ы: 's',
    в: 'd',
    а: 'f',
    п: 'g',
    р: 'h',
    о: 'j',
    л: 'k',
    д: 'l',
    ж: ';',
    Ж: ':',
    э: "'",
    Э: '"',
    ё: isMac ? '\\' : '`',
    Ё: isMac ? '|' : '~',
    я: 'z',
    ч: 'x',
    с: 'c',
    м: 'v',
    и: 'b',
    т: 'n',
    ь: 'm',
    б: ',',
    Б: '<',
    ю: '.',
    Ю: '>',
    '.': isMac ? '&' : '/',
    ',': isMac ? '^' : '?',
    '"': '@',
    '№': '#',
    ';': isMac ? '*' : '$',
    ':': isMac ? '%' : '^',
    '?': isMac ? '?' : '&',
    '/': isMac ? '|' : '/',
    '%': isMac ? '$' : '%',
    ']': '`',
    '[': '~',
    '<': isMac ? '±' : '<',
    '>': isMac ? '§' : '>',
  };

  const fullLayout = Object.keys(layout).reduce((acc, key) => {
    return {
      ...acc,
      [key.toUpperCase()]: layout[key].toUpperCase(),
      [key]: layout[key],
    };
  }, {});

  return fullLayout;
};

/**
 * Creates a function to convert strings from Russian to English
 * @param {Record<string, string>} layout
 * @returns {(str: string) => string}
 */
const createConverter = (layout) => (str) => str.replace(/./g, (ch) => layout[ch] || ch);

const firstString = (...args) => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (typeof arg === 'string') {
      return arg;
    }
  }
};

/**
 * Parses arguments string
 * @param {string} value
 * @return {string[]} Args list
 */
const parseArgs = (value) => {
  const regexp = /([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\5]*?)\5/gi;
  const out = [];

  let match;
  while (match !== null) {
    match = regexp.exec(value);

    if (match !== null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      out.push(firstString(match[1], match[6], match[0]));
    }
  }

  return out;
};

/**
 * Runs cli
 */
module.exports.run = () => {
  const [, , ...args] = process.argv;
  const joinedArgs = args.join(' ');

  const convert = createConverter(getLayout(process.platform));
  const convertedArgs = convert(joinedArgs);
  const parsedArgs = parseArgs(convertedArgs);

  console.log('> $ git ' + convertedArgs + '\n');

  spawn('git', parsedArgs, { stdio: 'inherit' });
};
