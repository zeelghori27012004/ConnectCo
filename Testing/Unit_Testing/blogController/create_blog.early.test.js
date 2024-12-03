
// Unit tests for: create_blog


import { nanoid } from 'nanoid';
import Blog from "../../Schema/Blog.js";
import User from "../../Schema/User.js";
import { create_blog } from '../blogController';


jest.mock("../../Schema/Blog");
jest.mock("../../Schema/User");
jest.mock("nanoid");

describe('create_blog() create_blog method', () => {
  let request, response, mockUser, mockBlog;

  beforeEach(() => {
    request = {
      user: 'authorId',
      body: {
        title: 'Test Blog',
        des: 'This is a test description',
        banner: 'test-banner.jpg',
        tags: ['test', 'blog'],
        content: { blocks: ['content block'] },
        draft: false,
        id: null,
      },
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUser = {
      _id: 'authorId',
      account_info: { total_posts: 0 },
      blogs: [],
    };

    mockBlog = {
      _id: 'blogId',
      blog_id: 'test-blogId',
    };

    User.findOneAndUpdate.mockResolvedValue(mockUser);
    Blog.findOneAndUpdate.mockResolvedValue(mockBlog);
    Blog.prototype.save = jest.fn().mockResolvedValue(mockBlog);
    nanoid.mockReturnValue('uniqueId');
  });

  describe('Happy Paths', () => {
    it('should create a new blog successfully when all required fields are provided', async () => {
      await create_blog(request, response);

      expect(Blog.prototype.save).toHaveBeenCalled();
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'authorId' },
        { $inc: { 'account_info.total_posts': 1 }, $push: { blogs: mockBlog._id } }
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ id: 'test-blogId' });
    });

    it('should update an existing blog when an id is provided', async () => {
      request.body.id = 'existing-blogId';
      await create_blog(request, response);

      expect(Blog.findOneAndUpdate).toHaveBeenCalledWith(
        { blog_id: 'existing-blogId' },
        expect.objectContaining({
          title: 'Test Blog',
          des: 'This is a test description',
          banner: 'test-banner.jpg',
          content: { blocks: ['content block'] },
          tags: ['test', 'blog'],
          draft: false,
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ id: 'test-blogId' });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if the title is missing', async () => {
      request.body.title = '';
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Provide a title' });
    });

    it('should return an error if the description is missing or too long when not a draft', async () => {
      request.body.des = '';
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Provide a description in maximum of 200 characters' });

      request.body.des = 'a'.repeat(201);
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Provide a description in maximum of 200 characters' });
    });

    it('should return an error if the banner is missing when not a draft', async () => {
      request.body.banner = '';
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Provide a blog image' });
    });

    it('should return an error if the content is missing when not a draft', async () => {
      request.body.content.blocks = [];
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Provide some blog content' });
    });

    it('should return an error if the tags are missing or too many when not a draft', async () => {
      request.body.tags = [];
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Select some relatable tags, at max 7' });

      request.body.tags = Array(8).fill('tag');
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({ error: 'Select some relatable tags, at max 7' });
    });

    it('should handle database errors gracefully', async () => {
      Blog.prototype.save.mockRejectedValue(new Error('Database error'));
      await create_blog(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});

// End of unit tests for: create_blog
