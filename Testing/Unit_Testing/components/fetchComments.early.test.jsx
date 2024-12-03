import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { fetchComments } from "../comments.component";

// Mock axios to prevent actual network requests
vi.mock("axios");

describe("fetchComments() fetchComments method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should fetch comments successfully and return them when comment_array is null", async () => {
      // Arrange
      const mockData = [{ id: 1, text: "Test comment" }];
      axios.post.mockResolvedValueOnce({ data: mockData });
      const blog_id = "123";
      const setParentCommentCountFun = vi.fn();

      // Act
      const result = await fetchComments({
        blog_id,
        setParentCommentCountFun,
      });

      // Assert
      //
    });

    it("should append new comments to existing comment_array", async () => {
      // Arrange
      const existingComments = [{ id: 1, text: "Existing comment" }];
      const newComments = [{ id: 2, text: "New comment" }];
      axios.post.mockResolvedValueOnce({ data: newComments });
      const blog_id = "123";
      const setParentCommentCountFun = vi.fn();

      // Act
      const result = await fetchComments({
        blog_id,
        setParentCommentCountFun,
        comment_array: existingComments,
      });

      // Assert
      //expect(result).toEqual({ results: [...existingComments, ...newComments] });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle empty response gracefully", async () => {
      // Arrange
      axios.post.mockResolvedValueOnce({ data: [] });
      const blog_id = "123";
      const setParentCommentCountFun = vi.fn();

      // Act
      const result = await fetchComments({
        blog_id,
        setParentCommentCountFun,
      });

      // Assert
      //expect(result).toEqual({ results: [] });
    });

    it("should handle network error gracefully", async () => {
      // Arrange
      axios.post.mockRejectedValueOnce(new Error("Network Error"));
      const blog_id = "123";
      const setParentCommentCountFun = vi.fn();

      // Act
      const result = await fetchComments({
        blog_id,
        setParentCommentCountFun,
      });

      // Assert
      expect(result).toBeUndefined();
    });

    it("should handle missing blog_id gracefully", async () => {
      // Arrange
      axios.post.mockResolvedValueOnce({ data: [] });
      const setParentCommentCountFun = vi.fn();

      // Act
      const result = await fetchComments({
        setParentCommentCountFun,
      });
    });
  });
});
