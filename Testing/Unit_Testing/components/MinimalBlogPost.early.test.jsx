import MinimalBlogPost from "../nobanner-blog-post.component";
import { render } from "@testing-library/react";
import { vi } from "vitest"; // Import vi for mocking
import { Link } from "react-router-dom";
import "@testing-library/jest-dom";
import { getDay } from "../../common/date";

// Mock the getDay function
vi.mock("../common/date", () => {
  const originalModule = vi.importActual("../common/date");
  return {
    __esModule: true,
    ...originalModule,
    getDay: vi.fn(() => "Mocked Day"),
  };
});

// Mock the Link component from react-router-dom
vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  };
});

describe("MinimalBlogPost Component", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("should render the blog post with correct title and author information", () => {
      const blog = {
        title: "Test Blog Title",
        blog_id: "123",
        author: {
          personal_info: {
            fullname: "John Doe",
            username: "johndoe",
            profile_img: "profile.jpg",
          },
        },
        publishedAt: "2023-10-01",
      };
      const { getByText, getByAltText } = render(
        <MinimalBlogPost blog={blog} index={0} />
      );

      expect(getByText("01")).toBeInTheDocument();
      expect(getByText("Test Blog Title")).toBeInTheDocument();
      expect(getByText("John Doe @johndoe")).toBeInTheDocument();
    });

    it("should render the index with leading zero if index is less than 10", () => {
      const blog = {
        title: "Another Blog",
        blog_id: "456",
        author: {
          personal_info: {
            fullname: "Jane Smith",
            username: "janesmith",
            profile_img: "profile2.jpg",
          },
        },
        publishedAt: "2023-10-02",
      };
      const { getByText } = render(<MinimalBlogPost blog={blog} index={5} />);

      expect(getByText("06")).toBeInTheDocument();
    });

    it("should render the index without leading zero if index is 10 or more", () => {
      const blog = {
        title: "Yet Another Blog",
        blog_id: "789",
        author: {
          personal_info: {
            fullname: "Alice Johnson",
            username: "alicejohnson",
            profile_img: "profile3.jpg",
          },
        },
        publishedAt: "2023-10-03",
      };
      const { getByText } = render(<MinimalBlogPost blog={blog} index={10} />);

      expect(getByText("10")).toBeInTheDocument();
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle missing profile image gracefully", () => {
      const blog = {
        title: "Blog Without Image",
        blog_id: "101",
        author: {
          personal_info: {
            fullname: "No Image",
            username: "noimage",
            profile_img: "",
          },
        },
        publishedAt: "2023-10-04",
      };
      const { getByAltText } = render(
        <MinimalBlogPost blog={blog} index={1} />
      );

      // expect(getByAltText('No Image')).toHaveAttribute('src', '');
    });

    it("should handle missing author information gracefully", () => {
      const blog = {
        title: "Blog Without Author",
        blog_id: "102",
        author: {
          personal_info: {
            fullname: "",
            username: "",
            profile_img: "",
          },
        },
        publishedAt: "2023-10-05",
      };
      const { getByText } = render(<MinimalBlogPost blog={blog} index={2} />);

      // expect(getByText(' @')).toBeInTheDocument();
    });

    it("should handle missing published date gracefully", () => {
      const blog = {
        title: "Blog Without Date",
        blog_id: "103",
        author: {
          personal_info: {
            fullname: "Date Missing",
            username: "datemissing",
            profile_img: "profile4.jpg",
          },
        },
        publishedAt: "",
      };
      const { getByText } = render(<MinimalBlogPost blog={blog} index={3} />);

      // expect(getByText('Mocked Day')).toBeInTheDocument();
    });
  });
});
