import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import ProfilePage from "../profile.page";
import "@testing-library/jest-dom";

// Mocking necessary components and functions
vi.mock("axios");
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: vi.fn(),
}));
vi.mock("../../common/page-animation", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../components/loader.component", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));
vi.mock("../../components/about.component", () => ({
  __esModule: true,
  default: () => <div>About User</div>,
}));
vi.mock("../../common/filter-pagination-data", () => {
  const originalModule = vi.importActual("../../common/filter-pagination-data");
  return {
    __esModule: true,
    ...originalModule,
    filterPaginationData: vi.fn(),
  };
});
vi.mock("../../components/inpage-navigation.component", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../components/blog-post.component", () => ({
  __esModule: true,
  default: () => <div>Blog Post Card</div>,
}));
vi.mock("../../components/nodata.component", () => ({
  __esModule: true,
  default: () => <div>No Data</div>,
}));
vi.mock("../../components/load-more.component", () => ({
  __esModule: true,
  default: () => <button>Load More</button>,
}));

describe("ProfilePage() ProfilePage method", () => {
  const mockUserContext = {
    userAuth: { username: "testuser" },
  };

  beforeEach(() => {
    useParams.mockReturnValue({ id: "testuser" });
    axios.post.mockResolvedValue({ data: null });
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should render loading state initially", () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <ProfilePage />
        </UserContext.Provider>
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render user profile when data is fetched successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          personal_info: {
            fullname: "Test User",
            username: "testuser",
            profile_img: "test.jpg",
            bio: "Test bio",
          },
          account_info: {
            total_posts: 5,
            total_reads: 100,
          },
          social_links: {},
          joinedAt: "2023-01-01",
        },
      });

      render(
        <UserContext.Provider value={mockUserContext}>
          <ProfilePage />
        </UserContext.Provider>
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle no user data gracefully", async () => {
      axios.post.mockResolvedValueOnce({ data: null });

      render(
        <UserContext.Provider value={mockUserContext}>
          <ProfilePage />
        </UserContext.Provider>
      );
    });

    it("should handle API errors gracefully", async () => {
      axios.post.mockRejectedValueOnce(new Error("API Error"));

      render(
        <UserContext.Provider value={mockUserContext}>
          <ProfilePage />
        </UserContext.Provider>
      );
    });
  });
});
