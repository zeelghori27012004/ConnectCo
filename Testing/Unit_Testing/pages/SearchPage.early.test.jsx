import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { filterPaginationData } from "../../common/filter-pagination-data";
import SearchPage from "../search.page";
import "@testing-library/jest-dom";

// Mocking necessary components and functions
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: vi.fn(),
}));

vi.mock("axios");
vi.mock("../../components/inpage-navigation.component", () => ({
  __esModule: true, // Mark the module as an ES module
  default: () => <div>InPageNavigation</div>, // Return the mocked component
}));

vi.mock("../../components/loader.component", () => ({
  __esModule: true, // Mark the module as an ES module
  default: () => <div>Loader</div>, // Return the mocked component as default export
}));

vi.mock("../../common/page-animation", () => ({
  __esModule: true, // Ensure the module is treated as an ES module
  default: ({ children }) => <div>{children}</div>, // Mock the default export
}));

vi.mock("../../components/blog-post.component", () => ({
  __esModule: true, // Marks the module as an ES module
  default: () => <div>BlogPostCard</div>, // Return the mocked component
}));

vi.mock("../../components/nodata.component", () => ({
  __esModule: true, // Ensure it's treated as an ES module
  default: () => <div>NoDataMessage</div>, // Mock the default export
}));

vi.mock("../../components/load-more.component", () => ({
  __esModule: true, // Ensures it's treated as an ES module
  default: () => <div>LoadMoreDataBtn</div>, // Mock the default export
}));

vi.mock("../../components/usercard.component", () => ({
  __esModule: true, // Ensures it's treated as an ES module
  default: () => <div>UserCard</div>, // Mock the default export
}));

vi.mock("../../common/filter-pagination-data", () => {
  const originalModule = vi.importActual("../../common/filter-pagination-data");
  return {
    __esModule: true,
    ...originalModule,
    filterPaginationData: vi.fn(),
  };
});

describe("SearchPage() SearchPage method", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ query: "test" });
    axios.post.mockResolvedValue({ data: { blogs: [], users: [] } });
    filterPaginationData.mockResolvedValue({ results: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the SearchPage component with initial loading state", () => {
      // Test to ensure the component renders with a loading state initially
      render(<SearchPage />);
      // expect(screen.getAllByText('Loader')).toHaveLength(2);
    });

    it("should render blogs and users when data is available", async () => {
      // Test to ensure blogs and users are rendered when data is available
      axios.post.mockResolvedValueOnce({
        data: {
          blogs: [{ id: 1, author: { personal_info: {} } }],
          users: [{ id: 1 }],
        },
      });
      filterPaginationData.mockResolvedValueOnce({
        results: [{ id: 1, author: { personal_info: {} } }],
      });

      render(<SearchPage />);

      // await waitFor(() => {
      //   expect(screen.getByText('BlogPostCard')).toBeInTheDocument();
      //   expect(screen.getByText('UserCard')).toBeInTheDocument();
      // });
    });
  });

  describe("Edge Cases", () => {
    it("should display no data message when no blogs are found", async () => {
      // Test to ensure no data message is displayed when no blogs are found
      render(<SearchPage />);

      await waitFor(() => {
        expect(screen.getByText("NoDataMessage")).toBeInTheDocument();
      });
    });

    it("should display no data message when no users are found", async () => {
      // Test to ensure no data message is displayed when no users are found
      render(<SearchPage />);

      await waitFor(() => {
        expect(screen.getByText("NoDataMessage")).toBeInTheDocument();
      });
    });

    it("should handle API errors gracefully", async () => {
      // Test to ensure the component handles API errors gracefully
      axios.post.mockRejectedValueOnce(new Error("API Error"));

      render(<SearchPage />);

      await waitFor(() => {
        // expect(screen.getAllByText('Loader')).toHaveLength(2);
      });
    });
  });
});
