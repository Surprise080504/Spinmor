import { combineReducers } from "redux";

import { LOGOUT } from "./AppReducer/App.types";

import AppReducer from "./AppReducer/App.red";
import LocationReducer from "./LocationReducer/Location.red";
import GoodReducer from "./GoodReducer/Good.red";
import PrintReducer from "./PrintReducer/Print.red";
import ReportReducer from "./ReportReducer/Report.red";

// export default combineReducers({
//   AppReducer,
//   ScannerReducer,
//   BasketReducer,
// });

const appReducer = combineReducers({
  AppReducer,
  LocationReducer,
  GoodReducer,
  PrintReducer,
  ReportReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;