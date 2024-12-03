// Unit tests for: storeInSession

import { storeInSession } from "../session";

// Import the function to be tested
describe("storeInSession() storeInSession method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    test("should store a string value in sessionStorage", () => {
      // Arrange
      const key = "username";
      const value = "john_doe";

      // Act
      storeInSession(key, value);

      // Assert
      expect(sessionStorage.getItem(key)).toBe(value);
    });

    test("should store a number value in sessionStorage", () => {
      // Arrange
      const key = "age";
      const value = 30;

      // Act
      storeInSession(key, value);

      // Assert
      expect(sessionStorage.getItem(key)).toBe(value.toString());
    });

    test("should store a boolean value in sessionStorage", () => {
      // Arrange
      const key = "isLoggedIn";
      const value = true;

      // Act
      storeInSession(key, value);

      // Assert
      expect(sessionStorage.getItem(key)).toBe(value.toString());
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should handle storing a null value in sessionStorage", () => {
      // Arrange
      const key = "nullValue";
      const value = null;

      // Act
      storeInSession(key, value);

      // Assert
      expect(sessionStorage.getItem(key)).toBe("null");
    });

    test("should handle storing an undefined value in sessionStorage", () => {
      // Arrange
      const key = "undefinedValue";
      const value = undefined;

      // Act
      storeInSession(key, value);

      // Assert
      expect(sessionStorage.getItem(key)).toBe("undefined");
    });

    test("should handle storing an object by converting it to a string", () => {
      // Arrange
      const key = "user";
      const value = { name: "John", age: 30 };

      // Act
      storeInSession(key, JSON.stringify(value));

      // Assert
      expect(sessionStorage.getItem(key)).toBe(JSON.stringify(value));
    });

    test("should handle storing an array by converting it to a string", () => {
      // Arrange
      const key = "numbers";
      const value = [1, 2, 3];

      // Act
      storeInSession(key, JSON.stringify(value));

      // Assert
      expect(sessionStorage.getItem(key)).toBe(JSON.stringify(value));
    });

    test("should overwrite existing value with the same key", () => {
      // Arrange
      const key = "username";
      const initialValue = "john_doe";
      const newValue = "jane_doe";

      // Act
      storeInSession(key, initialValue);
      storeInSession(key, newValue);

      // Assert
      expect(sessionStorage.getItem(key)).toBe(newValue);
    });
  });

  // Clean up after each test
  afterEach(() => {
    sessionStorage.clear();
  });
});

// End of unit tests for: storeInSession
