// Unit tests for: lookInSession

import { lookInSession, removeFromSession, storeInSession } from "../session";

// Import the function to be tested
describe("lookInSession() lookInSession method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    test("should return the correct value for a stored key", () => {
      // Arrange: Store a value in sessionStorage
      const key = "username";
      const value = "john_doe";
      storeInSession(key, value);

      // Act: Retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The retrieved value should match the stored value
      expect(result).toBe(value);
    });

    test("should return null for a key that does not exist", () => {
      // Arrange: Ensure the key does not exist in sessionStorage
      const key = "nonExistentKey";
      removeFromSession(key);

      // Act: Attempt to retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The result should be null
      expect(result).toBeNull();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should handle an empty string as a key", () => {
      // Arrange: Store a value with an empty string as the key
      const key = "";
      const value = "emptyKeyTest";
      storeInSession(key, value);

      // Act: Retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The retrieved value should match the stored value
      expect(result).toBe(value);
    });

    test("should handle special characters in the key", () => {
      // Arrange: Store a value with special characters in the key
      const key = "!@#$%^&*()_+";
      const value = "specialCharsTest";
      storeInSession(key, value);

      // Act: Retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The retrieved value should match the stored value
      expect(result).toBe(value);
    });

    test("should return null if sessionStorage is cleared", () => {
      // Arrange: Store a value and then clear sessionStorage
      const key = "temporaryKey";
      const value = "temporaryValue";
      storeInSession(key, value);
      sessionStorage.clear();

      // Act: Attempt to retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The result should be null
      expect(result).toBeNull();
    });

    test("should handle undefined as a key", () => {
      // Arrange: Store a value with undefined as the key
      const key = undefined;
      const value = "undefinedKeyTest";
      storeInSession(key, value);

      // Act: Retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The retrieved value should match the stored value
      expect(result).toBe(value);
    });

    test("should handle null as a key", () => {
      // Arrange: Store a value with null as the key
      const key = null;
      const value = "nullKeyTest";
      storeInSession(key, value);

      // Act: Retrieve the value using lookInSession
      const result = lookInSession(key);

      // Assert: The retrieved value should match the stored value
      expect(result).toBe(value);
    });
  });
});

// End of unit tests for: lookInSession
