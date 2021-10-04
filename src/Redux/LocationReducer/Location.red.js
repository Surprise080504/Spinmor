import {
  SET_LOCATIONS,
  GET_LOCATIONS_STATUS,
  //
  SELECTED_LOCATION,
  GET_LOCATION_DETAILS_STATUS,
  UPDATE_LOCATION_STATUS,
  DELETE_LOCATION_STATUS,
  CREATE_LOCATION_STATUS,
} from "./Location.types";

import { status } from "../../api/api";

const initialState = {
  locations: [
    // LocationId,
    // LocationName,
    // StreetAddress1,
    // StreetAddress2,
    // Country,
    // Suburb,
    // State,
    // Description,
    // ByeBye,
    // CurrencySymbol,
  ],
  getLocationsStatus: status.not_started,

  selectedLocation: {
    LocationId: -1,
    LocationName: null,
    StreetAddress1: null,
    StreetAddress2: null,
    Country: null,
    Suburb: null,
    State: null,
    Description: null,
    ByeBye: null,
    CurrencySymbol: null,
    QRCode: null,
  },
  getLocationDetailsStatus: status.not_started,
  updateLocationStatus: status.not_started,
  deleteLocationStatus: status.not_started,
  createLocationStatus: status.not_started,
};

const LocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATIONS: {
      return {
        ...state,
        locations: action.payload.sort((a, b) =>
          a.LocationName.toLowerCase() > b.LocationName.toLowerCase()
            ? 1
            : b.LocationName.toLowerCase() > a.LocationName.toLowerCase()
            ? -1
            : 0
        ),
      };
    }

    case GET_LOCATIONS_STATUS: {
      return {
        ...state,
        getLocationsStatus: action.payload,
      };
    }

    //
    //

    case SELECTED_LOCATION: {
      return {
        ...state,
        selectedLocation: action.payload,
      };
    }

    case GET_LOCATION_DETAILS_STATUS: {
      return {
        ...state,
        getLocationDetailsStatus: action.payload,
      };
    }

    case UPDATE_LOCATION_STATUS: {
      return {
        ...state,
        updateLocationStatus: action.payload,
      };
    }

    case DELETE_LOCATION_STATUS: {
      return {
        ...state,
        deleteLocationStatus: action.payload,
      };
    }

    case CREATE_LOCATION_STATUS: {
      return {
        ...state,
        createLocationStatus: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default LocationReducer;
