import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Registratie Gebruiker
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Inloggen - Get Gebruiker Token
export const loginUser = userData => dispatch => {
  axios
    .post("api/users/login", userData)
    .then(res => {
      // Opslaan in locale opslag
      const { token } = res.data;
      // Set token naar lokale opslag
      localStorage.setItem("jwtToken", token);
      // Set token naar Auth header
      setAuthToken(token);
      // Decodeer token om gebruikersdata te verkrijgen
      const decoded = jwt_decode(token);
      // Set huidige gebruiker
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set ingelogde gebruiker
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Gebruiker uitloggen
export const logoutUser = () => dispatch => {
  // Verwijder token uit locale opslag
  localStorage.removeItem("jwtToken");
  // Verwijder auth header voor toekomstige requeste
  setAuthToken(false);
  // Set huidige gebruiker naar {} deze set isAuthenticated naar false
  dispatch(setCurrentUser({}));
};
