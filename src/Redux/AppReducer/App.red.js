import {
  SET_IS_MENU_OPEN,
  //
  SET_IS_TOKEN_CALL_LOADING,
  SET_TOKEN_CALL_ERROR,
  SET_TOKEN,
  LOGOUT,
  //
  SET_INITIALIZATION_STATUS,
  //
  REGISTER_STATUS,
  //
  SET_PROD_STATUS,
  //
  SET_USER_INFO,
  READ_PROFILE_STATUS,
  UPDATE_PROFILE_STATUS,
  //
  SET_BUSINESS_INFO,
  READ_BUSINESS_STATUS,
  UPDATE_BUSINESS_STATUS,
  //
  HOME_PAGE_STATUS,
  SET_HOME_PAGE,
  //
  SUPPORT_STATUS,
  SUPPORT_OPEN,
  //
  APPLICATION_STAGE,
  GET_APPLICATION_STAGE_STATUS,
  UPDATE_APPLICATION_STAGE_STATUS,
} from "./App.types";

import { status } from "../../api/api";

const initialState = {
  isMenuOpen: true,
  themeType: "light",
  direction: "ltr",

  token: getToken(),
  isTokenCallLoading: false,
  tokenCallError: null,

  initializationStatus: status.not_started,

  registerStatus: status.not_started,

  prodStatus: null,

  readProfileStatus: status.not_started,
  updateProfileStatus: status.not_started,
  userInfo: {
    firstName: null,
    lastName: null,
    email: null,
    mobile: null,
    emailVerify: null,
    country: null,
    countryCode: null,
    mobileDigitsNoZero: null,
    mobileDigitsNoMax: null,
    currencySymbol: null,
  },

  readBusinessStatus: status.not_started,
  updateBusinessStatus: status.not_started,
  businessInfo: {
    businessName: null,
    streetAddress1: null,
    streetAddress2: null,
    suburb: null,
    state: null,
    country: null,
  },

  homePageStatus: status.not_started,
  homePage: {
    Location: null,
    Date: null,
    Stage: -1, //stage -1 will show loader step
    Count: -1,
    ItemsList: null,
    Link2PrintList: null,
    Locations: null,
  },

  supportStatus: status.not_started,
  isSupportOpen: false,

  applicationStage: status.not_started,
  getApplicationStageStatus: status.not_started,
  updateApplicationStageStatus: status.not_started,
};

