import type { APIKey, M2MToken } from "@clerk/backend";
import clerk from "@/lib/client";
import {
	createAPIKey,
	createM2MToken,
	createRequest,
	revokeAPIKey,
	revokeM2MToken,
} from "@/lib/utils";

async function verifyToken(secret: string) {
	// set up request with token in the Authorization header
	const req = createRequest(secret);
	// authenticate request works with both api key and m2m token
	const res = await clerk.authenticateRequest(req, {
		acceptsToken: ["api_key", "m2m_token"],
	});

	// print the authentication result
	console.log(res.isAuthenticated); //true
	console.log(res.tokenType); // 'api_key' or 'm2m_token'
}

let m2MToken: M2MToken;
let apiKey: APIKey;

async function main() {
	// create a machine token and api key
	m2MToken = await createM2MToken();
	apiKey = await createAPIKey({ name: "multi-token" });

	// check if the tokens are created successfully
	if (!apiKey.secret || !m2MToken.token) {
		throw new Error("API Key or Machine Token secret is undefined");
	}

	// verify the tokens
	await Promise.all([verifyToken(apiKey.secret), verifyToken(m2MToken.token)]);
}

main()
	.catch(console.error)
	.finally(async () => {
		apiKey && (await revokeAPIKey(apiKey.id));
		m2MToken && (await revokeM2MToken(m2MToken.id));
	});
