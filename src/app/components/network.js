const trim = (value) => (typeof value === "string" ? value.trim() : "");
const isUrl = (value) => /^https?:\/\/[^/\s]+$/i.test(value);
const isLocalHostname = (hostname) =>
  hostname === "localhost" || hostname === "127.0.0.1";

const getRuntimeUrl = (key) => {
  if (typeof window === "undefined") return "";

  const { hostname } = window.location;
  const isLocal = isLocalHostname(hostname);
  const storageKey = `chat_${key}_url`;
  const params = new URLSearchParams(window.location.search);
  const fromQuery = trim(params.get(key));
  if (isUrl(fromQuery)) {
    if (isLocal && fromQuery.includes("ngrok")) {
      localStorage.removeItem(storageKey);
      return "";
    }

    localStorage.setItem(storageKey, fromQuery);
    return fromQuery;
  }

  const fromStorage = trim(localStorage.getItem(storageKey));
  if (isUrl(fromStorage)) {
    if (isLocal && fromStorage.includes("ngrok")) {
      localStorage.removeItem(storageKey);
      return "";
    }

    return fromStorage;
  }

  return "";
};

const getDefaultApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }

  const { hostname, origin } = window.location;
  const isLocal = isLocalHostname(hostname);

  if (isLocal) {
    return "http://localhost:5000";
  }

  return `${origin}/api`;
};

export const RUNTIME_API_URL = getRuntimeUrl("api");
export const RUNTIME_SOCKET_URL = getRuntimeUrl("socket");

export const API_BASE_URL =
  RUNTIME_API_URL ||
  trim(import.meta.env.VITE_API_URL) ||
  getDefaultApiBaseUrl();

const getDefaultSocketUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }

  const { hostname, origin } = window.location;
  const isLocal = isLocalHostname(hostname);

  if (isLocal) {
    return "http://localhost:5000";
  }

  return origin;
};

export const SOCKET_URL =
  RUNTIME_SOCKET_URL ||
  trim(import.meta.env.VITE_SOCKET_URL) ||
  getDefaultSocketUrl();
export const SOCKET_PATH =
  trim(import.meta.env.VITE_SOCKET_PATH) || "/socket.io";

export const getApiHeaders = (customHeaders = {}) => {
  return { ...customHeaders };
};
