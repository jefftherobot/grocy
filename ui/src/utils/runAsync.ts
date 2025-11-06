export async function runAsync<T>(
	context: Record<string, any>, // typically your Pinia store instance
	fn: () => Promise<T>,
	flag: 'loading' | 'saving' = 'loading',
): Promise<T> {
	context[flag] = true
	context.error = null
	try {
		return await fn()
	} catch (err: any) {
		context.error = err.message
		throw err
	} finally {
		context[flag] = false
	}
}