function getToken() {
  const stringifiedLoginCookieInfo = localStorage.getItem("@loginCookieInfo");
  if (stringifiedLoginCookieInfo) {
    const loginCookieInfo = JSON.parse(stringifiedLoginCookieInfo);

    if (Date.now() > loginCookieInfo.expireTime) {
      return null;
    } else {
      return localStorage.getItem("@token") || null; //need to add a different flag, maybe true or false to mark if token is valid
    }
  } else {
    return null;
  }
}

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_MENU_OPEN: {
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    }

    //
    //

    case SET_IS_TOKEN_CALL_LOADING: {
      return {
        ...state,
        isTokenCallLoading: action.payload,
      };
    }

    case SET_TOKEN_CALL_ERROR: {
      return {
        ...state,
        tokenCallError: action.payload,
      };
    }

    case SET_TOKEN: {
      return {
        ...state,
        token: action.payload,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        token: null,
        initializationStatus: status.not_started,
        isLoginLoading: true,
        loginError: null,
      };
    }

    //
    //

    case SET_INITIALIZATION_STATUS: {
      return {
        ...state,
        initializationStatus: action.payload,
      };
    }

    //
    //

    case REGISTER_STATUS: {
      return {
        ...state,
        registerStatus: action.payload,
      };
    }

    //
    //

    case SET_PROD_STATUS: {
      return {
        ...state,
        prodStatus: action.payload,
      };
    }

    //
    //

    case SET_USER_INFO: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          firstName:
            action.payload.FirstName ??
            action.payload.firstName ??
            state.userInfo.firstName,
          lastName:
            action.payload.LastName ??
            action.payload.lastName ??
            state.userInfo.firstName,
          email:
            action.payload.Email ??
            action.payload.email ??
            state.userInfo.email,
          mobile:
            action.payload.Mobile ??
            action.payload.mobile ??
            state.userInfo.mobile,
          emailVerify:
            action.payload.EmailVerify ??
            action.payload.emailVerify ??
            state.userInfo.emailVerify,
          country:
            action.payload.Country ??
            action.payload.country ??
            state.userInfo.country,
          countryCode:
            action.payload.CountryCode ??
            action.payload.countryCode ??
            state.userInfo.countryCode,
          mobileDigitsNoZero:
            action.payload.MobilDigitsNoZero ??
            action.payload.mobileDigitsNoZero ??
            state.userInfo.mobileDigitsNoZero,
          mobileDigitsNoMax:
            action.payload.MobilDigitsNoMax ??
            action.payload.mobileDigitsNoMax ??
            state.userInfo.mobileDigitsNoMax,
          currencySymbol:
            action.payload.CurrencySymbol ??
            action.payload.currencySymbol ??
            state.userInfo.currencySymbol,
        },
      };
    }

    case READ_PROFILE_STATUS: {
      return {
        ...state,
        readProfileStatus: action.payload,
      };
    }

    case UPDATE_PROFILE_STATUS: {
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    }

    //
    //

    case SET_BUSINESS_INFO: {
      return {
        ...state,
        businessInfo: {
          ...state.businessInfo,
          businessName:
            action.payload.BusinessName ??
            action.payload.BuisnessName ??
            action.payload.businessName ??
            state.businessInfo.businessName,
          streetAddress1:
            action.payload.StreetAddress1 ??
            action.payload.streetAddress1 ??
            state.businessInfo.streetAddress1,
          streetAddress2:
            action.payload.StreetAddress2 ??
            action.payload.streetAddress2 ??
            state.businessInfo.streetAddress2,
          suburb:
            action.payload.Suburb ??
            action.payload.suburb ??
            state.businessInfo.suburb,
          state:
            action.payload.State ??
            action.payload.state ??
            state.businessInfo.state,
          country:
            action.payload.Country ??
            action.payload.country ??
            state.businessInfo.country,
        },
      };
    }

    case READ_BUSINESS_STATUS: {
      return {
        ...state,
        readBusinessStatus: action.payload,
      };
    }

    case UPDATE_BUSINESS_STATUS: {
      return {
        ...state,
        updateBusinessStatus: action.payload,
      };
    }

    //
    //

    case HOME_PAGE_STATUS: {
      return {
        ...state,
        homePageStatus: action.payload,
      };
    }

    case SET_HOME_PAGE: {
      let ItemsList = [];
      if (Array.isArray(action.payload.ItemsList)) {
        ItemsList = action.payload.ItemsList.map((item) => ({
          ...item,
          ItemListId: item.ItemListid,
          createDocStatus: status.not_started,
        }));
      }

      return {
        ...state,
        homePage: {
          ...action.payload,
          ItemsList,
          Stage: action.payload.hasOwnProperty("Stage")
            ? action.payload.Stage
            : action.payload?.BasketFound === "Yes"
            ? 5
            : -999,
        },
      };
    }

    //
    //

    case SUPPORT_STATUS: {
      return {
        ...state,
        supportStatus: action.payload,
      };
    }

    case SUPPORT_OPEN: {
      return {
        ...state,
        isSupportOpen: action.payload,
      };
    }

    //
    //

    case APPLICATION_STAGE: {
      return {
        ...state,
        applicationStage: action.payload,
      };
    }

    case GET_APPLICATION_STAGE_STATUS: {
      return {
        ...state,
        getApplicationStageStatus: action.payload,
      };
    }

    case UPDATE_APPLICATION_STAGE_STATUS: {
      return {
        ...state,
        updateApplicationStageStatus: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default AppReducer;
