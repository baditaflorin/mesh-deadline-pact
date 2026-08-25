import { expect, test } from "@playwright/test";
import { openTwoPeers } from "@baditaflorin/mesh-common/testing";

test("creating a pact on one peer reaches the other", async ({ browser, baseURL }) => {
  const { a, b, cleanup } = await openTwoPeers(browser, baseURL ?? "", {
    storagePrefix: "mesh-deadline-pact",
  });

  try {
    const pact = "Ship the shared deadline flow";
    await a.getByLabel("Commitment").fill(pact);
    await a.getByRole("button", { name: "Create shared pact" }).click();

    await expect(a.getByText(pact, { exact: true })).toBeVisible();
    await expect(b.getByText(pact, { exact: true })).toBeVisible();
    await expect(a.getByText(/left$/)).toBeVisible();
    await expect(b.getByText(/left$/)).toBeVisible();
  } finally {
    await cleanup();
  }
});
