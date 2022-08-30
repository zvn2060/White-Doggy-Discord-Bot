const {request} = require('undici');
const express = require('express');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

const app = express();

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: process.env.CLIENT_ID,
					client_secret: process.env.CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${process.env.PAGE_PORT}`,
					scope: 'identify ',
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await getJSONResponse(tokenResponseData.body);
			console.log(oauthData);
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		}
	}

	return response.sendFile('.\\web\\index.html', { root: '.' });
});

app.listen(process.env.PAGE_PORT, () => console.log(`App listening at http://localhost:${process.env.PAGE_PORT}`));