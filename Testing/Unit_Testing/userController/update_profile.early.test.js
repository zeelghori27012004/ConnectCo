
// Unit tests for: update_profile


import User from "../../Schema/User.js";
import { update_profile } from '../userController';


jest.mock("../../Schema/User.js"); // Mock the User model

describe('update_profile() update_profile method', () => {
    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should update the user profile successfully with valid data', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'newUsername',
                    bio: 'This is a valid bio',
                    social_links: {
                        facebook: 'https://facebook.com/user',
                        twitter: 'https://twitter.com/user',
                        website: 'https://userwebsite.com'
                    }
                },
                user: 'userId123'
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            User.findOneAndUpdate.mockResolvedValue({});

            // Act
            await update_profile(req, res);

            // Assert
            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: req.user },
                {
                    "personal_info.username": req.body.username,
                    "personal_info.bio": req.body.bio,
                    social_links: req.body.social_links
                },
                { runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ username: req.body.username });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should return 403 if username is less than 3 characters', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'ab',
                    bio: 'This is a valid bio',
                    social_links: {}
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Act
            await update_profile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Username should be at least 3 letters long" });
        });

        it('should return 403 if bio exceeds 150 characters', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'validUsername',
                    bio: 'a'.repeat(151), // 151 characters
                    social_links: {}
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Act
            await update_profile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Bio should not be more than 150 characters" });
        });

        it('should return 403 if social link format is invalid', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'validUsername',
                    bio: 'This is a valid bio',
                    social_links: {
                        facebook: 'invalidLink'
                    }
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Act
            await update_profile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "facebook link is invalid. You must enter a full link" });
        });

        it('should return 500 if social link URL is malformed', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'validUsername',
                    bio: 'This is a valid bio',
                    social_links: {
                        facebook: 'http://'
                    }
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Act
            await update_profile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "You must provide full social links with http(s) included" });
        });

        it('should return 409 if username is already taken', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'existingUsername',
                    bio: 'This is a valid bio',
                    social_links: {}
                },
                user: 'userId123'
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const error = new Error();
            error.code = 11000; // Duplicate key error code
            User.findOneAndUpdate.mockRejectedValue(error);

            // Act
            await update_profile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: "Username is already taken" });
        });

        it('should return 500 for other database errors', async () => {
            // Arrange
            const req = {
                body: {
                    username: 'validUsername',
                    bio: 'This is a valid bio',
                    social_links: {}
                },
                user: 'userId123'
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const error = new Error('Database error');
            User.findOneAndUpdate.mockRejectedValue(error);

            // Act
            await update_profile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});

// End of unit tests for: update_profile
