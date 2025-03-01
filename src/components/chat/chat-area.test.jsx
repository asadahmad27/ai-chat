import { render, screen, fireEvent } from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../../redux/reducers/chat";
import ChatArea from "./chat-area";

// Mock Redux store
const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

// Helper function to render with Provider
const renderWithProvider = (ui) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("ChatArea Component", () => {
  test("renders input field and send button", () => {
    renderWithProvider(<ChatArea />);

    expect(
      screen.getByPlaceholderText("Type a message...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("user can type in the input field", () => {
    renderWithProvider(<ChatArea />);

    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hello" } });

    expect(input.value).toBe("Hello");
  });

  test("pressing enter sends the message", () => {
    renderWithProvider(<ChatArea />);

    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hello" } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(input.value).toBe(""); // Should be cleared after send
  });

  test("image preview appears after uploading an image", async () => {
    renderWithProvider(<ChatArea />);

    // Mock a file upload
    const file = new File(["dummy content"], "test-image.png", {
      type: "image/png",
    });
    const fileInput = screen.getByLabelText("Upload Image");

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Use findByAltText to wait for the image preview to appear
    expect(await screen.findByAltText("preview")).toBeInTheDocument();
  });
});
