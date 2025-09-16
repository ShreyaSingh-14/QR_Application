import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082", // your backend URL + port
});

export default api;
