
// Unit tests for: search_blogs_count


import Blog from "../../Schema/Blog.js";


jest.mock("../../Schema/Blog.js");

describe('search_blogs_count() search_blogs_count method', () => {
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

    describe('Happy Paths', () => {
        it('should return the count of blogs when no filters are applied', async () => {
            // Arrange
            const mockCount = 10;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await search_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({ draft: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });

        it('should return the count of blogs filtered by tag', async () => {
            // Arrange
            req.body.tag = 'technology';
            const mockCount = 5;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await search_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({ draft: false, tags: 'technology' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });

        it('should return the count of blogs filtered by author', async () => {
            // Arrange
            req.body.author = 'authorId';
            const mockCount = 3;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await search_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({ draft: false, author: 'authorId' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });

        it('should return the count of blogs filtered by query', async () => {
            // Arrange
            req.body.query = 'JavaScript';
            const mockCount = 7;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await search_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({ draft: false, title: new RegExp('JavaScript', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });
    });

    describe('Edge Cases', () => {
        it('should handle errors gracefully and return a 500 status', async () => {
            // Arrange
            const errorMessage = 'Database error';
            Blog.countDocuments.mockRejectedValue(new Error(errorMessage));

            // Act
            await search_blogs_count(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should return zero count when no blogs match the criteria', async () => {
            // Arrange
            req.body.query = 'NonExistentQuery';
            const mockCount = 0;
            Blog.countDocuments.mockResolvedValue(mockCount);

            // Act
            await search_blogs_count(req, res);

            // Assert
            expect(Blog.countDocuments).toHaveBeenCalledWith({ draft: false, title: new RegExp('NonExistentQuery', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs: mockCount });
        });
    });
});

// End of unit tests for: search_blogs_count
