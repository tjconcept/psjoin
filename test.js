import test from 'tape'
import join from './index.js'

test((t) => {
	t.plan(1)
	const a = Promise.resolve(1)
	const b = Promise.resolve(2)
	const c = Promise.resolve(4)
	join(a, b, c, (...args) => t.deepEqual(args, [1, 2, 4]))
})

test('a promise is returned', (t) => {
	const p = join(1, (...args) => {})
	t.ok(p instanceof Promise)
	t.end()
})

test('a promise is returned', (t) => {
	t.plan(1)
	join(1, () => 2).then((r) => t.equal(r, 2))
})

test('no arguments', (t) => {
	t.throws(() => join(), /At least two arguments must be passed/)
	t.end()
})

test('one non-function argument', (t) => {
	t.throws(() => join('abc'), /At least two arguments must be passed/)
	t.end()
})

test('two non-function arguments', (t) => {
	t.throws(() => join('abc', 'cde'), /Missing expected function argument/)
	t.end()
})

test('one function argument', (t) => {
	t.throws(() => join(() => {}), /At least two arguments must be passed/)
	t.end()
})

test('mixed value types (promise and not)', (t) => {
	t.plan(1)
	join(Promise.resolve(1), 2, (...args) => t.deepEqual(args, [1, 2]))
})

test('mixed value types (settled and unsettled)', (t) => {
	t.plan(1)
	const a = Promise.resolve(1)
	let rs
	const b = new Promise((_rs) => (rs = _rs))
	join(a, b, (...args) => t.deepEqual(args, [1, 2]))
	rs(2)
})

test('single rejection', (t) => {
	t.plan(1)
	const err = new Error()
	join(Promise.reject(err), () => t.fail()).catch((_err) =>
		t.equal(_err, err),
	)
})

test('multiple rejections', (t) => {
	t.plan(1)
	const errA = new Error()
	const errB = new Error()
	join(Promise.reject(errA), Promise.reject(errB), () => t.fail()).catch(
		(_err) => t.equal(_err, errA),
	)
})

test('both resolved and rejected', (t) => {
	t.plan(1)
	const err = new Error()
	join(Promise.resolve(1), Promise.reject(err), () => t.fail()).catch(
		(_err) => t.equal(_err, err),
	)
})
