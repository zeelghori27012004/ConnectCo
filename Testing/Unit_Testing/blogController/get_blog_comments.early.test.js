
// Unit tests for: get_blog_comments


import { mockRequest, mockResponse } from 'jest-mock-req-res';
import Comment from "../../Schema/Comment.js";
import { get_blog_comments } from '../blogController';


jest.mock("../../Schema/Comment.js");

describe('get_blog_comments() get_blog_comments method', () => {
    let req, res;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
    });

    describe('Happy Paths', () => {
        it('should return comments successfully when valid blog_id and skip are provided', async () => {
            // Arrange
            const blog_id = 'validBlogId';
            const skip = 0;
            const comments = [
                { commented_by: { personal_info: { username: 'user1', fullname: 'User One', profile_img: 'img1' } }, commentedAt: new Date() },
                { commented_by: { personal_info: { username: 'user2', fullname: 'User Two', profile_img: 'img2' } }, commentedAt: new Date() }
            ];
            req.body = { blog_id, skip };
            Comment.find.mockResolvedValue(comments);

            // Act
            await get_blog_comments(req, res);

            // Assert
            expect(Comment.find).toHaveBeenCalledWith({ blog_id, isReply: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(comments);
        });
    });

    describe('Edge Cases', () => {
        it('should handle the case when no comments are found', async () => {
            // Arrange
            const blog_id = 'validBlogId';
            const skip = 0;
            req.body = { blog_id, skip };
            Comment.find.mockResolvedValue([]);

            // Act
            await get_blog_comments(req, res);

            // Assert
            expect(Comment.find).toHaveBeenCalledWith({ blog_id, isReply: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const blog_id = 'validBlogId';
            const skip = 0;
            const errorMessage = 'Database error';
            req.body = { blog_id, skip };
            Comment.find.mockRejectedValue(new Error(errorMessage));

            // Act
            await get_blog_comments(req, res);

            // Assert
            expect(Comment.find).toHaveBeenCalledWith({ blog_id, isReply: false });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should handle invalid skip values gracefully', async () => {
            // Arrange
            const blog_id = 'validBlogId';
            const skip = -1; // Invalid skip value
            req.body = { blog_id, skip };
            Comment.find.mockResolvedValue([]);

            // Act
            await get_blog_comments(req, res);

            // Assert
            expect(Comment.find).toHaveBeenCalledWith({ blog_id, isReply: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });
});

// End of unit tests for: get_blog_comments
