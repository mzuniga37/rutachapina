import { describe, expect, it } from "vitest";
import { providerFromEnv } from "./index";

describe("providerFromEnv", () => {
  it("requires PROVIDER to be set", () => {
    expect(() => providerFromEnv({})).toThrow("Missing env var PROVIDER");
  });

  it("rejects an unknown provider and lists the available ones", () => {
    expect(() => providerFromEnv({ PROVIDER: "nope" })).toThrow('Unknown PROVIDER "nope". Available: tomtom');
  });

  it("requires the credentials of the chosen provider", () => {
    expect(() => providerFromEnv({ PROVIDER: "tomtom" })).toThrow("Missing env var TOMTOM_API_KEY");
  });

  it("builds the chosen provider", () => {
    expect(providerFromEnv({ PROVIDER: "tomtom", TOMTOM_API_KEY: "k" }).name).toBe("tomtom");
  });
});
