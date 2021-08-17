const catchify = p => p.then(d => ([ , d ])).catch(e => ([ e ]))

export const createRequester = ({ hostname, appId, apiKey, fetcher, now = Date.now, sdkVersion = '1.3.0', maxRetries = 2 }) => {
	let baseUrl, accessToken, refreshToken, tokenCreateTime

	const logIn = async () => {
		const response = await fetcher(`${baseUrl}/auth/providers/api-key/login`, {
			method: 'POST',
			body: {
				key: apiKey,
				options: {
					device: { appId, sdkVersion },
				},
			}
		})
		const data = await response.json()
		accessToken = data.access_token
		refreshToken = data.refresh_token
		tokenCreateTime = now()
	}

	const query = async (string, retryCount = 0) => {
		if (retryCount >= maxRetries) throw new Error('Maximum retries reached when attempting to make a query with an authentication error.')
		const [ error, response ] = await catchify(fetcher(`${baseUrl}/graphql`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${accessToken}`
			},
			body: { query: string }
		}))
		if (error && error.statusCode === 401) {
			// TODO use the refresh token instead of straight up logging in again
			await logIn()
			return query(string, retryCount + 1)
		}
		return response.json()
	}

	return async (string) => {
		if (!hostname) {
			const response = await fetcher(`https://stitch.mongodb.com/api/client/v2.0/app/${appId}/location`)
			hostname = (await response.json()).hostname
			if (!hostname) throw new Error('Unexpected response body from MongoDB Stitch: could not locate hostname.')
			baseUrl = `${hostname}/api/client/v2.0/app/${appId}`
		}
		if (!accessToken) {
			await logIn()
		}
		return query(string)
	}
}
