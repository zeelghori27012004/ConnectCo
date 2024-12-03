
// Unit tests for: add_comment


import Blog from "../../Schema/Blog.js";
import Comment from "../../Schema/Comment.js";
import Notification from "../../Schema/Notification.js";
import { add_comment } from '../blogController';


jest.mock("../../Schema/Comment");
jest.mock("../../Schema/Blog");
jest.mock("../../Schema/Notification");

describe('add_comment() add_comment method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: 'user123',
      body: {
        _id: 'blog123',
        comment: 'This is a test comment',
        blog_author: 'author123',
        replying_to: null,
        notification_id: null,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should successfully add a comment to a blog', async () => {
      // Mock Comment.save() to resolve with a comment object
      Comment.prototype.save = jest.fn().mockResolvedValue({
        _id: 'comment123',
        comment: 'This is a test comment',
        commentedAt: new Date(),
        children: [],
      });

      // Mock Blog.findOneAndUpdate() to resolve
      Blog.findOneAndUpdate = jest.fn().mockResolvedValue({});

      // Mock Notification.save() to resolve
      Notification.prototype.save = jest.fn().mockResolvedValue({});

      await add_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        comment: 'This is a test comment',
        commentedAt: expect.any(Date),
        _id: 'comment123',
        user_id: 'user123',
        children: [],
      });
    });

    it('should handle adding a reply to a comment', async () => {
      req.body.replying_to = 'parentComment123';

      Comment.prototype.save = jest.fn().mockResolvedValue({
        _id: 'reply123',
        comment: 'This is a test reply',
        commentedAt: new Date(),
        children: [],
      });

      Blog.findOneAndUpdate = jest.fn().mockResolvedValue({});
      Notification.prototype.save = jest.fn().mockResolvedValue({});
      Comment.findOneAndUpdate = jest.fn().mockResolvedValue({
        commented_by: 'originalCommenter123',
      });

      await add_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        comment: 'This is a test reply',
        commentedAt: expect.any(Date),
        _id: 'reply123',
        user_id: 'user123',
        children: [],
      });
    });
  });

  describe('Edge cases', () => {
    it('should return an error if the comment is empty', async () => {
      req.body.comment = '';

      await add_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Write something to leave a comment',
      });
    });

    it('should handle database errors gracefully', async () => {
      Comment.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await add_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });

    it('should handle errors when updating a blog with a new comment', async () => {
      Comment.prototype.save = jest.fn().mockResolvedValue({
        _id: 'comment123',
        comment: 'This is a test comment',
        commentedAt: new Date(),
        children: [],
      });

      Blog.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Update error'));

      await add_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Update error',
      });
    });
  });
});

// End of unit tests for: add_comment
