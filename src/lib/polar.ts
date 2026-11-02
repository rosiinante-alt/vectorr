import { createPolar } from "@polar-sh/sdk/2026-10";
import { webhooks } from "@polar-sh/sdk/2026-10";

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error("POLAR_ACCESS_TOKEN is required");
}

if (!process.env.POLAR_SERVER) {
  throw new Error("POLAR_SERVER is required");
}

const environment = process.env.POLAR_SERVER as "sandbox" | "production";

export const polar = createPolar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  environment,
});

export const organizationId = "cc3cbe8c-2507-4fe3-ac7d-293c1428401b";

// Export webhook validation
export const { validateEvent } = webhooks;
