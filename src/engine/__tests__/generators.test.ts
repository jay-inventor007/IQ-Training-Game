import { describe, expect, it } from "vitest";
import { GENERATORS } from "@/engine/generators";
import { isValidItem } from "@/engine/validation";
import { mulberry32 } from "@/lib/random";
import { DOMAINS } from "@/engine/types";

describe("generators produce valid items across the difficulty range", () => {
  for (const domain of DOMAINS) {
    it(`${domain}: valid at low, mid, and high difficulty`, () => {
      const rng = mulberry32(42);
      for (const difficulty of [0, 0.5, 1, 2, 3, 4, 5, 8]) {
        for (let i = 0; i < 5; i++) {
          const item = GENERATORS[domain](difficulty, rng, []);
          expect(item.domain).toBe(domain);
          expect(isValidItem(item, [])).toBe(true);
          expect(item.options.some((o) => o.id === item.correctOptionId)).toBe(true);
        }
      }
    });

    it(`${domain}: anti-repeat rejects an exact-signature repeat`, () => {
      const rng = mulberry32(7);
      const first = GENERATORS[domain](2, rng, []);
      expect(isValidItem(first, [first.signature])).toBe(false);
      expect(isValidItem(first, [])).toBe(true);
    });
  }
});
