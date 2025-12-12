import clerk from "@/lib/client";
import { createAPIKey, createRequest, revokeAPIKey } from "@/lib/utils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
	// create a key with expiration
	const createdKey = await createAPIKey({
		name: "expiration",
		secondsUntilExpiration: 3,
	});

	const request = createRequest(createdKey.secret);

	// authenticate request with valid key
	const validRes = await clerk.authenticateRequest(request, {
		acceptsToken: "api_key",
	});

	console.log(validRes.isAuthenticated); //true
	console.log(validRes.reason); // null

	// wait for the key to expire
	await delay(4000);

	// authenticate request with expired key
	const res = await clerk.authenticateRequest(request, {
		acceptsToken: "api_key",
	});

	console.log(res.isAuthenticated); //false
	console.log(res.reason); //  "token-invalid",

	// clean up
	await revokeAPIKey(createdKey.id);
}

main().catch(console.error);
