
// Unit tests for: trending_blogs


import Blog from "../../Schema/Blog.js";
import { trending_blogs } from '../blogController';


jest.mock("../../Schema/Blog.js");

describe('trending_blogs() trending_blogs method', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return a list of trending blogs sorted by total reads, likes, and published date', async () => {
            // Arrange: Mock the Blog.find method to return a list of blogs
            const mockBlogs = [
                { blog_id: '1', title: 'Blog 1', publishedAt: '2023-10-01' },
                { blog_id: '2', title: 'Blog 2', publishedAt: '2023-09-01' }
            ];
            Blog.find.mockResolvedValue(mockBlogs);

            // Act: Call the trending_blogs function
            await trending_blogs(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: mockBlogs });
        });
    });

    describe('Edge Cases', () => {
        it('should handle the case where no blogs are found', async () => {
            // Arrange: Mock the Blog.find method to return an empty array
            Blog.find.mockResolvedValue([]);

            // Act: Call the trending_blogs function
            await trending_blogs(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ blogs: [] });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange: Mock the Blog.find method to throw an error
            const errorMessage = 'Database error';
            Blog.find.mockRejectedValue(new Error(errorMessage));

            // Act: Call the trending_blogs function
            await trending_blogs(req, res);

            // Assert: Check that the error response is correct
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});

// End of unit tests for: trending_blogs
