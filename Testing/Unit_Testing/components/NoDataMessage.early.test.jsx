import NoDataMessage from "../nodata.component";
import { render } from "@testing-library/react";
import { vi } from "vitest"; // Import vi for mocking if needed
import "@testing-library/jest-dom";

describe("NoDataMessage() NoDataMessage method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the message passed as a prop", () => {
      // Test to ensure the component renders the message correctly
      const message = "No data available";
      const { getByText } = render(<NoDataMessage message={message} />);
      expect(getByText(message)).toBeInTheDocument();
    });

    it("should apply the correct styles to the container", () => {
      // Test to ensure the component has the correct styles
      const message = "No data available";
      const { container } = render(<NoDataMessage message={message} />);
      const divElement = container.firstChild;
      expect(divElement).toHaveClass(
        "text-center w-full p-4 rounded-full bg-grey/50 mt-4"
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should render without crashing when message is an empty string", () => {
      // Test to ensure the component handles an empty string gracefully
      const message = "";
      const { container } = render(<NoDataMessage message={message} />);
      expect(container).toBeInTheDocument();
    });

    it("should render without crashing when message is undefined", () => {
      // Test to ensure the component handles undefined message gracefully
      const { container } = render(<NoDataMessage />);
      expect(container).toBeInTheDocument();
    });

    it("should render without crashing when message is null", () => {
      // Test to ensure the component handles null message gracefully
      const message = null;
      const { container } = render(<NoDataMessage message={message} />);
      expect(container).toBeInTheDocument();
    });

    it("should render special characters in the message", () => {
      // Test to ensure the component can render special characters
      const message = "!@#$%^&*()_+";
      const { getByText } = render(<NoDataMessage message={message} />);
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});

// End of unit tests for: NoDataMessage
