import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { UserContext } from "../../App";
import NotificationCard from "../notification-card.component";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mocking axios
vi.mock("axios");

// Mocking NotificationCommentField component
vi.mock("../notification-comment-field.component", () => ({
  default: () => <div>Mock Notification Comment Field</div>,
}));

const mockData = {
  seen: false,
  type: "comment",
  reply: null,
  createdAt: "2023-10-01T00:00:00Z",
  comment: { comment: "This is a comment", _id: "comment123" },
  replied_on_comment: { comment: "Replied comment" },
  user: {
    personal_info: {
      fullname: "John Doe",
      username: "johndoe",
      profile_img: "profile.jpg",
    },
  },
  blog: { _id: "blog123", blog_id: "blog123", title: "Blog Title" },
  _id: "notification123",
};

const mockNotificationState = {
  notifications: {
    results: [mockData],
    totalDocs: 1,
    deleteDocCount: 0,
  },
  setNotifications: vi.fn(),
};

const mockUserContextValue = {
  userAuth: {
    username: "author",
    profile_img: "author.jpg",
    access_token: "token123",
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("NotificationCard() NotificationCard method", () => {
  it("renders NotificationCard with comment type correctly", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContextValue}>
          <NotificationCard
            data={mockData}
            index={0}
            notificationState={mockNotificationState}
          />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
    expect(screen.getByText("commented on")).toBeInTheDocument();
    expect(screen.getByText('"Blog Title"')).toBeInTheDocument();
    expect(screen.getByText("This is a comment")).toBeInTheDocument();
    //expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it("toggles reply field on Reply button click", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContextValue}>
          <NotificationCard
            data={mockData}
            index={0}
            notificationState={mockNotificationState}
          />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const replyButton = screen.getByText("Reply");
    fireEvent.click(replyButton);

    expect(
      screen.getByText("Mock Notification Comment Field")
    ).toBeInTheDocument();
  });

  it("handles delete comment action correctly", async () => {
    axios.post.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContextValue}>
          <NotificationCard
            data={mockData}
            index={0}
            notificationState={mockNotificationState}
          />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
  });

  it("renders correctly when notification is seen", () => {
    const seenData = { ...mockData, seen: true };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContextValue}>
          <NotificationCard
            data={seenData}
            index={0}
            notificationState={mockNotificationState}
          />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText("border-l-2")).not.toBeInTheDocument();
  });
});
