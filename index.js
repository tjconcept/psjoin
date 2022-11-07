'use strict'

module.exports = (...args) => {
	const fn = args.at(-1)
	if (args.length < 2) {
		throw new Error('At least two arguments must be passed')
	}
	if (typeof fn !== 'function') {
		throw new Error('Missing expected function argument')
	}
	return Promise.all(args.slice(0, -1)).then((v) => fn(...v))
}
