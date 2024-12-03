
// Unit tests for: change_password


import bcrypt from 'bcryptjs';
import User from "../../Schema/User.js";
import { change_password } from '../userController';


jest.mock("../../Schema/User");
jest.mock("bcryptjs");

describe('change_password() change_password method', () => {
    let req, res, user;

    beforeEach(() => {
        req = {
            body: {
                currentPassword: 'CurrentPass123',
                newPassword: 'NewPass123'
            },
            user: 'userId123'
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        user = {
            personal_info: {
                password: 'hashedCurrentPassword'
            },
            google_auth: false
        };

        User.findOne.mockClear();
        bcrypt.compare.mockClear();
        bcrypt.hash.mockClear();
    });

    // Happy Path Tests
    describe('Happy Path', () => {
        it('should change the password successfully when current password is correct and user is not using Google auth', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, true));
            bcrypt.hash.mockImplementation((password, salt, callback) => callback(null, 'hashedNewPassword'));

            await change_password(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ _id: req.user });
            expect(bcrypt.compare).toHaveBeenCalledWith(req.body.currentPassword, user.personal_info.password, expect.any(Function));
            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword, 10, expect.any(Function));
            expect(User.findOneAndUpdate).toHaveBeenCalledWith({ _id: req.user }, { "personal_info.password": 'hashedNewPassword' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'password changed' });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should return an error if the current password is incorrect', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, false));

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect current password' });
        });

        it('should return an error if the user is authenticated via Google', async () => {
            user.google_auth = true;
            User.findOne.mockResolvedValue(user);

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "You can't change account's password because you logged in through google" });
        });

        it('should return an error if the current password format is invalid', async () => {
            req.body.currentPassword = 'short';

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
        });

        it('should return an error if the new password format is invalid', async () => {
            req.body.newPassword = 'short';

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
        });

        it('should handle errors during password comparison', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockImplementation((password, hash, callback) => callback(new Error('Comparison error'), null));

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: ' some error occured while changing the password, please try again later' });
        });

        it('should handle errors during password hashing', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, true));
            bcrypt.hash.mockImplementation((password, salt, callback) => callback(new Error('Hashing error'), null));

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Some error occured while saving new password, please try again later' });
        });

        it('should handle errors when user is not found', async () => {
            User.findOne.mockRejectedValue(new Error('User not found'));

            await change_password(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'user not found' });
        });
    });
});

// End of unit tests for: change_password
