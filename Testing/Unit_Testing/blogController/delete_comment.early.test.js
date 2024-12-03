
// Unit tests for: delete_comment


import Comment from "../../Schema/Comment.js";
import { deleteComments } from "../../Services/blogService.js";


jest.mock("../../Schema/Comment");
jest.mock("../../Services/blogService");

describe('delete_comment() delete_comment method', () => {
  
  let req, res;

  beforeEach(() => {
    req = {
      user: 'user123',
      body: {
        _id: 'comment123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy paths', () => {
    it('should delete the comment if the user is the commenter', async () => {
      // Arrange
      Comment.findOne.mockResolvedValue({
        commented_by: 'user123',
        blog_author: 'author123'
      });

      // Act
      await delete_comment(req, res);

      // Assert
      expect(deleteComments).toHaveBeenCalledWith('comment123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'done' });
    });

    it('should delete the comment if the user is the blog author', async () => {
      // Arrange
      Comment.findOne.mockResolvedValue({
        commented_by: 'anotherUser',
        blog_author: 'user123'
      });

      // Act
      await delete_comment(req, res);

      // Assert
      expect(deleteComments).toHaveBeenCalledWith('comment123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'done' });
    });
  });

  describe('Edge cases', () => {
    it('should return a 403 error if the user is neither the commenter nor the blog author', async () => {
      // Arrange
      Comment.findOne.mockResolvedValue({
        commented_by: 'anotherUser',
        blog_author: 'anotherAuthor'
      });

      // Act
      await delete_comment(req, res);

      // Assert
      expect(deleteComments).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "You can not delete this comment" });
    });

    it('should handle errors when finding the comment', async () => {
      // Arrange
      Comment.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await delete_comment(req, res);

      // Assert
      expect(deleteComments).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should handle errors when deleting comments', async () => {
      // Arrange
      Comment.findOne.mockResolvedValue({
        commented_by: 'user123',
        blog_author: 'author123'
      });
      deleteComments.mockImplementation(() => {
        throw new Error('Delete error');
      });

      // Act
      await delete_comment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Delete error' });
    });
  });
});

// End of unit tests for: delete_comment
