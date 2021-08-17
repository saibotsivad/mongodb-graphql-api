// const LOCATION_URL = realmAppId => `https://stitch.mongodb.com/api/client/v2.0/app/${realmAppId}/location`

export const createClient = ({ hostname, appId, apiKey, request, now = Date.now }) => {
	// let baseUrl, loginUrl, graphqlUrl, accessToken, refreshToken, tokenCreateTime
	// return async (string) => {
	// 	if (!hostname) {
	// 		// TODO
	// 		hostname = 'TODO get from Stitch API'
	// 		baseUrl = `${hostname}/api/client/v2.0/app/${appId}`
	// 		loginUrl = `${baseUrl}/auth/providers/api-key/login`
	// 		graphqlUrl = `${baseUrl}/graphql`
	// 	}
	// 	if (!accessToken) {
	// 		// TODO get the access token
	// 		tokenCreateTime = now()
	// 	}
	// 	const response = await request({
	// 		url: graphqlUrl,
	// 		method: 'POST',
	// 		headers: {
	// 			authorization: `Bearer ${accessToken}`
	// 		},
	// 		body: string
	// 	})
	// 	if (response.status !== 200) { // TODO or whatever test
	// 		// TODO if there's a refresh token try that?
	// 		// use the tokenCreateTime to test first?
	// 		// go ahead and re-fetch the access token?
	// 	}
	// }
}
