
// Unit tests for: get_profile


import User from "../../Schema/User.js";
import { get_profile } from '../userController';


jest.mock("../../Schema/User.js");

describe('get_profile() get_profile method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: 'testuser'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should return user details when a valid username is provided', async () => {
            // Arrange: Mock the User.findOne method to return a user object
            const mockUser = {
                personal_info: {
                    username: 'testuser',
                    fullname: 'Test User',
                    profile_img: 'testimg.jpg'
                }
            };
            User.findOne.mockResolvedValue(mockUser);

            // Act: Call the get_profile function
            await get_profile(req, res);

            // Assert: Check if the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('Edge cases', () => {
        it('should return a 500 error if there is a database error', async () => {
            // Arrange: Mock the User.findOne method to throw an error
            const errorMessage = 'Database error';
            User.findOne.mockRejectedValue(new Error(errorMessage));

            // Act: Call the get_profile function
            await get_profile(req, res);

            // Assert: Check if the error response is correct
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should return a 200 status with null if no user is found', async () => {
            // Arrange: Mock the User.findOne method to return null
            User.findOne.mockResolvedValue(null);

            // Act: Call the get_profile function
            await get_profile(req, res);

            // Assert: Check if the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(null);
        });

        it('should handle an empty username gracefully', async () => {
            // Arrange: Set the username to an empty string
            req.body.username = '';

            // Act: Call the get_profile function
            await get_profile(req, res);

            // Assert: Check if the response is correct
            expect(User.findOne).toHaveBeenCalledWith({ "personal_info.username": '' });
        });
    });
});

// End of unit tests for: get_profile
