import { get, post } from 'httpie'
import { createRequester } from './src/index.js'

const appId = process.env.REALM_APP_ID
const apiKey = process.env.REALM_API_KEY

const request = createRequester({
	appId,
	apiKey,
	fetcher: async (url, options) => {
		const response = options && options.method === 'POST'
			? await post(url, options)
			: await get(url, options)
		return {
			statusCode: response.statusCode,
			json: async () => response.data
		}
	},
})

request(`
	query {
		routes (limit: 1) {
			_id
			airplane
		}
	}
`)
	.then(data => {
		console.log(JSON.stringify(data, undefined, 4))
	})
	.catch(error => {
		console.error('error', error)
	})
