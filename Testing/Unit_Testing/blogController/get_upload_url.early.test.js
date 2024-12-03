
// Unit tests for: get_upload_url


import { generateUploadURL } from "../../Services/blogService.js";
import { get_upload_url } from '../blogController';


jest.mock("../../Services/blogService", () => ({
  generateUploadURL: jest.fn(),
}));

describe('get_upload_url() get_upload_url method', () => {
  let mockRequest;
  let mockResponse;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
    };
  });

  describe('Happy Paths', () => {
    it('should return a 200 status and a valid upload URL when generateUploadURL resolves successfully', async () => {
      // Arrange: Set up the mock to return a successful URL
      const mockUrl = 'https://example.com/upload';
      generateUploadURL.mockResolvedValue(mockUrl);

      // Act: Call the function
      await get_upload_url(mockRequest, mockResponse);

      // Assert: Check that the response is as expected
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ uploadURL: mockUrl });
    });
  });

  describe('Edge Cases', () => {
    it('should return a 500 status and an error message when generateUploadURL throws an error', async () => {
      // Arrange: Set up the mock to throw an error
      const mockError = new Error('Failed to generate URL');
      generateUploadURL.mockRejectedValue(mockError);

      // Act: Call the function
      await get_upload_url(mockRequest, mockResponse);

      // Assert: Check that the response is as expected
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});

// End of unit tests for: get_upload_url
