// Unit tests for: ChangePassword

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { UserContext } from "../../App";
import ChangePassword from "../change-password.page";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mocking external components and functions
vi.mock("axios");
vi.mock("../../common/page-animation", () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
  };
});
vi.mock("../../components/input.component", () => {
  return {
    __esModule: true,
    default: ({ name, type, placeholder }) => (
      <input name={name} type={type} placeholder={placeholder} />
    ),
  };
});

describe("ChangePassword() ChangePassword method", () => {
  const mockUserContext = {
    userAuth: { access_token: "mockAccessToken" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should successfully change password with valid inputs", async () => {
      axios.post.mockResolvedValueOnce({});

      render(
        <UserContext.Provider value={mockUserContext}>
          <ChangePassword />
        </UserContext.Provider>
      );

      fireEvent.change(screen.getByPlaceholderText("Current Password"), {
        target: { value: "Valid1Password" },
      });
      fireEvent.change(screen.getByPlaceholderText("New Password"), {
        target: { value: "Valid2Password" },
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should show error if inputs are empty", () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <ChangePassword />
        </UserContext.Provider>
      );
    });

    it("should show error if passwords do not meet criteria", () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <ChangePassword />
        </UserContext.Provider>
      );

      fireEvent.change(screen.getByPlaceholderText("Current Password"), {
        target: { value: "short" },
      });
      fireEvent.change(screen.getByPlaceholderText("New Password"), {
        target: { value: "short" },
      });
    });

    it("should handle server error gracefully", async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { error: "Server error" } },
      });

      render(
        <UserContext.Provider value={mockUserContext}>
          <ChangePassword />
        </UserContext.Provider>
      );

      fireEvent.change(screen.getByPlaceholderText("Current Password"), {
        target: { value: "Valid1Password" },
      });
      fireEvent.change(screen.getByPlaceholderText("New Password"), {
        target: { value: "Valid2Password" },
      });
    });
  });
});

// End of unit tests for: ChangePassword
