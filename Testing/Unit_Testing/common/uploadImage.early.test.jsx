import axios from "axios";
import { uploadImage } from "../aws";
import { describe, it, expect, vi, beforeEach } from "vitest"; // Import Vitest functions

vi.mock("axios"); // Mock axios using Vitest

describe("uploadImage() method", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe("Happy paths", () => {
    it("should return the image URL when the upload is successful", async () => {
      // Arrange: Mock the axios GET and PUT requests
      const mockUploadURL = "https://example.com/upload?token=123";
      axios.get.mockResolvedValueOnce({ data: { uploadURL: mockUploadURL } });
      axios.mockResolvedValueOnce({}); // Mock PUT request

      const img = new Blob(["image data"], { type: "image/png" });

      // Act: Call the uploadImage function
      const result = await uploadImage(img);

      // Assert: Check if the result is the expected URL
      expect(result).toBe("https://example.com/upload");
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/get-upload-url")
      );
      expect(axios).toHaveBeenCalledWith({
        method: "PUT",
        url: mockUploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      });
    });
  });

  describe("Edge cases", () => {
    it("should return null if the GET request fails", async () => {
      // Arrange: Mock the axios GET request to fail
      axios.get.mockRejectedValueOnce(new Error("Network Error"));

      const img = new Blob(["image data"], { type: "image/png" });

      // Act: Call the uploadImage function
      const result = await uploadImage(img);

      // Assert: Check if the result is null
      expect(result).toBeNull();
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/get-upload-url")
      );
    });

    it("should return null if the PUT request fails", async () => {
      // Arrange: Mock the axios GET request to succeed and PUT request to fail
      const mockUploadURL = "https://example.com/upload?token=123";
      axios.get.mockResolvedValueOnce({ data: { uploadURL: mockUploadURL } });
      axios.mockRejectedValueOnce(new Error("Upload Error"));

      const img = new Blob(["image data"], { type: "image/png" });

      // Act: Call the uploadImage function
      const result = await uploadImage(img);

      // Assert: Check if the result is null
      expect(result).toBeNull();
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/get-upload-url")
      );
      expect(axios).toHaveBeenCalledWith({
        method: "PUT",
        url: mockUploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      });
    });
  });
});
