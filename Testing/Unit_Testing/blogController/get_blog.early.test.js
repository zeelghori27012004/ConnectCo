
// Unit tests for: get_blog


import Blog from "../../Schema/Blog.js";
import User from "../../Schema/User.js";
import { get_blog } from '../blogController';


jest.mock("../../Schema/Blog");
jest.mock("../../Schema/User");

describe('get_blog() get_blog method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                blog_id: 'test-blog-id',
                draft: false,
                mode: 'view'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should return the blog details and increment read count when mode is not edit', async () => {
            // Arrange
            const mockBlog = {
                author: {
                    personal_info: {
                        username: 'testuser'
                    }
                },
                draft: false
            };
            Blog.findOneAndUpdate.mockResolvedValue(mockBlog);
            User.findOneAndUpdate.mockResolvedValue({});

            // Act
            await get_blog(req, res);

            // Assert
            expect(Blog.findOneAndUpdate).toHaveBeenCalledWith(
                { blog_id: 'test-blog-id' },
                { $inc: { "activity.total_reads": 1 } }
            );
            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { "personal_info.username": 'testuser' },
                { $inc: { "account_info.total_reads": 1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blog: mockBlog });
        });

        it('should return the blog details without incrementing read count when mode is edit', async () => {
            // Arrange
            req.body.mode = 'edit';
            const mockBlog = {
                author: {
                    personal_info: {
                        username: 'testuser'
                    }
                },
                draft: false
            };
            Blog.findOneAndUpdate.mockResolvedValue(mockBlog);

            // Act
            await get_blog(req, res);

            // Assert
            expect(Blog.findOneAndUpdate).toHaveBeenCalledWith(
                { blog_id: 'test-blog-id' },
                { $inc: { "activity.total_reads": 0 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blog: mockBlog });
        });
    });

    describe('Edge cases', () => {
        it('should return an error if the blog is a draft and draft access is not requested', async () => {
            // Arrange
            const mockBlog = {
                author: {
                    personal_info: {
                        username: 'testuser'
                    }
                },
                draft: true
            };
            Blog.findOneAndUpdate.mockResolvedValue(mockBlog);

            // Act
            await get_blog(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'you can not access draft blogs' });
        });

        it('should handle errors from Blog.findOneAndUpdate gracefully', async () => {
            // Arrange
            Blog.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

            // Act
            await get_blog(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });

        it('should handle errors from User.findOneAndUpdate gracefully', async () => {
            // Arrange
            const mockBlog = {
                author: {
                    personal_info: {
                        username: 'testuser'
                    }
                },
                draft: false
            };
            Blog.findOneAndUpdate.mockResolvedValue(mockBlog);
            User.findOneAndUpdate.mockRejectedValue(new Error('User update error'));

            // Act
            await get_blog(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'User update error' });
        });
    });
});

// End of unit tests for: get_blog
