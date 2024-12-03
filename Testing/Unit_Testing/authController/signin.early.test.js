
// Unit tests for: signin


import bcrypt from 'bcryptjs';
import User from "../../Schema/User.js";
import { formatDatatoSend } from "../../Services/authService.js";
import { signin } from '../authController';


jest.mock("../../Schema/User.js");
jest.mock("bcryptjs");
jest.mock("../../Services/authService.js");

describe('signin() signin method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'Password123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should successfully sign in a user with correct email and password', async () => {
            // Arrange
            const user = {
                personal_info: {
                    email: 'test@example.com',
                    password: 'hashedPassword'
                },
                google_auth: false
            };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, true));
            const formattedData = { access_token: 'token', username: 'testuser' };
            formatDatatoSend.mockReturnValue(formattedData);

            // Act
            await signin(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ "personal_info.email": 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashedPassword', expect.any(Function));
            expect(formatDatatoSend).toHaveBeenCalledWith(user);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(formattedData);
        });
    });

    describe('Edge cases', () => {
        it('should return 403 if email is not found', async () => {
            // Arrange
            User.findOne.mockResolvedValue(null);

            // Act
            await signin(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ "personal_info.email": 'test@example.com' });
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Email not found" });
        });

        it('should return 403 if password is incorrect', async () => {
            // Arrange
            const user = {
                personal_info: {
                    email: 'test@example.com',
                    password: 'hashedPassword'
                },
                google_auth: false
            };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, false));

            // Act
            await signin(req, res);

            // Assert
            expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashedPassword', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Incorrect password" });
        });

        it('should return 403 if account was created using Google', async () => {
            // Arrange
            const user = {
                personal_info: {
                    email: 'test@example.com',
                    password: 'hashedPassword'
                },
                google_auth: true
            };
            User.findOne.mockResolvedValue(user);

            // Act
            await signin(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "error": "Account was created using Google. Try logging in with Google." });
        });

        it('should return 500 on server error', async () => {
            // Arrange
            User.findOne.mockRejectedValue(new Error('Server error'));

            // Act
            await signin(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ "error": "Server error" });
        });
    });
});

// End of unit tests for: signin
