import axios from "axios";
import { filterPaginationData } from "../filter-pagination-data";
import { describe, it, expect, vi, beforeEach } from "vitest"; // Import Vitest functions

// Mock axios using Vitest
vi.mock("axios");

describe("filterPaginationData() method", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should append data to existing state when create_new_arr is false", async () => {
      const state = { results: [{ id: 1 }], page: 1 };
      const data = [{ id: 2 }];
      const page = 2;

      const result = await filterPaginationData({
        create_new_arr: false,
        state,
        data,
        page,
      });

      expect(result).toEqual({
        results: [{ id: 1 }, { id: 2 }],
        page: 2,
      });
    });

    it("should create a new array and fetch totalDocs when create_new_arr is true", async () => {
      const data = [{ id: 1 }];
      const countRoute = "/count";
      const totalDocs = 10;

      axios.post.mockResolvedValueOnce({ data: { totalDocs } });

      const result = await filterPaginationData({
        create_new_arr: true,
        data,
        countRoute,
      });

      expect(result).toEqual({
        results: data,
        page: 1,
        totalDocs,
      });
    });

    it("should include Authorization header when user is provided", async () => {
      const data = [{ id: 1 }];
      const countRoute = "/count";
      const totalDocs = 10;
      const user = "test-token";

      axios.post.mockResolvedValueOnce({ data: { totalDocs } });

      await filterPaginationData({
        create_new_arr: true,
        data,
        countRoute,
        user,
      });

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${user}`,
          },
        })
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle null state gracefully", async () => {
      const data = [{ id: 1 }];
      const countRoute = "/count";
      const totalDocs = 5;

      axios.post.mockResolvedValueOnce({ data: { totalDocs } });

      const result = await filterPaginationData({
        create_new_arr: true,
        state: null,
        data,
        countRoute,
      });

      expect(result).toEqual({
        results: data,
        page: 1,
        totalDocs,
      });
    });

    it("should handle empty data array", async () => {
      const state = { results: [{ id: 1 }], page: 1 };
      const data = [];
      const page = 2;

      const result = await filterPaginationData({
        create_new_arr: false,
        state,
        data,
        page,
      });

      expect(result).toEqual({
        results: [{ id: 1 }],
        page: 2,
      });
    });

    it("should handle axios post failure gracefully", async () => {
      const data = [{ id: 1 }];
      const countRoute = "/count";

      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      const result = await filterPaginationData({
        create_new_arr: true,
        data,
        countRoute,
      });

      expect(result).toBeUndefined();
    });
  });
});
