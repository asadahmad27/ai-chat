// src/App.test.jsx
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

describe("App Component", () => {
  test("renders without crashing", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});
