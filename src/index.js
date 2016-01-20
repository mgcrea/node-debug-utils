
import util from 'util';
import chalk from 'chalk';

global.d = (...args) => {
  const time = new Date().toISOString();
  util.log(chalk.white.bgRed(time) + ' - ' + chalk.red('break') + ': ' + util.inspect.call(null, args.length === 1 ? args[0] : args, false, 10, true));
};

global.dd = (...args) => {
  global.d.apply(null, args);
  const stack = new Error().stack.split('\n');
  stack.splice(1, 1);
  util.log(stack.join('\n'));
  process.exit(1);
};

global.df = (...args) => {
  global.d(searchInObjectValues.apply(null, args));
};

global.dp = (obj) => {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
};

function searchInObjectValues(source, search = '', path = '', visited = [], results = []) {
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
      } catch (err) {/**/}
    });
  } else if (search instanceof RegExp ? search.test(source) : source === search) {
    results.push({value: source, path});
  }
  return results;
}

export default {
  searchInObjectValues
};
