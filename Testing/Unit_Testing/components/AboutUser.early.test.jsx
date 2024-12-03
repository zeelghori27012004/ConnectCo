import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { getFullDay } from "../../common/date";
import AboutUser from "../about.component";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router for testing
import "@testing-library/jest-dom";

// Mock the getFullDay function
vi.mock("../../common/date", () => {
  const originalModule = vi.importActual("../../common/date");
  return {
    __esModule: true,
    ...originalModule,
    getFullDay: vi.fn(),
  };
});

describe("AboutUser() AboutUser method", () => {
  beforeEach(() => {
    // Reset the mock before each test
    getFullDay.mockReset();
  });

  describe("Happy Paths", () => {
    it("should render the bio when provided", () => {
      const bio = "This is a sample bio";
      const { getByText } = render(
        <Router>
          {" "}
          {/* Wrap with Router */}
          <AboutUser bio={bio} social_links={{}} joinedAt={new Date()} />
        </Router>
      );
      expect(getByText(bio)).toBeInTheDocument();
    });

    it("should render social links with correct icons", () => {
      const social_links = {
        twitter: "https://twitter.com/user",
        facebook: "https://facebook.com/user",
        website: "https://userwebsite.com",
      };

      const { getByRole } = render(
        <Router>
          {" "}
          {/* Wrap with Router */}
          <AboutUser bio="" social_links={social_links} joinedAt={new Date()} />
        </Router>
      );
    });

    it("should display the joined date correctly", () => {
      const joinedAt = new Date("2023-01-01");
      getFullDay.mockReturnValue("January 1, 2023"); // Mock return value explicitly
      const { getByText } = render(
        <Router>
          {" "}
          {/* Wrap with Router */}
          <AboutUser bio="" social_links={{}} joinedAt={joinedAt} />
        </Router>
      );
      expect(getFullDay).toHaveBeenCalledWith(joinedAt); // Ensure the mock function is called
      expect(getByText("Joined on January 1, 2023")).toBeInTheDocument(); // Verify correct rendering
    });
  });

  describe("Edge Cases", () => {
    it("should display a default message when bio is empty", () => {
      const { getByText } = render(
        <Router>
          {" "}
          {/* Wrap with Router */}
          <AboutUser bio="" social_links={{}} joinedAt={new Date()} />
        </Router>
      );
      expect(getByText("Nothing to read here")).toBeInTheDocument();
    });

    it("should handle empty social links gracefully", () => {
      const { container } = render(
        <Router>
          {" "}
          {/* Wrap with Router */}
          <AboutUser bio="" social_links={{}} joinedAt={new Date()} />
        </Router>
      );
      expect(container.querySelectorAll("a")).toHaveLength(0);
    });

    it("should handle null joinedAt date gracefully", () => {
      getFullDay.mockReturnValue("Invalid Date");
      const { getByText } = render(
        <Router>
          {" "}
          {/* Wrap with Router */}
          <AboutUser bio="" social_links={{}} joinedAt={null} />
        </Router>
      );
      expect(getByText("Joined on Invalid Date")).toBeInTheDocument();
    });
  });
});
