import type { ClerkClient } from "@clerk/backend";
import { nanoid } from "nanoid";
import clerk, { MACHINE_A_SECRET_KEY, TEST_USER_ID } from "@/lib/client";

export function createRequest(token: string) {
	const headers = new Headers();
	headers.set("Authorization", `Bearer ${token}`);
	return new Request("https://example.com", { headers });
}

export async function verifyAPIKey(secret: string) {
	return await clerk.apiKeys.verify(secret);
}

export async function createM2MToken() {
	return await clerk.m2m.createToken({
		machineSecretKey: MACHINE_A_SECRET_KEY,
	});
}

type CreateAPIKeyParams = Omit<
	Parameters<ClerkClient["apiKeys"]["create"]>[0],
	"description" | "subject"
>;

export async function createAPIKey({ name, ...params }: CreateAPIKeyParams) {
	return await clerk.apiKeys.create({
		...params,
		name: `${name}-${nanoid()}`,
		description: `created for ${name} test`,
		subject: TEST_USER_ID,
	});
}

export async function revokeM2MToken(m2mTokenId: string) {
	return await clerk.m2m.revokeToken({
		m2mTokenId,
		revocationReason: "test cleanup",
		machineSecretKey: MACHINE_A_SECRET_KEY,
	});
}

export async function revokeAPIKey(apiKeyId: string) {
	return await clerk.apiKeys.revoke({
		apiKeyId,
		revocationReason: "test cleanup",
	});
}

export async function revokeUserApiKeys(userId: string) {
	const keys = await clerk.apiKeys.list({
		subject: userId,
		includeInvalid: false,
	});
	for (const key of keys.data) {
		await clerk.apiKeys.revoke({
			apiKeyId: key.id,
			revocationReason: "test cleanup",
		});
		console.log(`Revoked API Key: ${key.id}`);
	}
}

export async function findApiKey(
	id: string,
	{ expired = false }: { expired?: boolean } = {},
) {
	const keys = await clerk.apiKeys.list({
		subject: TEST_USER_ID,
		includeInvalid: expired,
		limit: 100,
	});

	const key = keys.data.find((key) => key.id === id);
	if (!key) return undefined;

	return key;
}
