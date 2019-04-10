import axios from "axios";

const api = axios.create({
  baseURL: "https://rocketbox-api.herokuapp.com/api"
});

export default api;
