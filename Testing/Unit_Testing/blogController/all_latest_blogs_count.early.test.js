
// Unit tests for: all_latest_blogs_count


import Blog from "../../Schema/Blog.js";
import { all_latest_blogs_count } from '../blogController';


jest.mock("../../Schema/Blog.js");

describe('all_latest_blogs_count() all_latest_blogs_count method', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return the total count of non-draft blogs', async () => {
            // Arrange: Mock the countDocuments method to return a count of 10
            Blog.countDocuments.mockResolvedValue(10);

            // Act: Call the function
            await all_latest_blogs_count(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: 10 });
        });
    });

    describe('Edge Cases', () => {
        it('should handle errors gracefully and return a 500 status code', async () => {
            // Arrange: Mock the countDocuments method to throw an error
            const errorMessage = 'Database error';
            Blog.countDocuments.mockRejectedValue(new Error(errorMessage));

            // Act: Call the function
            await all_latest_blogs_count(req, res);

            // Assert: Check that the error is handled correctly
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should return zero when there are no non-draft blogs', async () => {
            // Arrange: Mock the countDocuments method to return a count of 0
            Blog.countDocuments.mockResolvedValue(0);

            // Act: Call the function
            await all_latest_blogs_count(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: 0 });
        });
    });
});

// End of unit tests for: all_latest_blogs_count
