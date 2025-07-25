import { boot } from "quasar/wrappers";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  xsrfHeaderName: "X-CSRF-Token",
  xsrfCookieName: "_gorilla_csrf",
});

// Add a request interceptor to include the "Authorization" in the headers.
api.interceptors.request.use(
  (config) => {
    const sessionId = getSessionId();
    if (sessionId) {
      // Add the Authorization header.
      config.headers["Authorization"] = sessionId;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

function getSessionId() {
  // Get the cookie: "session_id=".
  const cookies = document.cookie.split(";");
  const sessionIdCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("session_id=")
  );

  if (!sessionIdCookie) {
    return "";
  }

  // Extract the session ID from the cookie.
  const sessionId = sessionIdCookie.split("=")[1];
  return sessionId;
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api };
