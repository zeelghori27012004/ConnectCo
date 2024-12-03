import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogContent from "./../blog-content.component";
import { describe, it, expect } from "vitest";

describe("BlogContent Component", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("renders a paragraph block correctly", () => {
      const block = {
        type: "paragraph",
        data: { text: "This is a paragraph." },
      };
      const { container } = render(<BlogContent block={block} />);
      expect(container.querySelector("p")).toHaveTextContent(
        "This is a paragraph."
      );
    });

    it("renders a header block with level 2 correctly", () => {
      const block = {
        type: "header",
        data: { level: 2, text: "Header Level 2" },
      };
      const { container } = render(<BlogContent block={block} />);
      expect(container.querySelector("h2")).toHaveTextContent("Header Level 2");
    });

    it("renders a header block with level 3 correctly", () => {
      const block = {
        type: "header",
        data: { level: 3, text: "Header Level 3" },
      };
      const { container } = render(<BlogContent block={block} />);
      expect(container.querySelector("h3")).toHaveTextContent("Header Level 3");
    });

    it("renders an image block correctly", () => {
      const block = {
        type: "image",
        data: { file: { url: "image.jpg" }, caption: "An image" },
      };
      const { getByAltText, getByText } = render(<BlogContent block={block} />);
      expect(getByAltText("")).toHaveAttribute("src", "image.jpg");
      expect(getByText("An image")).toBeInTheDocument();
    });

    it("renders a quote block correctly", () => {
      const block = {
        type: "quote",
        data: { text: "A quote", caption: "Author" },
      };
      const { getByText } = render(<BlogContent block={block} />);
      expect(getByText("A quote")).toBeInTheDocument();
      expect(getByText("Author")).toBeInTheDocument();
    });

    it("renders an ordered list block correctly", () => {
      const block = {
        type: "list",
        data: { style: "ordered", items: ["Item 1", "Item 2"] },
      };
      const { container } = render(<BlogContent block={block} />);
      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent("Item 1");
      expect(listItems[1]).toHaveTextContent("Item 2");
    });

    it("renders an unordered list block correctly", () => {
      const block = {
        type: "list",
        data: { style: "unordered", items: ["Item A", "Item B"] },
      };
      const { container } = render(<BlogContent block={block} />);
      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent("Item A");
      expect(listItems[1]).toHaveTextContent("Item B");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("renders an empty caption for an image block", () => {
      const block = {
        type: "image",
        data: { file: { url: "image.jpg" }, caption: "" },
      };
      const { getByAltText, queryByText } = render(
        <BlogContent block={block} />
      );
      expect(getByAltText("")).toHaveAttribute("src", "image.jpg");
      expect(queryByText("")).not.toBeInTheDocument();
    });

    it("renders an empty caption for a quote block", () => {
      const block = { type: "quote", data: { text: "A quote", caption: "" } };
      const { getByText, queryByText } = render(<BlogContent block={block} />);
      expect(getByText("A quote")).toBeInTheDocument();
      expect(queryByText("")).not.toBeInTheDocument();
    });

    it("handles an empty list block gracefully", () => {
      const block = { type: "list", data: { style: "ordered", items: [] } };
      const { container } = render(<BlogContent block={block} />);
      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(0);
    });

    it("handles an unknown block type gracefully", () => {
      const block = { type: "unknown", data: { text: "Unknown block type" } };
      const { container } = render(<BlogContent block={block} />);
      expect(container.firstChild).toBeNull();
    });
  });
});

//rcl
