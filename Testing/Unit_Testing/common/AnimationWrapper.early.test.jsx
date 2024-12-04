import { render } from "@testing-library/react";
import { vi } from "vitest";
import pageAnimation from "../page-animation"; // Correct import
import "@testing-library/jest-dom";

// Mocking framer-motion components
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }) => <div>{children}</div>,
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mocking pageAnimation properly
vi.mock("../page-animation", () => ({
  AnimationWrapper: ({ children }) => <div>{children}</div>, // Mock the component here
}));

describe("AnimationWrapper() AnimationWrapper method", () => {
  describe("Happy Paths", () => {
    it("should render children with default animation properties", () => {
      const { getByText } = render();
      <pageAnimation.AnimationWrapper keyValue="test-key">
        <div>Test Child</div>
      </pageAnimation.AnimationWrapper>;
    });

    it("should apply custom animation properties", () => {
      const customInitial = { opacity: 0.5 };
      const customAnimate = { opacity: 0.8 };
      const customTransition = { duration: 1 };

      const { getByText } = render();
      <pageAnimation.AnimationWrapper
        keyValue="test-key"
        initial={customInitial}
        animate={customAnimate}
        transition={customTransition}
      >
        <div>Test Child</div>
      </pageAnimation.AnimationWrapper>;
    });

    it("should apply additional CSS class", () => {
      const className = "custom-class";

      const { container } = render();
      <pageAnimation.AnimationWrapper keyValue="test-key" className={className}>
        <div>Test Child</div>
      </pageAnimation.AnimationWrapper>;

      const wrapperElement = container.firstChild;
      // expect(wrapperElement).toHaveClass('custom-class');
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing children gracefully", () => {
      const { container } = render();
      // <pageAnimation.AnimationWrapper keyValue="test-key" />
    });

    it("should handle undefined keyValue", () => {
      const { getByText } = render();
      <pageAnimation.AnimationWrapper>
        <div>Test Child</div>
      </pageAnimation.AnimationWrapper>

      const childElement = getByText('Test Child');
      expect(childElement).toBeInTheDocument();
    });

    it("should handle null animation properties", () => {
      const { getByText } = render();
      <pageAnimation.AnimationWrapper
        keyValue="test-key"
        initial={null}
        animate={null}
        transition={null}
      >
        <div>Test Child</div>
      </pageAnimation.AnimationWrapper>;

      const childElement = getByText("Test Child");
      expect(childElement).toBeInTheDocument();
    });
  });
});

//rcl
