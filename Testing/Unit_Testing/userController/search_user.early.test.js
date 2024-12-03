
// Unit tests for: search_user


import User from "../../Schema/User.js";
import { search_user } from '../userController';


// Mock the User model
jest.mock("../../Schema/User.js");

describe('search_user() search_user method', () => {
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

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return a list of users matching the query', async () => {
            // Arrange
            req.body.query = 'john';
            const mockUsers = [
                { personal_info: { fullname: 'John Doe', username: 'john', profile_img: 'img1.jpg' } },
                { personal_info: { fullname: 'Johnny Appleseed', username: 'johnny', profile_img: 'img2.jpg' } }
            ];
            User.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue(mockUsers)
            });

            // Act
            await search_user(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('john', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
        });

        it('should return an empty list if no users match the query', async () => {
            // Arrange
            req.body.query = 'nonexistent';
            User.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue([])
            });

            // Act
            await search_user(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('nonexistent', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: [] });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle an empty query string gracefully', async () => {
            // Arrange
            req.body.query = '';
            const mockUsers = [
                { personal_info: { fullname: 'Jane Doe', username: 'jane', profile_img: 'img3.jpg' } }
            ];
            User.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue(mockUsers)
            });

            // Act
            await search_user(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('', 'i') });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            req.body.query = 'error';
            User.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            // Act
            await search_user(req, res);

            // Assert
            expect(User.find).toHaveBeenCalledWith({ "personal_info.username": new RegExp('error', 'i') });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});

// End of unit tests for: search_user
