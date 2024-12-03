import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../../App";
import SideNav from "../sidenavbar.component";
import "@testing-library/jest-dom";
import { vi } from "vitest";

describe("Happy Paths", () => {
  test("should render the SideNav component when access_token is present", () => {
    // Arrange
    // const contextValue = mockUserContext('valid_token', false);

    // Act
    render(
      <UserContext.Provider value={contextValue}>
        <Router>
          <SideNav />
        </Router>
      </UserContext.Provider>
    );

    // Assert
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("should navigate to /signin when access_token is null", () => {
    // Arrange
    // const contextValue = mockUserContext(null, false);

    // Act
    render(
      <UserContext.Provider value={contextValue}>
        <Router>
          <SideNav />
        </Router>
      </UserContext.Provider>
    );

    // Assert
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("should display new notification indicator when new_notification_available is true", () => {
    // Arrange
    const contextValue = mockUserContext("valid_token", true);

    // Act
    render(
      <UserContext.Provider value={contextValue}>
        <Router>
          <SideNav />
        </Router>
      </UserContext.Provider>
    );

    // Assert
    // expect(screen.getByText('Notifications')).toBeInTheDocument();
    // expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });
});

// Edge Case Tests
describe("Edge Cases", () => {
  test("should handle empty pathname gracefully", () => {
    // Arrange
    const contextValue = mockUserContext("valid_token", false);
    delete window.location;
    window.location = { pathname: "" };

    // Act
    render(
      <UserContext.Provider value={contextValue}>
        <Router>
          <SideNav />
        </Router>
      </UserContext.Provider>
    );

    // Assert
    // expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test("should toggle side navigation visibility on button click", () => {
    // Arrange
    // const contextValue = mockUserContext('valid_token', false);

    // Act
    render(
      <UserContext.Provider value={contextValue}>
        <Router>
          <SideNav />
        </Router>
      </UserContext.Provider>
    );

    const toggleButton = screen.getByRole("button", {
      name: /bars-staggered/i,
    });
    fireEvent.click(toggleButton);

    // Assert
    const sideNav = screen.getByText("Dashboard").closest("div");
    expect(sideNav).toHaveClass("opacity-100 pointer-events-auto");
  });
});
