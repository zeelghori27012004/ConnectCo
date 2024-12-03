import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import { filterPaginationData } from "../../common/filter-pagination-data";
import HomePage from "../home.page";
import "@testing-library/jest-dom";

// Mocking necessary components and functions
vi.mock("axios");
vi.mock("../../common/filter-pagination-data", () => ({
  __esModule: true,
  ...vi.importActual("../../common/filter-pagination-data"),
  filterPaginationData: vi.fn(),
}));

vi.mock("../../common/page-animation", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../components/inpage-navigation.component", async () => {
  const actual = await vi.importActual(
    "../../components/inpage-navigation.component"
  );
  return {
    __esModule: true,
    ...actual, // Spread all original exports
    default: ({ children }) => <div>{children}</div>, // Override the default export
  };
});

vi.mock("../../components/loader.component", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

vi.mock("../../components/blog-post.component", () => ({
  __esModule: true,
  default: ({ content, author }) => (
    <div>
      <h2>{content.title}</h2>
      <p>{author.name}</p>
    </div>
  ),
}));

vi.mock("../../components/nobanner-blog-post.component", () => ({
  __esModule: true,
  default: ({ blog }) => <div>{blog.title}</div>,
}));

vi.mock("../../components/nodata.component", () => ({
  __esModule: true,
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock("../../components/load-more.component", () => ({
  __esModule: true,
  default: () => <button>Load More</button>,
}));

describe("HomePage() HomePage method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the HomePage component with latest blogs", async () => {
      // Mocking axios response for latest blogs
      axios.post.mockResolvedValueOnce({
        data: {
          blogs: [
            {
              title: "Blog 1",
              author: { personal_info: { name: "Author 1" } },
            },
          ],
        },
      });
      filterPaginationData.mockResolvedValueOnce({
        results: [
          { title: "Blog 1", author: { personal_info: { name: "Author 1" } } },
        ],
      });

      render(<HomePage />);
    });

    it("should render trending blogs", async () => {
      // Mocking axios response for trending blogs
      axios.get.mockResolvedValueOnce({
        data: { blogs: [{ title: "Trending Blog 1" }] },
      });

      render(<HomePage />);
    });
  });

  describe("Edge Cases", () => {
    it("should handle no blogs available", async () => {
      // Mocking axios response for no blogs
      axios.post.mockResolvedValueOnce({ data: { blogs: [] } });
      filterPaginationData.mockResolvedValueOnce({ results: [] });

      render(<HomePage />);
    });

    it("should handle no trending blogs available", async () => {
      // Mocking axios response for no trending blogs
      axios.get.mockResolvedValueOnce({ data: { blogs: [] } });

      render(<HomePage />);
    });

    it("should switch categories and fetch blogs by category", async () => {
      // Mocking axios response for category blogs
      axios.post.mockResolvedValueOnce({
        data: {
          blogs: [
            {
              title: "Category Blog 1",
              author: { personal_info: { name: "Author 2" } },
            },
          ],
        },
      });
      filterPaginationData.mockResolvedValueOnce({
        results: [
          {
            title: "Category Blog 1",
            author: { personal_info: { name: "Author 2" } },
          },
        ],
      });

      render(<HomePage />);

      // Simulate category button click
      fireEvent.click(screen.getByText("programming"));
    });
  });
});

// End of unit tests for: HomePage
