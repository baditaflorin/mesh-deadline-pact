import { createMeshConfig } from "@baditaflorin/mesh-common";

export const config = createMeshConfig({
  appName: "mesh-deadline-pact",
  description: "A browser-local peer commitment room with shared deadlines and check-ins.",
  accentHex: "#e879f9",
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
});
