import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest"; // Use vitest for testing
import Loader from "../loader.component";
import "@testing-library/jest-dom"; // Keeps the DOM matchers like toBeInTheDocument, etc.

describe("Loader() Loader method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the loader component correctly", () => {
      // Test to ensure the Loader component renders without crashing
      const { container } = render(<Loader />);
      expect(container).toBeInTheDocument();
    });

    it("should have a div with the correct class names", () => {
      // Test to ensure the div has the correct class names
      const { container } = render(<Loader />);
      const divElement = container.querySelector("div");
      expect(divElement).toHaveClass("w-12 mx-auto my-8");
    });

    it("should render an SVG element with the correct attributes", () => {
      // Test to ensure the SVG element is rendered with the correct attributes
      const { container } = render(<Loader />);
      const svgElement = container.querySelector("svg");
      expect(svgElement).toHaveAttribute("aria-hidden", "true");
      expect(svgElement).toHaveClass(
        "w-12 h-12 mr-2 text-white animate-spin fill-dark-grey"
      );
      expect(svgElement).toHaveAttribute("viewBox", "0 0 100 101");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should not render any text content", () => {
      // Test to ensure no text content is rendered
      const { container } = render(<Loader />);
      expect(container).not.toHaveTextContent();
    });

    it("should not render the commented span element", () => {
      // Test to ensure the commented span element is not rendered
      const { container } = render(<Loader />);
      const spanElement = container.querySelector("span");
      expect(spanElement).toBeNull();
    });
  });
});
