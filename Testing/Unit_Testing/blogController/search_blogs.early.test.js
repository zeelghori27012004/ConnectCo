
// Unit tests for: search_blogs


import Blog from "../../Schema/Blog.js";
import { search_blogs } from '../blogController';


jest.mock("../../Schema/Blog.js");

describe('search_blogs() search_blogs method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Path Tests', () => {
    it('should return blogs filtered by tag', async () => {
      req.body = { tag: 'tech', page: 1, limit: 2 };
      const mockBlogs = [{ blog_id: '1', title: 'Tech Blog' }];
      Blog.find.mockResolvedValue(mockBlogs);

      await search_blogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({ draft: false, tags: 'tech' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
    });

    it('should return blogs filtered by query', async () => {
      req.body = { query: 'JavaScript', page: 1, limit: 2 };
      const mockBlogs = [{ blog_id: '2', title: 'JavaScript Tips' }];
      Blog.find.mockResolvedValue(mockBlogs);

      await search_blogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({ draft: false, title: /JavaScript/i });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
    });

    it('should return blogs filtered by author', async () => {
      req.body = { author: 'authorId', page: 1, limit: 2 };
      const mockBlogs = [{ blog_id: '3', title: 'Author Blog' }];
      Blog.find.mockResolvedValue(mockBlogs);

      await search_blogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({ author: 'authorId', draft: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
    });
  });

  // Edge Case Tests
  describe('Edge Case Tests', () => {
    it('should handle no search parameters gracefully', async () => {
      req.body = { page: 1, limit: 2 };
      const mockBlogs = [{ blog_id: '4', title: 'General Blog' }];
      Blog.find.mockResolvedValue(mockBlogs);

      await search_blogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({ draft: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
    });

    it('should handle eliminate_blog parameter', async () => {
      req.body = { eliminate_blog: '5', page: 1, limit: 2 };
      const mockBlogs = [{ blog_id: '6', title: 'Another Blog' }];
      Blog.find.mockResolvedValue(mockBlogs);

      await search_blogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({ draft: false, blog_id: { $ne: '5' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
    });

    it('should handle database errors gracefully', async () => {
      req.body = { tag: 'error', page: 1, limit: 2 };
      const errorMessage = 'Database error';
      Blog.find.mockRejectedValue(new Error(errorMessage));

      await search_blogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});

// End of unit tests for: search_blogs
