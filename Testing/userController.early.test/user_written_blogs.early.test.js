
// Unit tests for: user_written_blogs


import Blog from "../../Schema/Blog.js";
import { user_written_blogs } from '../userController';


jest.mock("../../Schema/Blog.js"); // Mock the Blog model

describe('user_written_blogs() user_written_blogs method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: 'userId123',
            body: {
                page: 1,
                draft: false,
                query: '',
                deletedDocCount: 0
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return blogs for a valid user and default parameters', async () => {
            // Arrange
            const mockBlogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
            Blog.find.mockResolvedValue(mockBlogs);

            // Act
            await user_written_blogs(req, res);

            // Assert
            expect(Blog.find).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
        });

        it('should handle pagination correctly', async () => {
            // Arrange
            req.body.page = 2;
            const mockBlogs = [{ title: 'Blog 3' }, { title: 'Blog 4' }];
            Blog.find.mockResolvedValue(mockBlogs);

            // Act
            await user_written_blogs(req, res);

            // Assert
            expect(Blog.find).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle an empty query string', async () => {
            // Arrange
            req.body.query = '';
            const mockBlogs = [{ title: 'Blog 5' }];
            Blog.find.mockResolvedValue(mockBlogs);

            // Act
            await user_written_blogs(req, res);

            // Assert
            expect(Blog.find).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
        });

        it('should handle a negative deletedDocCount', async () => {
            // Arrange
            req.body.deletedDocCount = -5;
            const mockBlogs = [{ title: 'Blog 6' }];
            Blog.find.mockResolvedValue(mockBlogs);

            // Act
            await user_written_blogs(req, res);

            // Assert
            expect(Blog.find).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
        });

        it('should return a 500 error if there is a database error', async () => {
            // Arrange
            const errorMessage = 'Database error';
            Blog.find.mockRejectedValue(new Error(errorMessage));

            // Act
            await user_written_blogs(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});

// End of unit tests for: user_written_blogs
