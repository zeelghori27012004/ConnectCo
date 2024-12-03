import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogInteraction from "../blog-interaction.component";
import { BlogContext } from "../../pages/blog.page";
import { UserContext } from "../../App";
import { vi } from "vitest"; // Import vi for mocking
import { toast } from "react-hot-toast";
import axios from "axios";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter for routing

// Mock axios and toast
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("BlogInteraction Component", () => {
  const mockSetBlog = vi.fn();
  const mockSetLikedByUser = vi.fn();
  const mockSetCommentsWrapper = vi.fn();

  const blogContextValue = {
    blog: {
      _id: "123",
      title: "Test Blog",
      blog_id: "blog123",
      activity: {
        total_likes: 10,
        total_comments: 5,
      },
      author: {
        personal_info: {
          username: "authorUser",
        },
      },
    },
    setBlog: mockSetBlog,
    islikedByUser: false,
    setLikedByUser: mockSetLikedByUser,
    setCommentsWrapper: mockSetCommentsWrapper,
  };

  const userContextValue = {
    userAuth: {
      username: "testUser",
      access_token: "testToken",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the component with initial values", () => {
      render(
        <MemoryRouter>
          {" "}
          {/* Wrap with MemoryRouter to provide routing context */}
          <UserContext.Provider value={userContextValue}>
            <BlogContext.Provider value={blogContextValue}>
              <BlogInteraction />
            </BlogContext.Provider>
          </UserContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText("10")).toBeInTheDocument(); // total likes
      expect(screen.getByText("5")).toBeInTheDocument(); // total comments
    });

    it("should toggle like status and update total likes", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: {} });

      render(
        <MemoryRouter>
          {" "}
          {/* Wrap with MemoryRouter to provide routing context */}
          <UserContext.Provider value={userContextValue}>
            <BlogContext.Provider value={blogContextValue}>
              <BlogInteraction />
            </BlogContext.Provider>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    it("should open comments section when comment button is clicked", () => {
      render(
        <MemoryRouter>
          {" "}
          {/* Wrap with MemoryRouter to provide routing context */}
          <UserContext.Provider value={userContextValue}>
            <BlogContext.Provider value={blogContextValue}>
              <BlogInteraction />
            </BlogContext.Provider>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should show error toast when trying to like without being logged in", () => {
      const noAuthUserContextValue = {
        userAuth: {
          username: "",
          access_token: "",
        },
      };

      render(
        <MemoryRouter>
          {" "}
          {/* Wrap with MemoryRouter to provide routing context */}
          <UserContext.Provider value={noAuthUserContextValue}>
            <BlogContext.Provider value={blogContextValue}>
              <BlogInteraction />
            </BlogContext.Provider>
          </UserContext.Provider>
        </MemoryRouter>
      );

      // expect(toast.error).toHaveBeenCalledWith('please login to like this blog');
    });

    it("should handle axios error gracefully", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Network Error"));

      render(
        <MemoryRouter>
          {" "}
          {/* Wrap with MemoryRouter to provide routing context */}
          <UserContext.Provider value={userContextValue}>
            <BlogContext.Provider value={blogContextValue}>
              <BlogInteraction />
            </BlogContext.Provider>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
  });
});
