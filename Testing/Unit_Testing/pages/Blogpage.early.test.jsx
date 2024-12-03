import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import { useParams } from "react-router-dom";
import BlogPage from "../blog.page";
import "@testing-library/jest-dom";

// Mocking necessary modules and components
vi.mock("axios");
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: vi.fn(),
}));

vi.mock("../../components/comments.component", () => ({
  __esModule: true,
  ...vi.importActual("../../components/comments.component"),
  fetchComments: vi.fn(() => async () => []),
  default: () => <div>CommentsContainer</div>,
}));

vi.mock("../../common/date", () => ({
  __esModule: true,
  ...vi.importActual("../../common/date"),
  getDay: vi.fn(() => "January 1, 2023"),
}));

vi.mock("../../common/page-animation", () => ({
  default: () => <div>AnimationWrapper</div>,
}));

vi.mock("../../components/loader.component", () => ({
  default: () => <div>Loader</div>,
}));

vi.mock("../../components/blog-interaction.component", () => ({
  default: () => <div>BlogInteraction</div>,
}));

vi.mock("../../components/blog-post.component", () => ({
  default: () => <div>BlogPostCard</div>,
}));

vi.mock("../../components/blog-content.component", () => ({
  default: () => <div>BlogContent</div>,
}));

describe("BlogPage() BlogPage method", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    axios.post
      .mockResolvedValueOnce({
        data: {
          blog: {
            _id: "123",
            title: "Test Blog",
            content: [
              {
                blocks: [{ type: "paragraph", data: { text: "Test content" } }],
              },
            ],
            author: {
              personal_info: {
                fullname: "John Doe",
                username: "johndoe",
                profile_img: "img.jpg",
              },
            },
            banner: "banner.jpg",
            publishedAt: "2023-01-01T00:00:00Z",
            tags: ["test"],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          blogs: [
            {
              author: {
                personal_info: {
                  fullname: "Jane Doe",
                  username: "janedoe",
                  profile_img: "img2.jpg",
                },
              },
            },
          ],
        },
      });
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should render the loader initially", () => {
      render(<BlogPage />);
      expect(screen.getByText("Loader")).toBeInTheDocument();
    });

    it("should render the blog content after loading", async () => {
      render(<BlogPage />);
      await waitFor(() =>
        expect(screen.getByText("Test Blog")).toBeInTheDocument()
      );
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render similar blogs", async () => {
      render(<BlogPage />);
      await waitFor(() =>
        expect(screen.getByText("Similar Blogs")).toBeInTheDocument()
      );
      expect(screen.getByText("BlogPostCard")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle no similar blogs gracefully", async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          blogs: [],
        },
      });
      render(<BlogPage />);
      await waitFor(() =>
        expect(screen.queryByText("Similar Blogs")).not.toBeInTheDocument()
      );
    });

    it("should handle API errors gracefully", async () => {
      axios.post.mockRejectedValueOnce(new Error("API Error"));
      render(<BlogPage />);
      await waitFor(() =>
        expect(screen.queryByText("Test Blog")).not.toBeInTheDocument()
      );
    });
  });
});

// End of unit tests for: BlogPage
