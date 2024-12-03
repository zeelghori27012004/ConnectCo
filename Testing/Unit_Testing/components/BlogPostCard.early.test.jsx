import { render } from "@testing-library/react";
import BlogPostCard from "../blog-post.component";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for routing context
import { vi } from "vitest"; // Import vi for mocking

// Mock the getDay function using vitest mock API
vi.mock("../../common/date", () => {
  return {
    __esModule: true,
    getDay: vi.fn(() => "Mocked Day"),
  };
});

describe("BlogPostCard() BlogPostCard method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the BlogPostCard with all provided data", () => {
      const content = {
        publishedAt: "2023-10-01",
        tags: ["Technology"],
        title: "Understanding React",
        des: "A comprehensive guide to React.js",
        banner: "banner-url",
        activity: { total_likes: 100 },
        blog_id: "123",
      };
      const author = {
        fullname: "John Doe",
        profile_img: "profile-url",
        username: "johndoe",
      };

      // Wrap the component in the BrowserRouter context
      const { getByText, getByAltText } = render(
        <BrowserRouter>
          <BlogPostCard content={content} author={author} />
        </BrowserRouter>
      );

      expect(getByText("John Doe @johndoe")).toBeInTheDocument();
      expect(getByText("Mocked Day")).toBeInTheDocument();
      expect(getByText("Understanding React")).toBeInTheDocument();
      expect(
        getByText("A comprehensive guide to React.js")
      ).toBeInTheDocument();
      expect(getByText("Technology")).toBeInTheDocument();
      expect(getByText("100")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing tags gracefully", () => {
      const content = {
        publishedAt: "2023-10-01",
        tags: [],
        title: "Understanding React",
        des: "A comprehensive guide to React.js",
        banner: "banner-url",
        activity: { total_likes: 100 },
        blog_id: "123",
      };
      const author = {
        fullname: "John Doe",
        profile_img: "profile-url",
        username: "johndoe",
      };

      const { queryByText } = render(
        <BrowserRouter>
          <BlogPostCard content={content} author={author} />
        </BrowserRouter>
      );

      // Ensure that the tag is not rendered
      expect(queryByText("Technology")).not.toBeInTheDocument();
    });

    it("should handle missing description gracefully", () => {
      const content = {
        publishedAt: "2023-10-01",
        tags: ["Technology"],
        title: "Understanding React",
        des: "",
        banner: "banner-url",
        activity: { total_likes: 100 },
        blog_id: "123",
      };
      const author = {
        fullname: "John Doe",
        profile_img: "profile-url",
        username: "johndoe",
      };

      const { queryByText } = render(
        <BrowserRouter>
          <BlogPostCard content={content} author={author} />
        </BrowserRouter>
      );

      // Ensure that the description is not rendered
      expect(
        queryByText("A comprehensive guide to React.js")
      ).not.toBeInTheDocument();
    });

    it("should handle missing author information gracefully", () => {
      const content = {
        publishedAt: "2023-10-01",
        tags: ["Technology"],
        title: "Understanding React",
        des: "A comprehensive guide to React.js",
        banner: "banner-url",
        activity: { total_likes: 100 },
        blog_id: "123",
      };
      const author = {
        fullname: "",
        profile_img: "",
        username: "",
      };

      const { queryByText, queryByAltText } = render(
        <BrowserRouter>
          <BlogPostCard content={content} author={author} />
        </BrowserRouter>
      );

      // Ensure that the author information is not rendered
      expect(queryByText(" @")).not.toBeInTheDocument();
      expect(queryByAltText("profile-url")).not.toBeInTheDocument();
    });
  });
});
