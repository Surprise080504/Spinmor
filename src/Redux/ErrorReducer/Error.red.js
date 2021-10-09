import {
  GET_ERROR,
  CLEAR_ERROR
} from "./Error.types";

const initialState = {};

const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERROR:
      return action.payload
    case CLEAR_ERROR:
      return {}
    default: {
      return state;
    }
  }
};

export default ErrorReducer;
