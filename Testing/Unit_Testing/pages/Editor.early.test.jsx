import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../../App";
import Editor, { EditorContext } from "../editor.pages";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

// Mock components
vi.mock("../../components/blog-editor.component", () => ({
  default: () => <div>BlogEditor Component</div>,
}));
vi.mock("../../components/publish-form.component", () => ({
  default: () => <div>PublishForm Component</div>,
}));
vi.mock("../../components/loader.component", () => ({
  default: () => <div>Loader Component</div>,
}));

// Mock axios
vi.mock("axios");

describe("Editor() Editor method", () => {
  const mockUserContextValue = {
    userAuth: { access_token: "mockAccessToken" },
  };

  const renderEditor = (blogId) => {
    return render(
      <UserContext.Provider value={mockUserContextValue}>
        <BrowserRouter>
          <Editor blogId={blogId} />
        </BrowserRouter>
      </UserContext.Provider>
    );
  };

  describe("Happy Paths", () => {
    it("should render BlogEditor when editorState is 'editor' and loading is false", async () => {
      axios.post.mockResolvedValueOnce({
        data: { blog: { title: "Test Blog", content: [] } },
      });

      renderEditor("123");

      await waitFor(() =>
        expect(screen.getByText("BlogEditor Component")).toBeInTheDocument()
      );
    });

    it("should render PublishForm when editorState is not 'editor'", async () => {
      // Simulating the blog post request
      axios.post.mockResolvedValueOnce({
        data: { blog: { title: "Test Blog", content: [] } },
      });

      renderEditor("123");
    });

    it("should render Loader when loading is true", () => {
      axios.post.mockImplementationOnce(() => new Promise(() => {})); // Simulate loading

      renderEditor("123");
    });
  });

  describe("Edge Cases", () => {
    it("should navigate to /signin if access_token is null", () => {
      const mockUserContextValueWithNullToken = {
        userAuth: { access_token: null },
      };

      render(
        <UserContext.Provider value={mockUserContextValueWithNullToken}>
          <BrowserRouter>
            <Editor />
          </BrowserRouter>
        </UserContext.Provider>
      );

      expect(
        screen.queryByText("BlogEditor Component")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("PublishForm Component")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Loader Component")).not.toBeInTheDocument();
    });

    it("should handle axios error gracefully and set blog to null", async () => {
      // Simulate an axios rejection to mimic the error
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      renderEditor("123");
    });

    it("should handle missing blog_id by setting loading to false", () => {
      renderEditor();

      expect(screen.queryByText("Loader Component")).not.toBeInTheDocument();
    });
  });
});
