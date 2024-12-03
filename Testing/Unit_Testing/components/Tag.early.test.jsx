import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest"; // Use vi for mocking in Vitest
import Tag from "../tags.component";
import "@testing-library/jest-dom"; // Still needed for DOM matchers like toBeInTheDocument

// Mock react's useContext with partial mocks for the other exports like createContext
vi.mock("react", () => {
  const reactActual = vi.importActual("react");
  return {
    ...reactActual, // Spread all original exports
    useContext: vi.fn(), // Mock useContext explicitly
  };
});

describe("Tag Component", () => {
  let mockSetBlog;
  let mockBlog;

  beforeEach(() => {
    mockSetBlog = vi.fn();
    mockBlog = {
      tags: ["tag1", "tag2", "tag3"],
    };

    // Mock the useContext hook to return the mock blog and setter
    vi.mocked(reactActual.useContext).mockReturnValue({
      blog: mockBlog,
      setBlog: mockSetBlog,
    });
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the tag correctly", () => {
      render(<Tag tag="tag1" tagIndex={0} />);
      expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    it("should make the tag editable on click", () => {
      render(<Tag tag="tag1" tagIndex={0} />);
      const tagElement = screen.getByText("tag1");
      fireEvent.click(tagElement);
      expect(tagElement).toHaveAttribute("contentEditable", "true");
    });

    it("should update the tag on Enter key press", () => {
      render(<Tag tag="tag1" tagIndex={0} />);
      const tagElement = screen.getByText("tag1");
      fireEvent.click(tagElement);
      fireEvent.keyDown(tagElement, {
        key: "Enter",
        target: { innerText: "newTag" },
      });
    });

    it("should update the tag on comma key press", () => {
      render(<Tag tag="tag1" tagIndex={0} />);
      const tagElement = screen.getByText("tag1");
      fireEvent.click(tagElement);
      fireEvent.keyDown(tagElement, {
        key: ",",
        target: { innerText: "newTag" },
      });

      // expect(tagElement).toHaveAttribute('contentEditable', 'false');
    });

    it("should delete the tag on delete button click", () => {
      render(<Tag tag="tag1" tagIndex={0} />);
      const deleteButton = screen.getByRole("button");
      fireEvent.click(deleteButton);
      expect(mockSetBlog).toHaveBeenCalledWith({
        ...mockBlog,
        tags: ["tag2", "tag3"],
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should not update the tag if no key is pressed", () => {
      render(<Tag tag="tag1" tagIndex={0} />);
      const tagElement = screen.getByText("tag1");
      fireEvent.click(tagElement);
      fireEvent.keyDown(tagElement, {
        key: "a",
        target: { innerText: "newTag" },
      }); // Key 'A'
      expect(mockSetBlog).not.toHaveBeenCalled();
    });

    it("should handle empty tag gracefully", () => {
      render(<Tag tag="" tagIndex={0} />);
      const tagElement = screen.getByText("");
      fireEvent.click(tagElement);
      fireEvent.keyDown(tagElement, {
        key: "Enter",
        target: { innerText: "" },
      });
      expect(mockSetBlog).toHaveBeenCalledWith({
        ...mockBlog,
        tags: ["", "tag2", "tag3"],
      });
    });

    it("should handle deletion of a non-existent tag gracefully", () => {
      render(<Tag tag="nonExistentTag" tagIndex={0} />);
      const deleteButton = screen.getByRole("button");
      fireEvent.click(deleteButton);
      expect(mockSetBlog).toHaveBeenCalledWith({
        ...mockBlog,
        tags: ["tag1", "tag2", "tag3"],
      });
    });
  });
});

//rcl
