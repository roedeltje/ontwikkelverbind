import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Toepassen op elk request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Verwijder auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
