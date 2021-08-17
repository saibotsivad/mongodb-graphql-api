import { createRequester } from './src/index.js'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

const fetchWrapper = result => ({
	json: async () => result
})

test('requests are called correctly', async () => {
	let fetchCount = 0
	const request = createRequester({
		// hostname is undefined
		appId: 'my-app',
		apiKey: 'secret123',
		fetcher: (url, options) => {
			fetchCount++
			if (fetchCount === 1) {
				assert.equal(url, 'https://stitch.mongodb.com/api/client/v2.0/app/my-app/location')
				return fetchWrapper({ hostname: 'https://test-host.com' })
			}
			if (fetchCount === 2) {
				assert.equal(url, 'https://test-host.com/api/client/v2.0/app/my-app/auth/providers/api-key/login')
				return fetchWrapper({ access_token: 'access-123', refresh_token: 'refresh-456' })
			}
			if (fetchCount === 3) {
				assert.equal(url, 'https://test-host.com/api/client/v2.0/app/my-app/graphql')
				return { status: 200 }
			}
			return fetchWrapper({})
		},
	})
	const response = await request('query')
	assert.equal(response, 'foo', 'the response is whatever the last fetcher request returns')

	assert.equal(fetchCount, 3, 'request for hostname, for access token, and for graphql')
})

test.run()
