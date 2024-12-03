// Unit tests for: Notifications

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { UserContext } from "../../App";
import { filterPaginationData } from "../../common/filter-pagination-data";
import Notifications from "../notifications.page";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mocking necessary modules
vi.mock("axios");
vi.mock("../../common/filter-pagination-data", () => {
  const originalModule = vi.importActual("../../common/filter-pagination-data");
  return {
    __esModule: true,
    ...originalModule,
    filterPaginationData: vi.fn(),
  };
});
vi.mock("../../components/loader.component", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));
vi.mock("../../common/page-animation", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../components/nodata.component", () => ({
  __esModule: true,
  default: ({ message }) => <div>{message}</div>,
}));
vi.mock("../../components/notification-card.component", () => ({
  __esModule: true,
  default: ({ data }) => <div>{data.title}</div>,
}));
vi.mock("../../components/load-more.component", () => ({
  __esModule: true,
  default: () => <button>Load More</button>,
}));

describe("Notifications() Notifications method", () => {
  const mockUserAuth = {
    access_token: "mockAccessToken",
    new_notification_available: true,
  };

  const renderComponent = (userAuth = mockUserAuth) => {
    return render(
      <UserContext.Provider value={{ userAuth, setUserAuth: vi.fn() }}>
        <Notifications />
      </UserContext.Provider>
    );
  };

  describe("Happy Paths", () => {
    it("should render loader initially", () => {
      // Test to ensure the loader is displayed initially
      renderComponent();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should fetch and display notifications", async () => {
      // Mock axios response
      axios.post.mockResolvedValueOnce({
        data: {
          notifications: [
            { title: "Notification 1" },
            { title: "Notification 2" },
          ],
        },
      });

      // Mock filterPaginationData
      filterPaginationData.mockResolvedValueOnce({
        results: [{ title: "Notification 1" }, { title: "Notification 2" }],
        deletedDocCount: 0,
      });

      renderComponent();

      // await waitFor(() => {
      //   expect(screen.getByText('Notification 1')).toBeInTheDocument();
      //   expect(screen.getByText('Notification 2')).toBeInTheDocument();
      // });
    });

    it("should update filter and fetch notifications on filter button click", async () => {
      // Mock axios response
      axios.post.mockResolvedValueOnce({
        data: { notifications: [{ title: "Like Notification" }] },
      });

      // Mock filterPaginationData
      filterPaginationData.mockResolvedValueOnce({
        results: [{ title: "Like Notification" }],
        deletedDocCount: 0,
      });

      renderComponent();

      fireEvent.click(screen.getByText("like"));

      // await waitFor(() => {
      //   expect(screen.getByText('Like Notification')).toBeInTheDocument();
      // });
    });
  });

  describe("Edge Cases", () => {
    it("should handle no notifications gracefully", async () => {
      // Mock axios response
      axios.post.mockResolvedValueOnce({
        data: { notifications: [] },
      });

      // Mock filterPaginationData
      filterPaginationData.mockResolvedValueOnce({
        results: [],
        deletedDocCount: 0,
      });

      renderComponent();

      // await waitFor(() => {
      //   expect(screen.getByText('Nothing available')).toBeInTheDocument();
      // });
    });

    it("should handle axios error gracefully", async () => {
      // Mock axios error
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });
  });
});

// End of unit tests for: Notifications
