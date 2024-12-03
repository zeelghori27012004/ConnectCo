import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { vi } from "vitest";
import toast from "react-hot-toast";
import CommentField from "./../comment-field.component";
import { UserContext } from "../../App";
import { BlogContext } from "../../pages/blog.page";

// Mock axios and toast
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  error: vi.fn(),
  Toaster: () => <div>Toaster</div>,
}));

describe("CommentField Component", () => {
  const mockSetBlog = vi.fn();
  const mockSetTotalParentCommentsLoaded = vi.fn();
  const mockSetReplying = vi.fn();

  const userContextValue = {
    userAuth: {
      access_token: "mockAccessToken",
      username: "mockUsername",
      fullname: "Mock Fullname",
      profile_img: "mockProfileImg",
    },
  };

  const blogContextValue = {
    blog: {
      _id: "mockBlogId",
      author: { _id: "mockAuthorId" },
      comments: { results: [] },
      activity: { total_comments: 0, total_parent_comments: 0 },
    },
    setBlog: mockSetBlog,
    setTotalParentCommentsLoaded: mockSetTotalParentCommentsLoaded,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the component with a textarea and a button", () => {
      render(
        <UserContext.Provider value={userContextValue}>
          <BlogContext.Provider value={blogContextValue}>
            <CommentField action="Post" setReplying={mockSetReplying} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      expect(
        screen.getByPlaceholderText("Leave a comment...")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /post/i })).toBeInTheDocument();
    });

    it("should post a comment successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { _id: "newCommentId", commented_by: {} },
      });

      render(
        <UserContext.Provider value={userContextValue}>
          <BlogContext.Provider value={blogContextValue}>
            <CommentField action="Post" setReplying={mockSetReplying} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      fireEvent.change(screen.getByPlaceholderText("Leave a comment..."), {
        target: { value: "This is a test comment" },
      });

      fireEvent.click(screen.getByRole("button", { name: /post/i }));
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should show an error if user is not logged in", () => {
      const noAuthUserContext = { userAuth: {} };

      render(
        <UserContext.Provider value={noAuthUserContext}>
          <BlogContext.Provider value={blogContextValue}>
            <CommentField action="Post" setReplying={mockSetReplying} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      fireEvent.click(screen.getByRole("button", { name: /post/i }));
    });

    it("should show an error if comment is empty", () => {
      render(
        <UserContext.Provider value={userContextValue}>
          <BlogContext.Provider value={blogContextValue}>
            <CommentField action="Post" setReplying={mockSetReplying} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      fireEvent.click(screen.getByRole("button", { name: /post/i }));
    });

    it("should handle axios post error gracefully", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      render(
        <UserContext.Provider value={userContextValue}>
          <BlogContext.Provider value={blogContextValue}>
            <CommentField action="Post" setReplying={mockSetReplying} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      fireEvent.change(screen.getByPlaceholderText("Leave a comment..."), {
        target: { value: "This is a test comment" },
      });

      fireEvent.click(screen.getByRole("button", { name: /post/i }));
    });
  });
});
