
// Unit tests for: isliked_by_user


import Notification from "../../Schema/Notification.js";


jest.mock("../../Schema/Notification.js");

describe('isliked_by_user() isliked_by_user method', () => {
  
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return true when a like notification exists for the user and blog', async () => {
      // Arrange: Set up the mock to return a truthy value
      const req = { user: 'user123', body: { _id: 'blog123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      Notification.exists.mockResolvedValue(true);

      // Act: Call the function
      await isliked_by_user(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: true });
    });

    it('should return false when no like notification exists for the user and blog', async () => {
      // Arrange: Set up the mock to return a falsy value
      const req = { user: 'user123', body: { _id: 'blog123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      Notification.exists.mockResolvedValue(false);

      // Act: Call the function
      await isliked_by_user(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: false });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle errors gracefully and return a 500 status code', async () => {
      // Arrange: Set up the mock to throw an error
      const req = { user: 'user123', body: { _id: 'blog123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = 'Database error';
      Notification.exists.mockRejectedValue(new Error(errorMessage));

      // Act: Call the function
      await isliked_by_user(req, res);

      // Assert: Check that the error is handled correctly
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle missing user ID in request', async () => {
      // Arrange: Set up the request without a user ID
      const req = { body: { _id: 'blog123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act: Call the function
      await isliked_by_user(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should handle missing blog ID in request', async () => {
      // Arrange: Set up the request without a blog ID
      const req = { user: 'user123', body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act: Call the function
      await isliked_by_user(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });
});

// End of unit tests for: isliked_by_user
