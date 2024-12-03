
// Unit tests for: all_notifications_count


import Notification from "../../../server/Schema/Notification.js";
import { all_notifications_count } from '../notificationController';


jest.mock("../../../server/Schema/Notification.js");

describe('all_notifications_count() all_notifications_count method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: 'user123',
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return the total count of notifications for the user when no filter is applied', async () => {
            // Arrange
            const totalDocs = 5;
            Notification.countDocuments.mockResolvedValue(totalDocs);

            // Act
            await all_notifications_count(req, res);

            // Assert
            expect(Notification.countDocuments).toHaveBeenCalledWith({
                notification_for: req.user,
                user: { $ne: req.user }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs });
        });

        it('should return the total count of notifications for the user with a specific filter', async () => {
            // Arrange
            req.body.filter = 'comment';
            const totalDocs = 3;
            Notification.countDocuments.mockResolvedValue(totalDocs);

            // Act
            await all_notifications_count(req, res);

            // Assert
            expect(Notification.countDocuments).toHaveBeenCalledWith({
                notification_for: req.user,
                user: { $ne: req.user },
                type: 'comment'
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ totalDocs });
        });
    });

    describe('Edge Cases', () => {
        it('should return an error if the user is not found in the request', async () => {
            // Arrange
            req.user = null;

            // Act
            await all_notifications_count(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found in the request" });
        });

        it('should handle errors from the Notification model gracefully', async () => {
            // Arrange
            const errorMessage = 'Database error';
            Notification.countDocuments.mockRejectedValue(new Error(errorMessage));

            // Act
            await all_notifications_count(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});

// End of unit tests for: all_notifications_count
