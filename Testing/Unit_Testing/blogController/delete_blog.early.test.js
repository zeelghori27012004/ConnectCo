
// Unit tests for: delete_blog


import Blog from "../../Schema/Blog.js";
import Comment from "../../Schema/Comment.js";
import Notification from "../../Schema/Notification.js";
import User from "../../Schema/User.js";
import { delete_blog } from '../blogController';


jest.mock("../../Schema/Blog");
jest.mock("../../Schema/Notification");
jest.mock("../../Schema/Comment");
jest.mock("../../Schema/User");

describe('delete_blog() delete_blog method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: 'user123',
            body: {
                blog_id: 'blog123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Happy Path Tests
    describe('Happy Path', () => {
        it('should delete a blog and associated notifications and comments successfully', async () => {
            // Mocking the Blog.findOneAndDelete to resolve with a blog object
            Blog.findOneAndDelete.mockResolvedValue({ _id: 'blog123' });

            // Mocking the Notification.deleteMany and Comment.deleteMany to resolve
            Notification.deleteMany.mockResolvedValue();
            Comment.deleteMany.mockResolvedValue();

            // Mocking the User.findOneAndUpdate to resolve
            User.findOneAndUpdate.mockResolvedValue();

            await delete_blog(req, res);

            expect(Blog.findOneAndDelete).toHaveBeenCalledWith({ blog_id: 'blog123' });
            expect(Notification.deleteMany).toHaveBeenCalledWith({ blog: 'blog123' });
            expect(Comment.deleteMany).toHaveBeenCalledWith({ blog_id: 'blog123' });
            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'user123' },
                { $pull: { blog: 'blog123' }, $inc: { "account_info.total_posts": -1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'Done' });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle the case where the blog does not exist', async () => {
            // Mocking the Blog.findOneAndDelete to resolve with null
            Blog.findOneAndDelete.mockResolvedValue(null);

            await delete_blog(req, res);

            expect(Blog.findOneAndDelete).toHaveBeenCalledWith({ blog_id: 'blog123' });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
        });

        it('should handle errors during blog deletion', async () => {
            // Mocking the Blog.findOneAndDelete to reject with an error
            Blog.findOneAndDelete.mockRejectedValue(new Error('Deletion error'));

            await delete_blog(req, res);

            expect(Blog.findOneAndDelete).toHaveBeenCalledWith({ blog_id: 'blog123' });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Deletion error' });
        });

        it('should handle errors during notification deletion', async () => {
            // Mocking the Blog.findOneAndDelete to resolve with a blog object
            Blog.findOneAndDelete.mockResolvedValue({ _id: 'blog123' });

            // Mocking the Notification.deleteMany to reject with an error
            Notification.deleteMany.mockRejectedValue(new Error('Notification deletion error'));

            await delete_blog(req, res);

            expect(Notification.deleteMany).toHaveBeenCalledWith({ blog: 'blog123' });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Notification deletion error' });
        });

        it('should handle errors during comment deletion', async () => {
            // Mocking the Blog.findOneAndDelete to resolve with a blog object
            Blog.findOneAndDelete.mockResolvedValue({ _id: 'blog123' });

            // Mocking the Notification.deleteMany to resolve
            Notification.deleteMany.mockResolvedValue();

            // Mocking the Comment.deleteMany to reject with an error
            Comment.deleteMany.mockRejectedValue(new Error('Comment deletion error'));

            await delete_blog(req, res);

            expect(Comment.deleteMany).toHaveBeenCalledWith({ blog_id: 'blog123' });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Comment deletion error' });
        });

        it('should handle errors during user update', async () => {
            // Mocking the Blog.findOneAndDelete to resolve with a blog object
            Blog.findOneAndDelete.mockResolvedValue({ _id: 'blog123' });

            // Mocking the Notification.deleteMany and Comment.deleteMany to resolve
            Notification.deleteMany.mockResolvedValue();
            Comment.deleteMany.mockResolvedValue();

            // Mocking the User.findOneAndUpdate to reject with an error
            User.findOneAndUpdate.mockRejectedValue(new Error('User update error'));

            await delete_blog(req, res);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'user123' },
                { $pull: { blog: 'blog123' }, $inc: { "account_info.total_posts": -1 } }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'User update error' });
        });
    });
});

// End of unit tests for: delete_blog
