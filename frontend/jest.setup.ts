import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  value: function () {
    this.open = true;
  },
});

Object.defineProperty(HTMLDialogElement.prototype, "close", {
  value: function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  },
});

process.env.VITE_API_BASE_URL = "http://localhost/mock";
