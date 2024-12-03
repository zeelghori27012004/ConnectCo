
// Unit tests for: update_profile_img


import User from "../../Schema/User.js";
import { update_profile_img } from '../userController';


// Mock the User model
jest.mock("../../Schema/User.js");

describe('update_profile_img() update_profile_img method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { url: 'http://example.com/new-profile-img.jpg' },
            user: 'userId123'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should update the profile image successfully', async () => {
            // Arrange: Mock the User.findOneAndUpdate to resolve successfully
            User.findOneAndUpdate.mockResolvedValueOnce({});

            // Act: Call the function
            await update_profile_img(req, res);

            // Assert: Check if the response is correct
            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: req.user },
                { "personal_info.profile_img": req.body.url }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ profile_img: req.body.url });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle database errors gracefully', async () => {
            // Arrange: Mock the User.findOneAndUpdate to reject with an error
            const errorMessage = 'Database error';
            User.findOneAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

            // Act: Call the function
            await update_profile_img(req, res);

            // Assert: Check if the error is handled correctly
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should handle missing URL in request body', async () => {
            // Arrange: Remove the URL from the request body
            req.body.url = undefined;

            // Act: Call the function
            await update_profile_img(req, res);

            // Assert: Check if the function handles missing URL gracefully
            expect(User.findOneAndUpdate).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
        });

        it('should handle invalid user ID', async () => {
            // Arrange: Mock the User.findOneAndUpdate to return null (user not found)
            User.findOneAndUpdate.mockResolvedValueOnce(null);

            // Act: Call the function
            await update_profile_img(req, res);

            // Assert: Check if the function handles invalid user ID gracefully
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
        });
    });
});

// End of unit tests for: update_profile_img
