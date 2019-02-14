// @docs https://github.com/nodejs/node/blob/master/lib/internal/console/constructor.js
// @docs https://nodejs.org/api/util.html#util_util_inspect_object_options

import {inspect as baseInspect} from 'util';
import chalk from 'chalk';

const COMPACT = process.env.NODE_DEBUG_COMPACT ? true : false;
const BREAK_LENGTH = process.env.NODE_DEBUG_BREAK_LENGTH ? process.env.NODE_DEBUG_BREAK_LENGTH * 1 : 100;

const inspect = maybeObject =>
  baseInspect(maybeObject, {compact: COMPACT, colors: true, depth: 20, breakLength: BREAK_LENGTH});

export const d = (...args) => {
  const time = new Date().toISOString();
  const inspected = inspect(args.length === 1 ? args[0] : args);
  console.warn(`🚨 ${chalk.white.bgRed(time)} - ${chalk.red('break')}: ${inspected}`);
  if (process.env.NODE_DEBUG === '1') {
    console.trace();
  }
};

export const dd = (...args) => {
  d.apply(null, args);
  console.trace();
  setTimeout(() => {
    process.exit(1);
  }, 50);
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
