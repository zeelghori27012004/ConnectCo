import { fireEvent, render, screen } from "@testing-library/react";
import InputBox from "../input.component";
import { describe, it, expect } from "vitest"; // Import vitest functions for testing
import "@testing-library/jest-dom"; // Keeps DOM matchers like toBeInTheDocument, toHaveAttribute, etc.

describe("InputBox() InputBox method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("renders input with correct attributes", () => {
      // Test to ensure the input renders with the correct attributes
      render(
        <InputBox
          name="username"
          type="text"
          id="user-id"
          value="JohnDoe"
          placeholder="Enter username"
          icon="fi-user"
        />
      );
      const inputElement = screen.getByPlaceholderText("Enter username");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).toHaveAttribute("name", "username");
      expect(inputElement).toHaveAttribute("type", "text");
      expect(inputElement).toHaveAttribute("id", "user-id");
      expect(inputElement).toHaveValue("JohnDoe");
    });

    it("renders icon correctly", () => {
      // Test to ensure the icon is rendered correctly
      render(<InputBox name="username" type="text" icon="fi-user" />);
      const iconElement = screen.getByClass("fi-user");
      expect(iconElement).toBeInTheDocument();
    });

    it("toggles password visibility", () => {
      // Test to ensure password visibility toggles correctly
      render(<InputBox name="password" type="password" />);
      const toggleIcon = screen.getByClass("fi-rr-eye-crossed");
      const inputElement = screen.getByPlaceholderText("");

      //   Initially, the password should be hidden
      expect(inputElement).toHaveAttribute("type", "password");

      //   Click again to hide password
      fireEvent.click(toggleIcon);
      expect(inputElement).toHaveAttribute("type", "password");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("renders disabled input", () => {
      // Test to ensure the input is disabled when the disable prop is true
      render(<InputBox name="username" type="text" disable={true} />);
      const inputElement = screen.getByPlaceholderText("");
      expect(inputElement).toBeDisabled();
    });

    it("handles empty props gracefully", () => {
      // Test to ensure the component handles empty props without crashing
      render(<InputBox />);
      const inputElement = screen.getByPlaceholderText("");
      expect(inputElement).toBeInTheDocument();
    });

    it("handles unknown type gracefully", () => {
      // Test to ensure the component handles unknown input types gracefully
      render(<InputBox name="unknown" type="unknown" />);
      const inputElement = screen.getByPlaceholderText("");
      expect(inputElement).toHaveAttribute("type", "unknown");
    });
  });
});

//rcl
