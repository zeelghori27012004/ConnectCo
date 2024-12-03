
// Unit tests for: like_blog


import Blog from "../../Schema/Blog.js";
import Notification from "../../Schema/Notification.js";
import { like_blog } from '../blogController';


jest.mock("../../Schema/Blog");
jest.mock("../../Schema/Notification");

describe('like_blog() like_blog method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: 'user123',
            body: {
                _id: 'blog123',
                islikedByUser: false
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should like a blog and create a notification when not liked by user', async () => {
            // Arrange
            Blog.findOneAndUpdate.mockResolvedValue({ author: 'author123' });
            Notification.prototype.save = jest.fn().mockResolvedValue({});

            // Act
            await like_blog(req, res);

            // Assert
            expect(Blog.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'blog123' },
                { $inc: { "activity.total_likes": 1 } }
            );
            expect(Notification.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ liked_by_user: true });
        });

        it('should unlike a blog and delete the notification when liked by user', async () => {
            // Arrange
            req.body.islikedByUser = true;
            Blog.findOneAndUpdate.mockResolvedValue({ author: 'author123' });
            Notification.findOneAndDelete.mockResolvedValue({});

            // Act
            await like_blog(req, res);

            // Assert
            expect(Blog.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'blog123' },
                { $inc: { "activity.total_likes": -1 } }
            );
            expect(Notification.findOneAndDelete).toHaveBeenCalledWith({
                user: 'user123',
                blog: 'blog123',
                type: "like"
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ liked_by_user: false });
        });
    });

    describe('Edge cases', () => {
        it('should handle error when liking a blog fails', async () => {
            // Arrange
            Blog.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

            // Act
            await like_blog(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });

        it('should handle error when creating a notification fails', async () => {
            // Arrange
            Blog.findOneAndUpdate.mockResolvedValue({ author: 'author123' });
            Notification.prototype.save = jest.fn().mockRejectedValue(new Error('Notification error'));

            // Act
            await like_blog(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Notification error' });
        });

        it('should handle error when unliking a blog fails', async () => {
            // Arrange
            req.body.islikedByUser = true;
            Blog.findOneAndUpdate.mockResolvedValue({ author: 'author123' });
            Notification.findOneAndDelete.mockRejectedValue(new Error('Notification delete error'));

            // Act
            await like_blog(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Notification delete error' });
        });
    });
});

// End of unit tests for: like_blog
