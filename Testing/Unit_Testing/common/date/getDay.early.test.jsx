// Unit tests for: getDay

import { getDay } from "../date";

describe("getDay() getDay method", () => {
  // Happy path tests
  describe("Happy paths", () => {
    it("should return the correct day and month for a valid timestamp", () => {
      // Test with a known timestamp
      const timestamp = new Date("2023-10-15T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("15 Oct");
    });

    it("should handle timestamps at the start of the month correctly", () => {
      // Test with a timestamp at the start of a month
      const timestamp = new Date("2023-02-01T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("1 Feb");
    });

    it("should handle timestamps at the end of the month correctly", () => {
      // Test with a timestamp at the end of a month
      const timestamp = new Date("2023-03-31T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("31 Mar");
    });
  });

  // Edge case tests
  describe("Edge cases", () => {
    it("should handle invalid timestamps gracefully", () => {
      // Test with an invalid timestamp
      const timestamp = "invalid-timestamp";
      const result = getDay(timestamp);
      expect(result).toBe("NaN undefined");
    });

    it("should handle timestamps for leap year dates correctly", () => {
      // Test with a leap year date
      const timestamp = new Date("2024-02-29T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("29 Feb");
    });

    it("should handle timestamps for non-leap year February 28th correctly", () => {
      // Test with a non-leap year February 28th
      const timestamp = new Date("2023-02-28T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("28 Feb");
    });

    it("should handle timestamps for the Unix epoch start date correctly", () => {
      // Test with the Unix epoch start date
      const timestamp = new Date("1970-01-01T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("1 Jan");
    });

    it("should handle timestamps for dates far in the future correctly", () => {
      // Test with a date far in the future
      const timestamp = new Date("3000-01-01T00:00:00Z").getTime();
      const result = getDay(timestamp);
      expect(result).toBe("1 Jan");
    });
  });
});

// End of unit tests for: getDay
