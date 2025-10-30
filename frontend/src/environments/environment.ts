// console.log("#####################",location.hostname)

// export const environment = {
//     API_URL : `${location.hostname}:8080/api`
// };


export const environment = {
  production: false,
  API_URL: '/api' // <-- This is the fix
};