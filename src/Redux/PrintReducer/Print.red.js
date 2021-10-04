import {
  SET_TEMPLATES,
  GET_TEMPLATES_STATUS,
  SELECTED_TEMPLATE,
  SET_CREATE_DOC_STATUS,
  //
  SET_LABEL_LOCATION,
  TOGGLE_LABEL_ITEM,
  CLEAR_LABEL_ITEMS,
  //
  TOGGLE_CARD_LOCATION,
  CLEAR_CARD_LOCATIONS,
  //
  GET_LINKS_STATUS,
  SET_PRINT_LINKS,
  //
  DELETE_LINK_STATUS,
} from "./Print.types";

import xorBy from "lodash/xorBy";
import { status } from "../../api/api";

const initialState = {
  templates: [],
  getTemplatesStatus: status.not_started,
  selectedTemplate: { TemplateName: -1 },

  labelLocation: { LocationId: -1 },
  labelItems: [],

  cardLocations: [],

  getLinksStatus: status.not_started,
  printLinks: [],

  deleteLinkStatus: status.not_started,
};

const PrintReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEMPLATES: {
      return {
        ...state,
        templates: action.payload,
      };
    }

    case GET_TEMPLATES_STATUS: {
      return {
        ...state,
        getTemplatesStatus: action.payload,
      };
    }

    case SELECTED_TEMPLATE: {
      return {
        ...state,
        selectedTemplate: action.payload,
      };
    }

    case SET_CREATE_DOC_STATUS: {
      return {
        ...state,
        labelItems: state.labelItems.map((item) =>
          item.ItemListId !== action.payload.id
            ? item
            : { ...item, createDocStatus: action.payload.status }
        ),
        cardLocations: state.cardLocations.map((location) =>
          location.LocationId !== action.payload.id
            ? location
            : { ...location, createDocStatus: action.payload.status }
        ),
      };
    }

    //
    //

    case SET_LABEL_LOCATION: {
      return {
        ...state,
        labelLocation: action.payload,
      };
    }

    case TOGGLE_LABEL_ITEM: {
      return {
        ...state,
        labelItems: xorBy(state.labelItems, [action.payload], "ItemListId"),
      };
    }

    case CLEAR_LABEL_ITEMS: {
      return {
        ...state,
        labelItems: [],
      };
    }

    //
    //

    case TOGGLE_CARD_LOCATION: {
      return {
        ...state,
        cardLocations: xorBy(
          state.cardLocations,
          [action.payload],
          "LocationId"
        ),
      };
    }

    case CLEAR_CARD_LOCATIONS: {
      return {
        ...state,
        cardLocations: [],
      };
    }

    //
    //

    case GET_LINKS_STATUS: {
      return {
        ...state,
        getLinksStatus: action.payload,
      };
    }

    case SET_PRINT_LINKS: {
      return {
        ...state,
        printLinks: action.payload,
      };
    }

    //
    //

    case DELETE_LINK_STATUS: {
      return {
        ...state,
        deleteLinkStatus: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default PrintReducer;
