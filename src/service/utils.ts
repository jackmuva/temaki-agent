export const requestWithRetry = async (fn: () => Promise<Response>, maxAttempts: number, curAttempt: number = 1): Promise<Response | null> => {
	try {
		const res = await fn();
		if (res.ok) return res;
		if (curAttempt >= maxAttempts) return res;
		await new Promise(resolve =>
			setTimeout(resolve, curAttempt * curAttempt * 1000)
		);
		return await requestWithRetry(fn, maxAttempts, curAttempt + 1);

	} catch (error) {
		if (curAttempt >= maxAttempts) return null;
		await new Promise(resolve =>
			setTimeout(resolve, curAttempt * curAttempt * 1000)
		);
		return await requestWithRetry(fn, maxAttempts, curAttempt + 1);
	}
}
