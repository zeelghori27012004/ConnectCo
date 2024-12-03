
// Unit tests for: user_written_blogs_count


import Blog from "../../Schema/Blog.js";
import { user_written_blogs_count } from '../userController';


jest.mock("../../Schema/Blog.js"); // Mock the Blog model

describe('user_written_blogs_count() user_written_blogs_count method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: 'userId123',
            body: {
                draft: false,
                query: 'test'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should return the correct count of blogs for a user', async () => {
            // Arrange
            const mockCount = 5;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await user_written_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });
    });

    describe('Edge cases', () => {
        it('should handle no blogs found for the user', async () => {
            // Arrange
            const mockCount = 0;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await user_written_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });

        it('should handle a database error gracefully', async () => {
            // Arrange
            const mockError = new Error('Database error');
            Blog.countDocuments.mockRejectedValue(mockError);

            // Act
            await user_written_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });

        it('should handle an empty query string', async () => {
            // Arrange
            req.body.query = '';
            const mockCount = 3;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await user_written_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({
                author: req.user,
                draft: req.body.draft,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });

        it('should handle a missing draft field in the request body', async () => {
            // Arrange
            delete req.body.draft;
            const mockCount = 2;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await user_written_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({
                author: req.user,
                draft: undefined,
                title: new RegExp(req.body.query, 'i')
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });
    });
});

// End of unit tests for: user_written_blogs_count
