
// Unit tests for: latest_blogs


import Blog from "../../Schema/Blog.js";
import { latest_blogs } from '../blogController';


jest.mock("../../Schema/Blog.js");

describe('latest_blogs() latest_blogs method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                page: 1
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Happy Path Tests
    describe('Happy Path', () => {
        it('should return a list of blogs when there are blogs available', async () => {
            // Arrange
            const mockBlogs = [
                { blog_id: '1', title: 'Blog 1', des: 'Description 1', banner: 'Banner 1', activity: {}, tags: [], publishedAt: new Date() },
                { blog_id: '2', title: 'Blog 2', des: 'Description 2', banner: 'Banner 2', activity: {}, tags: [], publishedAt: new Date() }
            ];
            Blog.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockBlogs)
            });

            // Act
            await latest_blogs(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle the case when no blogs are found', async () => {
            // Arrange
            Blog.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });

            // Act
            await latest_blogs(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: [] });
        });

        it('should handle errors gracefully', async () => {
            // Arrange
            const errorMessage = 'Database error';
            Blog.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockRejectedValue(new Error(errorMessage))
            });

            // Act
            await latest_blogs(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should handle invalid page number gracefully', async () => {
            // Arrange
            req.body.page = -1; // Invalid page number
            Blog.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });

            // Act
            await latest_blogs(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: [] });
        });
    });
});

// End of unit tests for: latest_blogs
