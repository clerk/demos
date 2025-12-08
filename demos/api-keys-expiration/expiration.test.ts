import { afterAll, expect, test } from "bun:test";
import type { APIKey } from "@clerk/backend";
import {
	createAPIKey,
	findApiKey,
	revokeAPIKey,
	verifyAPIKey,
} from "@/lib/utils";

let createdKey: APIKey;

afterAll(async () => {
	await revokeAPIKey(createdKey.id);
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("API Key should be expired after 3 seconds", async () => {
	// Create API Key with 3 seconds until expiration
	createdKey = await createAPIKey({
		name: "expiration",
		secondsUntilExpiration: 3,
	});

	expect(createdKey.secret).toBeDefined();
	expect(createdKey.expired).toBe(false);

	// Wait for 4 seconds
	await delay(4000);

	const foundKey = await findApiKey(createdKey.id, { expired: true });
	if (!foundKey) {
		throw new Error("API Key not found");
	}

	// API Key should be expired
	expect(foundKey.expired).toBe(true);

	// Expect expired key to fail verification check
	const verify = await verifyAPIKey(createdKey.secret ?? "");
	expect(verify).rejects.toThrow("Not Found");
}, 10000);
