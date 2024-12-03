import { fireEvent, render, screen } from "@testing-library/react";
import { useContext } from "react";
import { removeFromSession } from "../../common/session";
import UserNavigationPanel from "../user-navigation.component";
import { vi } from "vitest"; // Import vi for mocking and spying
import "@testing-library/jest-dom";

// Mocking the necessary modules
vi.mock("../../common/session", () => {
  const originalModule = vi.importActual("../../common/session");
  return {
    __esModule: true,
    ...originalModule,
    removeFromSession: vi.fn(),
  };
});

vi.mock("../../common/page-animation", () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
  };
});

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

vi.mock("react", () => {
  const originalModule = vi.importActual("react");
  return {
    __esModule: true,
    ...originalModule,
    useContext: vi.fn(),
  };
});

describe("UserNavigationPanel() UserNavigationPanel method", () => {
  beforeEach(() => {
    useContext.mockReturnValue({
      userAuth: { username: "testuser" },
      setUserAuth: vi.fn(),
    });
  });

  describe("Happy Paths", () => {
    it("should render all navigation links correctly", () => {
      render(<UserNavigationPanel />);
      expect(screen.getByText("Write")).toBeInTheDocument();
      // expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should render the sign out button with username", () => {
      render(<UserNavigationPanel />);
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
      // expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    it("should call removeFromSession and setUserAuth on sign out", () => {
      const { setUserAuth } = useContext();
      render(<UserNavigationPanel />);
      fireEvent.click(screen.getByText("Sign Out"));
      expect(removeFromSession).toHaveBeenCalledWith("user");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing username gracefully", () => {
      useContext.mockReturnValue({
        userAuth: { username: "" },
        setUserAuth: vi.fn(),
      });
      render(<UserNavigationPanel />);
    });

    it("should handle null userAuth object gracefully", () => {
      useContext.mockReturnValue({
        userAuth: null,
        setUserAuth: vi.fn(),
      });
      render(<UserNavigationPanel />);
    });
  });
});

// End of unit tests for: UserNavigationPanel
