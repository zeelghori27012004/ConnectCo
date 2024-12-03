import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserCard from "../usercard.component";
import { describe, it, expect } from "vitest"; // Import Vitest functions
import "@testing-library/jest-dom"; // Keeps DOM matchers like toBeInTheDocument, toHaveAttribute, etc.

describe("UserCard Component", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the user's full name, username, and profile image correctly", () => {
      // Arrange: Set up the user data
      const user = {
        personal_info: {
          fullname: "John Doe",
          username: "johndoe",
          profile_img: "http://example.com/profile.jpg",
        },
      };

      // Act: Render the component
      const { getByText, getByRole } = render(
        <Router>
          <UserCard user={user} />
        </Router>
      );

      // Assert: Check if the elements are rendered correctly
      expect(getByText("John Doe")).toBeInTheDocument();
      expect(getByText("@johndoe")).toBeInTheDocument();
      const img = getByRole("img");
      expect(img).toHaveAttribute("src", "http://example.com/profile.jpg");
    });

    it("should link to the correct user profile page", () => {
      // Arrange: Set up the user data
      const user = {
        personal_info: {
          fullname: "Jane Smith",
          username: "janesmith",
          profile_img: "http://example.com/jane.jpg",
        },
      };

      // Act: Render the component
      const { getByRole } = render(
        <Router>
          <UserCard user={user} />
        </Router>
      );

      // Assert: Check if the link is correct
      const link = getByRole("link");
      expect(link).toHaveAttribute("href", "/user/janesmith");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing profile image gracefully", () => {
      // Arrange: Set up the user data with missing profile image
      const user = {
        personal_info: {
          fullname: "No Image User",
          username: "noimageuser",
          profile_img: "",
        },
      };

      // Act: Render the component
      const { getByRole } = render(
        <Router>
          <UserCard user={user} />
        </Router>
      );

      // Assert: Check if the image src is empty
      const img = getByRole("img");
      expect(img).toHaveAttribute("src", "");
    });

    it("should handle missing username gracefully", () => {
      // Arrange: Set up the user data with missing username
      const user = {
        personal_info: {
          fullname: "No Username",
          username: "",
          profile_img: "http://example.com/no-username.jpg",
        },
      };

      // Act: Render the component
      const { getByText } = render(
        <Router>
          <UserCard user={user} />
        </Router>
      );

      // Assert: Check if the username is displayed as '@'
      expect(getByText("@")).toBeInTheDocument();
    });

    it("should handle missing fullname gracefully", () => {
      // Arrange: Set up the user data with missing fullname
      const user = {
        personal_info: {
          fullname: "",
          username: "nofullname",
          profile_img: "http://example.com/no-fullname.jpg",
        },
      };

      // Act: Render the component
      const { getByText } = render(
        <Router>
          <UserCard user={user} />
        </Router>
      );

      // Assert: Check if the fullname is not rendered
      expect(getByText("@nofullname")).toBeInTheDocument();
    });
  });
});
