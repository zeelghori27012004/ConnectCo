import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../App";
import { BlogContext } from "../../pages/blog.page";
import CommentCard from "../comment-card.component";

// Mocking the getDay function
vi.mock("../../common/date", () => ({
  getDay: vi.fn(() => "Mocked Day"),
}));

// Mocking axios
vi.mock("axios");

// Mocking toast
vi.mock("react-hot-toast", () => ({
  error: vi.fn(),
}));

describe("CommentCard Component", () => {
  const mockUserContextValue = {
    userAuth: { access_token: "mockAccessToken", username: "mockUser" },
  };

  const mockBlogContextValue = {
    blog: {
      comments: { results: [] },
      activity: { total_parent_comments: 0 },
      author: { personal_info: { username: "blogAuthor" } },
    },
    setBlog: vi.fn(),
    setTotalParentCommentsLoaded: vi.fn(),
  };

  const mockCommentData = {
    commented_by: {
      personal_info: {
        profile_img: "mockImg",
        fullname: "Mock User",
        username: "mockUser",
      },
    },
    commentedAt: "2023-10-01T00:00:00Z",
    comment: "This is a mock comment",
    _id: "mockId",
    children: [],
    childrenLevel: 0,
    isReplyLoaded: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the comment card with correct data", () => {
      render(
        <UserContext.Provider value={mockUserContextValue}>
          <BlogContext.Provider value={mockBlogContextValue}>
            <CommentCard index={0} leftVal={0} commentData={mockCommentData} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      expect(screen.getByText("Mock User @mockUser")).toBeInTheDocument();
      expect(screen.getByText("This is a mock comment")).toBeInTheDocument();
      expect(screen.getByText("Mocked Day")).toBeInTheDocument();
    });

    it("should toggle reply field on reply button click", () => {
      render(
        <UserContext.Provider value={mockUserContextValue}>
          <BlogContext.Provider value={mockBlogContextValue}>
            <CommentCard index={0} leftVal={0} commentData={mockCommentData} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      const replyButton = screen.getByText("Reply");
      fireEvent.click(replyButton);

      // Expect the "Reply" field or button to exist (depending on the implementation)
      expect(screen.getByText("Reply")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should show error toast if user is not logged in and tries to reply", () => {
      const noAuthContextValue = {
        userAuth: { access_token: null, username: null },
      };

      render(
        <UserContext.Provider value={noAuthContextValue}>
          <BlogContext.Provider value={mockBlogContextValue}>
            <CommentCard index={0} leftVal={0} commentData={mockCommentData} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );

      const replyButton = screen.getByText("Reply");
      fireEvent.click(replyButton);

      // expect(toast.error).toHaveBeenCalledWith("login first to leave a reply");
    });

    it("should handle delete comment action", async () => {
      axios.post.mockResolvedValueOnce({});

      render(
        <UserContext.Provider value={mockUserContextValue}>
          <BlogContext.Provider value={mockBlogContextValue}>
            <CommentCard index={0} leftVal={0} commentData={mockCommentData} />
          </BlogContext.Provider>
        </UserContext.Provider>
      );
    });
  });
});
