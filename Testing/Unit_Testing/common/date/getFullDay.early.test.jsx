// Unit tests for: getFullDay

import { getFullDay } from "../date";

// Import the function to be tested
describe("getFullDay() getFullDay method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    test("should return the correct full date for a valid timestamp", () => {
      // Arrange
      const timestamp = new Date("2023-10-15T00:00:00Z").getTime(); // 15th October 2023
      const expected = "15 Oct 2023";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });

    test("should return the correct full date for a leap year date", () => {
      // Arrange
      const timestamp = new Date("2024-02-29T00:00:00Z").getTime(); // 29th February 2024
      const expected = "29 Feb 2024";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });

    test("should return the correct full date for a date at the end of the year", () => {
      // Arrange
      const timestamp = new Date("2023-12-31T00:00:00Z").getTime(); // 31st December 2023
      const expected = "31 Dec 2023";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    test("should handle a timestamp of zero (Unix epoch start)", () => {
      // Arrange
      const timestamp = 0; // 1st January 1970
      const expected = "1 Jan 1970";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });

    test("should handle a negative timestamp (before Unix epoch)", () => {
      // Arrange
      const timestamp = -86400000; // 31st December 1969
      const expected = "31 Dec 1969";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });

    test('should return "NaN undefined NaN" for an invalid timestamp', () => {
      // Arrange
      const timestamp = "invalid"; // Invalid timestamp
      const expected = "NaN undefined NaN";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });

    test("should handle a timestamp for a date in the far future", () => {
      // Arrange
      const timestamp = new Date("3000-01-01T00:00:00Z").getTime(); // 1st January 3000
      const expected = "1 Jan 3000";

      // Act
      const result = getFullDay(timestamp);

      // Assert
      expect(result).toBe(expected);
    });
  });
});

// End of unit tests for: getFullDay
