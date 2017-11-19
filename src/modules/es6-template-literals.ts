const includes = require('array-includes');

const startBlockSentinel = Symbol('blockSentinel');
const ignoreBlockSentinel = Symbol('ignoreBlockSentinel');
const endBlockSentinel = Symbol('endBlockSentinel');
const helpers = {
	if: (condition, thenTemplate, elseTemplate = '') => {
		return condition ? startBlockSentinel : ignoreBlockSentinel;
	},
	end: () => {
		return endBlockSentinel;
	},
	unless: (condition, thenTemplate, elseTemplate) => {
		return !condition ? startBlockSentinel : ignoreBlockSentinel;
	},
	registerHelper: (name, fn) => {
		helpers[name] = fn;
	},
};

export function template(strings: Array<string>, ...interpolatedValues) {
	const blockNest = [];
	return strings.reduce((total, current, index) => {
		if (includes(blockNest, ignoreBlockSentinel)) { // If at any point we chose to ignore this block, skip this render pass
			return total;
		}

		total += current;
		if (interpolatedValues.hasOwnProperty(index)) {
			const value = interpolatedValues[index];
			if (value === startBlockSentinel || value === ignoreBlockSentinel) {
				blockNest.push(value);
			}
			if (value === endBlockSentinel) {
				blockNest.pop();
			}
			total += String(interpolatedValues[index]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		return total;
	}, '');
}


helpers.registerHelper('capitalize', (string) => {
	return string[0].toUpperCase() + string.slice(1).toUpperCase();
});
