import { createClerkClient } from "@clerk/backend";

export const MACHINE_A_SECRET_KEY = process.env.MACHINE_A_SECRET_KEY ?? "";
export const MACHINE_B_SECRET_KEY = process.env.MACHINE_B_SECRET_KEY ?? "";
export const TEST_USER_ID = process.env.TEST_USER_ID ?? "";

const clerk = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
	publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export default clerk;
