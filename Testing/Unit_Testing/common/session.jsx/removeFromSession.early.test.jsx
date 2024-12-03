// Unit tests for: removeFromSession

import { removeFromSession, storeInSession } from "../session";

// Import the necessary functions
describe("removeFromSession() removeFromSession method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    test("should remove an existing item from sessionStorage", () => {
      // Arrange: Store an item in sessionStorage
      const key = "testKey";
      const value = "testValue";
      storeInSession(key, value);

      // Act: Remove the item
      removeFromSession(key);

      // Assert: The item should no longer exist in sessionStorage
      expect(sessionStorage.getItem(key)).toBeNull();
    });

    test("should not throw an error when removing a non-existing item", () => {
      // Arrange: Define a key that does not exist in sessionStorage
      const key = "nonExistingKey";

      // Act & Assert: Removing a non-existing key should not throw an error
      expect(() => removeFromSession(key)).not.toThrow();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should handle removing an item with an empty string as a key", () => {
      // Arrange: Store an item with an empty string as a key
      const key = "";
      const value = "emptyKeyTest";
      storeInSession(key, value);

      // Act: Remove the item
      removeFromSession(key);

      // Assert: The item should no longer exist in sessionStorage
      expect(sessionStorage.getItem(key)).toBeNull();
    });

    test("should handle removing an item with a very long key", () => {
      // Arrange: Store an item with a very long key
      const key = "a".repeat(1000); // 1000 characters long
      const value = "longKeyTest";
      storeInSession(key, value);

      // Act: Remove the item
      removeFromSession(key);

      // Assert: The item should no longer exist in sessionStorage
      expect(sessionStorage.getItem(key)).toBeNull();
    });

    test("should handle removing an item with special characters in the key", () => {
      // Arrange: Store an item with special characters in the key
      const key = "!@#$%^&*()_+";
      const value = "specialCharKeyTest";
      storeInSession(key, value);

      // Act: Remove the item
      removeFromSession(key);

      // Assert: The item should no longer exist in sessionStorage
      expect(sessionStorage.getItem(key)).toBeNull();
    });
  });
});

// End of unit tests for: removeFromSession
