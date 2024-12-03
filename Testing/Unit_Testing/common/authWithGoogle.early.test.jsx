import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { authWithGoogle } from "../firebase";

// Mock Firebase methods
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
}));

describe("authWithGoogle() method", () => {
  let mockUser;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock user object
    mockUser = { uid: "12345", displayName: "Test User" };
  });

  describe("Happy paths", () => {
    it("should return a user object when signInWithPopup is successful", async () => {
      // Arrange: Mock signInWithPopup to resolve with a user
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });

      // Act: Call the authWithGoogle function
      const user = await authWithGoogle();

      // Assert: Check if the returned user matches the mock user
      expect(user).toEqual(mockUser);
      expect(signInWithPopup).toHaveBeenCalledWith(
        getAuth(),
        expect.any(GoogleAuthProvider)
      );
    });
  });

  describe("Edge cases", () => {
    it("should return null when signInWithPopup throws an error", async () => {
      // Arrange: Mock signInWithPopup to reject with an error
      signInWithPopup.mockRejectedValueOnce(new Error("Popup closed by user"));

      // Act: Call the authWithGoogle function
      const user = await authWithGoogle();

      // Assert: Check if the returned user is null
      expect(user).toBeNull();
      expect(signInWithPopup).toHaveBeenCalledWith(
        getAuth(),
        expect.any(GoogleAuthProvider)
      );
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange: Mock signInWithPopup to reject with an unexpected error
      signInWithPopup.mockRejectedValueOnce(new Error("Unexpected error"));

      // Act: Call the authWithGoogle function
      const user = await authWithGoogle();

      // Assert: Check if the returned user is null
      expect(user).toBeNull();
      expect(signInWithPopup).toHaveBeenCalledWith(
        getAuth(),
        expect.any(GoogleAuthProvider)
      );
    });
  });
});
