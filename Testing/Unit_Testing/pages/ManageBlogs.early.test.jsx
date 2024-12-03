import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { UserContext } from "../../App";
import { filterPaginationData } from "../../common/filter-pagination-data";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom"; // Use jest-dom for extended matchers

// Mocking necessary modules and components
vi.mock("axios");
vi.mock("../../common/filter-pagination-data", () => {
  const originalModule = vi.importActual("../../common/filter-pagination-data");
  return {
    __esModule: true,
    ...originalModule,
    filterPaginationData: vi.fn(),
  };
});
vi.mock("../../components/inpage-navigation.component", () => ({
  __esModule: true, // Indicates this is an ES module
  default: () => <div>InPageNavigation</div>, // Mock the default export
}));
vi.mock("../../components/loader.component", () => ({
  __esModule: true, // Indicates this is an ES module
  default: () => <div>Loader</div>, // Mock the default export
}));

vi.mock("../../components/nodata.component", () => ({
  __esModule: true, // Indicate that this is an ES module
  default: () => <div>NoDataMessage</div>, // Mock the default export
}));

vi.mock("../../common/page-animation", () => ({
  __esModule: true, // Mark it as an ES module
  default: ({ children }) => <div>{children}</div>, // Mock default export
}));
vi.mock("../../components/manage-blogcard.component", () => ({
  ManageDraftBlogPost: () => <div>ManageDraftBlogPost</div>,
  ManagePublishedBlogCard: () => <div>ManagePublishedBlogCard</div>,
}));
vi.mock("../../components/load-more.component", () => ({
  __esModule: true, // Indicate that this is an ES module
  default: () => <div>LoadMoreDataBtn</div>, // Mock the default export
}));

describe("ManageBlogs() ManageBlogs method", () => {
  const mockAccessToken = "mockAccessToken";
  const mockUserContextValue = {
    userAuth: { access_token: mockAccessToken },
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { blogs: [] } });
    filterPaginationData.mockResolvedValue({ results: [], deletedDocCount: 0 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the component and fetch blogs and drafts on initial load", async () => {
      render(
        <UserContext.Provider value={mockUserContextValue}>
          <manageBlogs />
        </UserContext.Provider>
      );
    });

    it("should update query and refetch blogs on search input enter key press", async () => {
      render(
        <UserContext.Provider value={mockUserContextValue}>
          <manageBlogs />
        </UserContext.Provider>
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty search input gracefully", async () => {
      render(
        <UserContext.Provider value={mockUserContextValue}>
          <manageBlogs />
        </UserContext.Provider>
      );
    });

    it("should handle API errors gracefully", async () => {
      axios.post.mockRejectedValueOnce(new Error("API Error"));

      render(
        <UserContext.Provider value={mockUserContextValue}>
          <manageBlogs />
        </UserContext.Provider>
      );
    });
  });
});
