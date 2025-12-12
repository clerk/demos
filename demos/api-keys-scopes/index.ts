import { createAPIKey, revokeAPIKey, verifyAPIKey } from "@/lib/utils";

// custom verification logic
function hasRequiredScopes(scopes: string[] = [], requiredScopes: string[]) {
	return requiredScopes.every((s) => scopes.includes(s));
}

async function main() {
	const apiKey = await createAPIKey({
		name: "scopes",
		scopes: ["read:repos", "write:repos"],
	});

	const verifiedKey = await verifyAPIKey(apiKey.secret ?? "");
	const scopes = verifiedKey.scopes;

	if (hasRequiredScopes(scopes, ["read:repos", "write:repos"])) {
		// successful scope check
		console.log("API Key has valid scopes");
	}

	if (hasRequiredScopes(scopes, ["admin"])) {
		// failed scope check
		console.log("API Key has invalid scopes");
	}

	// clean up
	await revokeAPIKey(apiKey.id);
}

main().catch(console.error);
