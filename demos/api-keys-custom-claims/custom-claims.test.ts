import { afterAll, expect, test } from "bun:test";
import type { APIKey } from "@clerk/backend";
import { createAPIKey, revokeAPIKey, verifyAPIKey } from "@/lib/utils";

let apiKey: APIKey;

afterAll(async () => {
	await revokeAPIKey(apiKey.id);
});

test("API Key should be created with custom claims", async () => {
	apiKey = await createAPIKey({
		name: "custom-claims",
		claims: { stripeId: "cus_1234567890" },
	});

	expect(apiKey.secret).toBeDefined();
	expect(apiKey.claims).toEqual({ stripeId: "cus_1234567890" });
});

test("API Key verification should return the correct custom claims", async () => {
	if (!apiKey.secret) {
		throw new Error("API Key secret is undefined");
	}
	const verifiedKey = await verifyAPIKey(apiKey.secret ?? "");
	expect(verifiedKey.claims).toEqual({ stripeId: "cus_1234567890" });
});
