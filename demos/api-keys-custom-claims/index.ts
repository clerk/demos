import { createAPIKey, revokeAPIKey, verifyAPIKey } from "@/lib/utils";

async function main() {
	// create a key with custom claims
	const apiKey = await createAPIKey({
		name: "custom-claims",
		claims: { stripeId: "cus_1234567890" },
	});

	// verify the key
	// biome-ignore lint/style/noNonNullAssertion: secret is always defined on key creation
	const verifiedKey = await verifyAPIKey(apiKey.secret!);
	console.log(verifiedKey.claims);
	// { stripeId: 'cus_1234567890' }

	// clean up
	await revokeAPIKey(apiKey.id);
}

main().catch(console.error);
