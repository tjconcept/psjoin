import test from 'tape'
import join from './index.js'

test(async (t) => {
	const a = Promise.resolve(1)
	const b = Promise.resolve(2)
	const c = Promise.resolve(4)
	await join(a, b, c, (...args) => t.deepEqual(args, [1, 2, 4]))
})

test('a promise is returned', async (t) => {
	const p = join(1, () => {})
	t.ok(p instanceof Promise)
	await p
})

test('a promise is returned', async (t) => {
	await join(1, () => 2).then((r) => t.equal(r, 2))
})

test('no arguments', async (t) => {
	await rejects(t, join(), 'At least two arguments must be passed')
})

test('one non-function argument', async (t) => {
	await rejects(t, join('abc'), 'At least two arguments must be passed')
})

test('two non-function arguments', async (t) => {
	await rejects(t, join('abc', 'cde'), 'Missing expected function argument')
})

test('one function argument', async (t) => {
	await rejects(
		t,
		join(() => {}),
		'At least two arguments must be passed',
	)
})

test('mixed value types (promise and not)', async (t) => {
	await join(Promise.resolve(1), 2, (...args) => t.deepEqual(args, [1, 2]))
})

test('mixed value types (settled and unsettled)', async (t) => {
	const {promise: a, resolve: resolveA} = Promise.withResolvers()
	const {promise: b, resolve: resolveB} = Promise.withResolvers()
	resolveA(1)
	const args = join(a, b, (...args) => args)
	resolveB(2)
	t.deepEqual(await args, [1, 2])
})

test('single rejection', async (t) => {
	const err = new Error()
	await join(Promise.reject(err), () => t.fail()).catch((_err) =>
		t.equal(_err, err),
	)
})

test('multiple rejections', async (t) => {
	const errA = new Error()
	const errB = new Error()
	await join(Promise.reject(errA), Promise.reject(errB), () =>
		t.fail(),
	).catch((_err) => t.equal(_err, errA))
})

test('both resolved and rejected', async (t) => {
	const err = new Error()
	await join(Promise.resolve(1), Promise.reject(err), () => t.fail()).catch(
		(_err) => t.equal(_err, err),
	)
})

async function rejects(t, promise, expectedMessage, message = 'rejected') {
	return promise.catch((err) => {
		t.ok(err instanceof Error && err.message === expectedMessage, message)
	})
}
