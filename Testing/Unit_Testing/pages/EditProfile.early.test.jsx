// Unit tests for: EditProfile

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { UserContext } from "../../App";
import { uploadImage } from "../../common/aws";
import { storeInSession } from "../../common/session";
import EditProfile from "../edit-profile.page";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mocking necessary modules
vi.mock("axios");
vi.mock("../../common/aws", () => {
  const originalModule = vi.importActual("../../common/aws");
  return {
    __esModule: true,
    ...originalModule,
    uploadImage: vi.fn(),
  };
});
vi.mock("../../common/session", () => {
  const originalModule = vi.importActual("../../common/session");
  return {
    __esModule: true,
    ...originalModule,
    storeInSession: vi.fn(),
  };
});
vi.mock("../../common/page-animation", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../components/loader.component", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));
vi.mock("../../components/input.component", () => ({
  __esModule: true,
  default: ({ name, type, value, placeholder }) => (
    <input
      name={name}
      type={type}
      defaultValue={value}
      placeholder={placeholder}
    />
  ),
}));

describe("EditProfile() EditProfile method", () => {
  const mockUserAuth = {
    access_token: "mockAccessToken",
    username: "mockUsername",
  };

  const renderComponent = () => {
    return render(
      <UserContext.Provider
        value={{ userAuth: mockUserAuth, setUserAuth: vi.fn() }}
      >
        <EditProfile />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the EditProfile component correctly", async () => {
      // Mock axios response for profile data
      axios.post.mockResolvedValueOnce({
        data: {
          personal_info: {
            fullname: "John Doe",
            username: "johndoe",
            profile_img: "profile.jpg",
            email: "john@example.com",
            bio: "Hello, I am John!",
          },
          social_links: {
            youtube: "",
            facebook: "",
            twitter: "",
            github: "",
            instagram: "",
            website: "",
          },
        },
      });

      renderComponent();

      // Check if loader is displayed initially
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should update profile successfully", async () => {
      // Mock axios response for profile update
      axios.post.mockResolvedValueOnce({
        data: {
          username: "newUsername",
        },
      });

      renderComponent();
    });
  });

  describe("Edge Cases", () => {
    it("should handle image upload error", async () => {
      // Mock uploadImage to reject
      uploadImage.mockRejectedValueOnce(new Error("Upload failed"));

      renderComponent();
    });

    it("should handle profile update error", async () => {
      // Mock axios response for profile update error
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            error: "Update failed",
          },
        },
      });

      renderComponent();
    });
  });
});

// End of unit tests for: EditProfile
