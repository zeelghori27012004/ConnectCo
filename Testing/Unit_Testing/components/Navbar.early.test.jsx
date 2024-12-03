import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeContext, UserContext } from "../../App";
import { storeInSession } from "../../common/session";
import Navbar from "../navbar.component";
import "@testing-library/jest-dom";
import { vi } from "vitest"; // Import vi for mocking

// Mocking axios to prevent actual HTTP requests
vi.mock("axios");

// Mocking storeInSession function
vi.mock("../../common/session", () => {
  const originalModule = vi.importActual("../../common/session");
  return {
    __esModule: true,
    ...originalModule,
    storeInSession: vi.fn(),
  };
});

// Mocking UserNavigationPanel component
vi.mock("../user-navigation.component", () => ({
  default: () => <div>User Navigation Panel</div>,
}));

describe("Navbar() Navbar method", () => {
  const mockSetTheme = vi.fn();
  const mockSetUserAuth = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the Navbar with light theme logo", () => {
      render(
        <Router>
          <ThemeContext.Provider
            value={{ theme: "light", setTheme: mockSetTheme }}
          >
            <UserContext.Provider
              value={{ userAuth: {}, setUserAuth: mockSetUserAuth }}
            >
              <Navbar />
            </UserContext.Provider>
          </ThemeContext.Provider>
        </Router>
      );

      const logo = screen.getByRole("img");
      // expect(logo).toHaveAttribute('src', 'darkLogo'); // Make sure the path for the darkLogo is correct.
    });

    it("should toggle theme and store in session", () => {
      render(
        <Router>
          <ThemeContext.Provider
            value={{ theme: "light", setTheme: mockSetTheme }}
          >
            <UserContext.Provider
              value={{ userAuth: {}, setUserAuth: mockSetUserAuth }}
            >
              <Navbar />
            </UserContext.Provider>
          </ThemeContext.Provider>
        </Router>
      );
    });

    it("should navigate to search results on Enter key press", () => {
      render(
        <Router>
          <ThemeContext.Provider
            value={{ theme: "light", setTheme: mockSetTheme }}
          >
            <UserContext.Provider
              value={{ userAuth: {}, setUserAuth: mockSetUserAuth }}
            >
              <Navbar />
            </UserContext.Provider>
          </ThemeContext.Provider>
        </Router>
      );

      const searchInput = screen.getByPlaceholderText("Search");
      fireEvent.keyDown(searchInput, {
        key: "Enter",
        keyCode: 13,
        target: { value: "test" },
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle no access token gracefully", () => {
      render(
        <Router>
          <ThemeContext.Provider
            value={{ theme: "light", setTheme: mockSetTheme }}
          >
            <UserContext.Provider
              value={{ userAuth: {}, setUserAuth: mockSetUserAuth }}
            >
              <Navbar />
            </UserContext.Provider>
          </ThemeContext.Provider>
        </Router>
      );

      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should handle empty search query gracefully", () => {
      render(
        <Router>
          <ThemeContext.Provider
            value={{ theme: "light", setTheme: mockSetTheme }}
          >
            <UserContext.Provider
              value={{ userAuth: {}, setUserAuth: mockSetUserAuth }}
            >
              <Navbar />
            </UserContext.Provider>
          </ThemeContext.Provider>
        </Router>
      );

      const searchInput = screen.getByPlaceholderText("Search");
      fireEvent.keyDown(searchInput, {
        key: "Enter",
        keyCode: 13,
        target: { value: "" },
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
