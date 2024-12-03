
// Unit tests for: new_notification


import Notification from "../../../server/Schema/Notification.js";
import { new_notification } from '../notificationController';


jest.mock("../../../server/Schema/Notification.js");

describe('new_notification() new_notification method', () => {
    let req, res;

    beforeEach(() => {
        req = { user: 'user123' };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should return 200 and true when a new unseen notification exists', async () => {
            // Arrange: Mock Notification.exists to return true
            Notification.exists.mockResolvedValue(true);

            // Act: Call the function
            await new_notification(req, res);

            // Assert: Check if the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ new_notification_availabe: true });
        });

        it('should return 200 and false when no new unseen notification exists', async () => {
            // Arrange: Mock Notification.exists to return false
            Notification.exists.mockResolvedValue(false);

            // Act: Call the function
            await new_notification(req, res);

            // Assert: Check if the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ new_notification_availabe: false });
        });
    });

    describe('Edge cases', () => {
        it('should return 400 if user is not provided in the request', async () => {
            // Arrange: Set req.user to undefined
            req.user = undefined;

            // Act: Call the function
            await new_notification(req, res);

            // Assert: Check if the response is correct
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
        });

        it('should return 500 if there is an error during database operation', async () => {
            // Arrange: Mock Notification.exists to throw an error
            Notification.exists.mockRejectedValue(new Error('Database error'));

            // Act: Call the function
            await new_notification(req, res);

            // Assert: Check if the response is correct
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});

// End of unit tests for: new_notification
