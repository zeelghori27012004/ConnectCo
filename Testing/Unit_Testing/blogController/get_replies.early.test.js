
// Unit tests for: get_replies


import Comment from "../../Schema/Comment.js";


jest.mock("../../Schema/Comment.js");

describe('get_replies() get_replies method', () => {
    let req, res, mockFindOne;

    beforeEach(() => {
        req = {
            body: {
                _id: 'commentId',
                skip: 0
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockFindOne = jest.fn();
        Comment.findOne = mockFindOne;
    });

    describe('Happy paths', () => {
        it('should return replies when comments are found', async () => {
            // Arrange
            const mockReplies = [
                { _id: 'reply1', comment: 'Reply 1', commented_by: { personal_info: { username: 'user1' } } },
                { _id: 'reply2', comment: 'Reply 2', commented_by: { personal_info: { username: 'user2' } } }
            ];
            mockFindOne.mockResolvedValue({
                children: mockReplies
            });

            // Act
            await get_replies(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ replies: mockReplies });
        });
    });

    describe('Edge cases', () => {
        it('should handle no replies found', async () => {
            // Arrange
            mockFindOne.mockResolvedValue({
                children: []
            });

            // Act
            await get_replies(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ replies: [] });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const errorMessage = 'Database error';
            mockFindOne.mockRejectedValue(new Error(errorMessage));

            // Act
            await get_replies(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should handle invalid comment ID', async () => {
            // Arrange
            req.body._id = null;
            mockFindOne.mockResolvedValue(null);

            // Act
            await get_replies(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid comment ID' });
        });
    });
});

// End of unit tests for: get_replies
