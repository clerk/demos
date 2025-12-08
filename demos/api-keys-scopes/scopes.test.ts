import { afterAll, expect, test } from "bun:test";
import type { APIKey } from "@clerk/backend";
import { createAPIKey, revokeAPIKey, verifyAPIKey } from "@/lib/utils";

let apiKey: APIKey;

afterAll(async () => {
	await revokeAPIKey(apiKey.id);
});

function customVerifyScopes(apiKey: APIKey, requiredScopes: string[]) {
	return requiredScopes.every((scope) => (apiKey.scopes ?? []).includes(scope));
}

test("API Key should be created with scopes", async () => {
	const customScopes = ["read:repos", "write:repos"];
	apiKey = await createAPIKey({
		name: "scopes",
		scopes: customScopes,
	});

	expect(apiKey.secret).toBeDefined();
	expect(apiKey.scopes).toEqual(customScopes);
});

test("API Key with valid scopes should pass custom validation", async () => {
	if (!apiKey.secret) {
		throw new Error("API Key secret is undefined");
	}
	const verifiedKey = await verifyAPIKey(apiKey.secret ?? "");
	expect(customVerifyScopes(verifiedKey, ["write:repos"])).toBeTrue();
});

test("API Key with invalid scopes should fail custom validation", async () => {
	if (!apiKey.secret) {
		throw new Error("API Key secret is undefined");
	}
	const verifiedKey = await verifyAPIKey(apiKey.secret ?? "");
	expect(customVerifyScopes(verifiedKey, ["admin"])).toBeFalse();
});
