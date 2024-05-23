export const SERVER_APP =
  window.location.origin === "http://localhost:8080"
    ? "https://cser.vn/"
    : window?.SERVER || window.location.origin;
export const NAME_APP = window.GlobalConfig?.APP.Name;
export const VERSION_APP = window.GlobalConfig?.APP.Version;
