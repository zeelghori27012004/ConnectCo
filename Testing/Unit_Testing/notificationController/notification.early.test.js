
// Unit tests for: notification


import Notification from "../../../server/Schema/Notification.js";
import { notification } from '../notificationController';


jest.mock("../../../server/Schema/Notification.js");

describe('notification() notification method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: 'user123',
            body: {
                page: 1,
                filter: 'all',
                deletedDocCount: 0
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return notifications for the user with default filter and pagination', async () => {
            // Arrange
            const mockNotifications = [{ id: 1, type: 'comment', seen: false }];
            Notification.find.mockResolvedValue(mockNotifications);
            Notification.updateMany.mockResolvedValue();

            // Act
            await notification(req, res);

            // Assert
            expect(Notification.find).toHaveBeenCalledWith({
                notification_for: 'user123',
                user: { $ne: 'user123' }
            });
            expect(Notification.find().skip).toHaveBeenCalledWith(0);
            expect(Notification.find().limit).toHaveBeenCalledWith(10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ notifications: mockNotifications });
        });

        it('should apply filter when provided', async () => {
            // Arrange
            req.body.filter = 'like';
            const mockNotifications = [{ id: 2, type: 'like', seen: false }];
            Notification.find.mockResolvedValue(mockNotifications);
            Notification.updateMany.mockResolvedValue();

            // Act
            await notification(req, res);

            // Assert
            expect(Notification.find).toHaveBeenCalledWith({
                notification_for: 'user123',
                user: { $ne: 'user123' },
                type: 'like'
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ notifications: mockNotifications });
        });
    });

    describe('Edge Cases', () => {
        it('should handle no user in request', async () => {
            // Arrange
            req.user = null;

            // Act
            await notification(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found in the request' });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const errorMessage = 'Database error';
            Notification.find.mockRejectedValue(new Error(errorMessage));

            // Act
            await notification(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it('should adjust skipDocs if deletedDocCount is provided', async () => {
            // Arrange
            req.body.deletedDocCount = 5;
            const mockNotifications = [{ id: 3, type: 'comment', seen: false }];
            Notification.find.mockResolvedValue(mockNotifications);
            Notification.updateMany.mockResolvedValue();

            // Act
            await notification(req, res);

            // Assert
            expect(Notification.find().skip).toHaveBeenCalledWith(-5);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ notifications: mockNotifications });
        });
    });
});

// End of unit tests for: notification
