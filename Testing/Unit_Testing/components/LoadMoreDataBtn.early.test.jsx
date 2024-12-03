import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadMoreDataBtn from "./load-more.component.jsx";
import { vi } from "vitest"; // Use vi for mocking in Vitest

describe("LoadMoreDataBtn Component", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the button when there are more documents to load", () => {
      // Setup: Define state with more documents to load
      const state = { totalDocs: 10, results: [1, 2, 3], page: 1 };
      const fetchDataFun = vi.fn(); // Use vi.fn() for mock functions in Vitest
      const additionalParam = { someParam: "value" };

      // Render the component
      render(
        <LoadMoreDataBtn
          state={state}
          fetchDataFun={fetchDataFun}
          additionalParam={additionalParam}
        />
      );

      // Assert: Button is rendered
      const button = screen.getByRole("button", { name: /load more/i });
      expect(button).toBeInTheDocument();
    });

    it("should call fetchDataFun with correct parameters when button is clicked", () => {
      // Setup: Define state with more documents to load
      const state = { totalDocs: 10, results: [1, 2, 3], page: 1 };
      const fetchDataFun = vi.fn(); // Use vi.fn() for mock functions in Vitest
      const additionalParam = { someParam: "value" };

      // Render the component
      render(
        <LoadMoreDataBtn
          state={state}
          fetchDataFun={fetchDataFun}
          additionalParam={additionalParam}
        />
      );

      //   Act: Click the button
      const button = screen.getByRole("button", { name: /load more/i });
      fireEvent.click(button);

      //   Assert: fetchDataFun is called with correct parameters
      expect(fetchDataFun).toHaveBeenCalledWith({
        ...additionalParam,
        page: 2,
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should not render the button when state is null", () => {
      // Setup: Define null state
      const state = null;
      const fetchDataFun = vi.fn(); // Use vi.fn() for mock functions in Vitest
      const additionalParam = { someParam: "value" };

      // Render the component
      render(
        <LoadMoreDataBtn
          state={state}
          fetchDataFun={fetchDataFun}
          additionalParam={additionalParam}
        />
      );

      // Assert: Button is not rendered
      const button = screen.queryByRole("button", { name: /load more/i });
      expect(button).not.toBeInTheDocument();
    });

    it("should not render the button when all documents are already loaded", () => {
      // Setup: Define state with all documents loaded
      const state = { totalDocs: 3, results: [1, 2, 3], page: 1 };
      const fetchDataFun = vi.fn(); // Use vi.fn() for mock functions in Vitest
      const additionalParam = { someParam: "value" };

      // Render the component
      render(
        <LoadMoreDataBtn
          state={state}
          fetchDataFun={fetchDataFun}
          additionalParam={additionalParam}
        />
      );

      // Assert: Button is not rendered
      const button = screen.queryByRole("button", { name: /load more/i });
      expect(button).not.toBeInTheDocument();
    });

    it("should handle the case when state.totalDocs is undefined", () => {
      // Setup: Define state with undefined totalDocs
      const state = { totalDocs: undefined, results: [1, 2, 3], page: 1 };
      const fetchDataFun = vi.fn(); // Use vi.fn() for mock functions in Vitest
      const additionalParam = { someParam: "value" };

      // Render the component
      render(
        <LoadMoreDataBtn
          state={state}
          fetchDataFun={fetchDataFun}
          additionalParam={additionalParam}
        />
      );

      // Assert: Button is not rendered
      const button = screen.queryByRole("button", { name: /load more/i });
      expect(button).not.toBeInTheDocument();
    });
  });
});

//rcl
