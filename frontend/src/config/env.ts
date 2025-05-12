let baseUrl: string;

if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
  baseUrl = import.meta.env.VITE_API_BASE_URL;
} else {
  baseUrl = process.env.VITE_API_BASE_URL ?? "";
}

export { baseUrl };
