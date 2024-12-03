import { fireEvent, render } from "@testing-library/react";
import InPageNavigation from "../inpage-navigation.component";
import "@testing-library/jest-dom"; // For assertions like toBeInTheDocument and toHaveClass
import { vi } from "vitest"; // Import vi for mocking and other test utilities

describe("InPageNavigation() InPageNavigation method", () => {
  // Happy Path Tests
  describe("Happy Path Tests", () => {
    test("should render navigation buttons based on routes", () => {
      const routes = ["Home", "About", "Contact"];
      const { getByText } = render(<InPageNavigation routes={routes} />);

      routes.forEach((route) => {
        expect(getByText(route)).toBeInTheDocument();
      });
    });

    test("should set the default active tab on initial render", () => {
      const routes = ["Home", "About", "Contact"];
      const defaultActiveIndex = 1;
      const { getByText } = render(
        <InPageNavigation
          routes={routes}
          defaultActiveIndex={defaultActiveIndex}
        />
      );

      const activeButton = getByText(routes[defaultActiveIndex]);
      expect(activeButton).toHaveClass("text-black");
    });

    test("should change active tab on button click", () => {
      const routes = ["Home", "About", "Contact"];
      const { getByText } = render(<InPageNavigation routes={routes} />);

      const aboutButton = getByText("About");
      fireEvent.click(aboutButton);

      expect(aboutButton).toHaveClass("text-black");
    });

    test("should render children corresponding to the active tab", () => {
      const routes = ["Home", "About", "Contact"];
      const children = [
        <div key="home">Home Content</div>,
        <div key="about">About Content</div>,
        <div key="contact">Contact Content</div>,
      ];
      const { getByText } = render(
        <InPageNavigation routes={routes} children={children} />
      );

      const homeButton = getByText("Home");
      fireEvent.click(homeButton);

      expect(getByText("Home Content")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Case Tests", () => {
    test("should handle empty routes array gracefully", () => {
      const { container } = render(<InPageNavigation routes={[]} />);
    });

    test("should handle non-array children gracefully", () => {
      const routes = ["Home"];
      const { getByText } = render(
        <InPageNavigation routes={routes} children={<div>Single Child</div>} />
      );

      expect(getByText("Single Child")).toBeInTheDocument();
    });

    test("should not break when defaultActiveIndex is out of bounds", () => {
      const routes = ["Home", "About", "Contact"];
      const { getByText } = render(
        <InPageNavigation routes={routes} defaultActiveIndex={5} />
      );

      const homeButton = getByText("Home");
    });

    test("should handle window resize event", () => {
      const routes = ["Home", "About", "Contact"];
      const { getByText } = render(<InPageNavigation routes={routes} />);

      const homeButton = getByText("Home");
      fireEvent.click(homeButton);

      global.innerWidth = 800;
      global.dispatchEvent(new Event("resize"));

      expect(homeButton).toHaveClass("text-black");
    });
  });
});
