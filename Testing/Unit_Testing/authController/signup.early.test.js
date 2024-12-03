
// Unit tests for: signup


import bcrypt from 'bcryptjs';
import User from "../../Schema/User.js";
import { formatDatatoSend, generateUsername } from "../../Services/authService.js";
import { signup } from '../authController';


jest.mock("../../Schema/User.js");
jest.mock("bcryptjs");
jest.mock("../../Services/authService.js");

describe('signup() signup method', () => {
    let req, res, mockUserSave;

    beforeEach(() => {
        req = {
            body: {
                fullname: 'John Doe',
                email: 'john.doe@example.com',
                password: 'Password123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockUserSave = jest.fn();
        User.mockImplementation(() => ({
            save: mockUserSave
        }));
    });

    describe('Happy Paths', () => {
        it('should successfully sign up a user with valid data', async () => {
            // Arrange
            bcrypt.hash.mockImplementation((password, salt, callback) => callback(null, 'hashed_password'));
            generateUsername.mockResolvedValue('john_doe');
            formatDatatoSend.mockReturnValue({ access_token: 'token', username: 'john_doe' });

            // Act
            await signup(req, res);

            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10, expect.any(Function));
            expect(generateUsername).toHaveBeenCalledWith('john.doe@example.com');
            expect(mockUserSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ access_token: 'token', username: 'john_doe' });
        });
    });

    describe('Edge Cases', () => {
        it('should return error if fullname is less than 3 characters', async () => {
            // Arrange
            req.body.fullname = 'Jo';

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Fullname must be atleast 3 letters long" });
        });

        it('should return error if email is empty', async () => {
            // Arrange
            req.body.email = '';

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Enter Email" });
        });

        it('should return error if email is invalid', async () => {
            // Arrange
            req.body.email = 'invalid-email';

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Email is invalid" });
        });

        it('should return error if password does not meet criteria', async () => {
            // Arrange
            req.body.password = 'pass';

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter" });
        });

        it('should handle bcrypt hash error', async () => {
            // Arrange
            bcrypt.hash.mockImplementation((password, salt, callback) => callback(new Error('Hash error')));

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ "error": "Hash error" });
        });

        it('should handle user save error due to duplicate email', async () => {
            // Arrange
            bcrypt.hash.mockImplementation((password, salt, callback) => callback(null, 'hashed_password'));
            generateUsername.mockResolvedValue('john_doe');
            mockUserSave.mockRejectedValue({ code: 11000, message: 'Duplicate email' });

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ "error": "Email already exists - Duplicate email" });
        });

        it('should handle user save error due to other reasons', async () => {
            // Arrange
            bcrypt.hash.mockImplementation((password, salt, callback) => callback(null, 'hashed_password'));
            generateUsername.mockResolvedValue('john_doe');
            mockUserSave.mockRejectedValue(new Error('Save error'));

            // Act
            await signup(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ "error": "Save error" });
        });
    });
});

// End of unit tests for: signup
