import axios from "axios";

const api = axios.create({
  baseURL: "https://rocketbox-api.herokuapp.com"
});

export default api;
