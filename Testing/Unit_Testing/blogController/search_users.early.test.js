
// Unit tests for: search_users


import User from "../../Schema/User.js";


jest.mock("../../Schema/User.js");

describe('search_users() search_users method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                query: ''
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return a list of users matching the query', async () => {
            // Arrange
            req.body.query = 'john';
            const mockUsers = [
                { personal_info: { fullname: 'John Doe', username: 'johndoe', profile_img: 'img1.jpg' } },
                { personal_info: { fullname: 'Johnny Appleseed', username: 'johnny', profile_img: 'img2.jpg' } }
            ];
            User.find.mockResolvedValue(mockUsers);

            // Act
            await search_users(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('john', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
        });

        it('should return an empty list if no users match the query', async () => {
            // Arrange
            req.body.query = 'nonexistent';
            User.find.mockResolvedValue([]);

            // Act
            await search_users(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('nonexistent', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: [] });
        });
    });

    describe('Edge Cases', () => {
        it('should handle an empty query gracefully', async () => {
            // Arrange
            req.body.query = '';
            User.find.mockResolvedValue([]);

            // Act
            await search_users(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: [] });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            req.body.query = 'error';
            const errorMessage = 'Database error';
            User.find.mockRejectedValue(new Error(errorMessage));

            // Act
            await search_users(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('error', 'i') });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});

// End of unit tests for: search_users
