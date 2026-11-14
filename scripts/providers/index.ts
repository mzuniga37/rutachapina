import type { Provider } from "../types";
import { tomtom } from "./tomtom";

type Env = Record<string, string | undefined>;

export function requireEnv(name: string, env: Env = process.env): string {
  const value = env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

// Each entry builds a provider from the environment. Adding a provider is one line here.
const registry: Record<string, (env: Env) => Provider> = {
  tomtom: (env) => tomtom(requireEnv("TOMTOM_API_KEY", env)),
};

/** The provider is chosen explicitly with PROVIDER, so nothing collects data by accident. */
export function providerFromEnv(env: Env = process.env): Provider {
  const name = requireEnv("PROVIDER", env);
  const build = registry[name];
  if (!build) throw new Error(`Unknown PROVIDER "${name}". Available: ${Object.keys(registry).join(", ")}`);
  return build(env);
}
