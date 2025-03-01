import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock `scrollTo` since JSDOM doesn't support it
Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

global.URL.createObjectURL = vi.fn(() => "mocked-image-url");
