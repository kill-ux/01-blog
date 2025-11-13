

export const environment = {
  production: false,
  API_URL: `${location.protocol + "//" + location.hostname}:8080/api`, // <-- This is the fix
  WS_URL: `${location.protocol + "//" + location.hostname}:8080/ws`
};
