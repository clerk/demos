import { afterAll, expect, test } from "bun:test";
import type { APIKey, M2MToken } from "@clerk/backend";
import clerk, { MACHINE_B_SECRET_KEY } from "@/lib/client";
import {
	createAPIKey,
	createM2MToken,
	createRequest,
	revokeAPIKey,
	revokeM2MToken,
} from "@/lib/utils";

let m2MToken: M2MToken;
let apiKey: APIKey;

async function createCases() {
	m2MToken = await createM2MToken();
	apiKey = await createAPIKey({ name: "multi-token" });

	if (!apiKey.secret || !m2MToken.token) {
		throw new Error("API Key or Machine Token secret is undefined");
	}

	return [
		{ ...apiKey, type: "api_key" as const, secret: apiKey.secret },
		{ ...m2MToken, type: "m2m_token" as const, secret: m2MToken.token },
	];
}

afterAll(async () => {
	// delete api key and machine token after testing
	await revokeAPIKey(apiKey.id);
	await revokeM2MToken(m2MToken.id);
});

const cases = await createCases();

// test each token type
test.each(
	cases,
)("authenticateRequest should succeed for $type", async (item) => {
	// set up request with token in the Authorization header
	const req = createRequest(item.secret);
	// authenticate request with either api key or m2m token
	const res = await clerk.authenticateRequest(req, {
		acceptsToken: ["api_key", "m2m_token"],
		machineSecretKey: MACHINE_B_SECRET_KEY,
	});
	expect(res.isAuthenticated).toBe(true);
	expect(res.tokenType).toBe(item.type);
});
