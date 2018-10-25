import {log, inspect as baseInspect} from 'util';
import chalk from 'chalk';

const inspect = maybeObject =>
  baseInspect(maybeObject, {compact: true, colors: true, depth: Infinity, breakLength: Infinity});

export const d = (...args) => {
  const time = new Date().toISOString();
  log(`🚨  ${chalk.white.bgRed(time)} - ${chalk.red('break')}: ${inspect(args.length === 1 ? args[0] : args)}`);
  if (process.env.NODE_DEBUG === '1') {
    const stack = new Error('Breakpoint').stack.split('\n');
    stack.splice(1, 1);
    log(stack.join('\n'));
  }
};

export const dd = (...args) => {
  d.apply(null, args);
  const stack = new Error('Breakpoint').stack.split('\n');
  stack.splice(1, 1);
  log(stack.join('\n'));
  process.nextTick(() => {
    process.exit(1);
  });
};

export const dt = (...args) => {
  d.apply(null, args);
  throw new Error('debug');
};

export const df = (...args) => {
  d(searchInObjectValues.apply(null, args));
};

export const dp = obj => {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
};

export const searchInObjectValues = (source, search = '', path = '', visited = [], results = []) => {
  if (Array.isArray(source)) {
    source.forEach((obj, index) => {
      searchInObjectValues(obj, search, path + '[' + index + ']', visited, results);
    });
  } else if (typeof source === 'object') {
    if (visited.indexOf(source) !== -1) {
      return null;
    }
    visited.push(source);
    Object.keys(source).forEach(key => {
      try {
        searchInObjectValues(source[key], search, path + '.' + key, visited, results);
      } catch (err) {
        /**/
      }
    });
  } else if (search instanceof RegExp ? search.test(source) : source === search) {
    results.push({value: source, path});
  }
  return results;
};

export const install = () => {
  Object.assign(global, {
    d,
    dd,
    dt,
    df,
    dp
  });
};

export default install;
