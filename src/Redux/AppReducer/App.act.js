import querystring from "query-string";

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

import { axiosInstance, status } from "../../api/api";

export const setIsMenuOpen = (isMenuOpen) => ({
  type: SET_IS_MENU_OPEN,
  payload: isMenuOpen,
});

//
//

export const setIsTokenCallLoading = (isTokenCallLoading) => ({
  type: SET_IS_TOKEN_CALL_LOADING,
  payload: isTokenCallLoading,
});

export const setTokenCallError = (tokenCallError) => ({
  type: SET_TOKEN_CALL_ERROR,
  payload: tokenCallError,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

// export const logout = () => {
//   localStorage.removeItem("@token");
//   localStorage.removeItem("@loginCookieInfo");
//   localStorage.setItem("@initializationStatus");
//   // localStorage.removeItem("@risk_login");

//   return {
//     type: LOGOUT,
//   };
// };
export const logout = () => async (dispatch, getState) => {
  localStorage.removeItem("@token");
  localStorage.removeItem("@loginCookieInfo");
  localStorage.setItem(
    "@initializationStatus",
    getState().AppReducer.initializationStatus
  );

  dispatch({
    type: LOGOUT,
  });
};

export const tokenAction = (email, password) => async (dispatch, getState) => {
  localStorage.removeItem("@initializationStatus");
  dispatch(setIsTokenCallLoading(true));

  try {
    const requestTime = Date.now();
    const tokenResponse = await axiosInstance({
      method: "post",
      url: "/Token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: querystring.stringify({
        grant_type: "password",
        username: email,
        password: password,
        ipaddress: "",
      }),
      withCredentials: true,
    });

    if (tokenResponse.data) {
      dispatch(setToken(tokenResponse.data.access_token));
      localStorage.setItem("@token", tokenResponse.data.access_token);

      const responseTime = Date.now();
      const expireTime =
        responseTime +
        (tokenResponse.data?.expires_in ?? 86399) * 1000 -
        60 * 1000; //response time + expires_in - 1 minute
      localStorage.setItem(
        "@loginCookieInfo",
        JSON.stringify({
          requestTime,
          responseTime,
          expireTime,
        })
      );
      localStorage.setItem("@latestTokenResponseTime", responseTime);
    } else {
      dispatch(setTokenCallError(404));
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      dispatch(setTokenCallError(error.response.status));
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      dispatch(setTokenCallError(500));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      dispatch(setTokenCallError(500));
    }
  } finally {
    dispatch(setIsTokenCallLoading(false));
  }
};

//
//

export const setProdStatus = (prodStatus) => ({
  type: SET_PROD_STATUS,
  payload: prodStatus?.trim?.() || "Sandbox",
});

//
//

export const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

export const setReadProfileStatus = (readProfileStatus) => ({
  type: READ_PROFILE_STATUS,
  payload: readProfileStatus,
});

export const setUpdateProfileStatus = (updateProfileStatus) => ({
  type: UPDATE_PROFILE_STATUS,
  payload: updateProfileStatus,
});

export const readProfileAction =
  (updateStatus = true) =>
  async (dispatch, getState) => {
    if (updateStatus) {
      dispatch(setReadProfileStatus(status.loading));
    }

    try {
      const readProfileRes = await axiosInstance({
        method: "get",
        url: "/host/ReadProfile",
        headers: {
          Authorization: "Bearer " + getState().AppReducer.token,
        },
        withCredentials: true,
      });

      if (readProfileRes.data) {
        dispatch(setUserInfo(readProfileRes.data));
        if (updateStatus) {
          dispatch(setReadProfileStatus(status.finish));
        }
      } else {
        if (updateStatus) {
          dispatch(setReadProfileStatus(`${status.error} 404`));
        }
      }
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      if (updateStatus) {
        dispatch(setReadProfileStatus(`${status.error} ${caughtError}`));
      }
    }
  };

export const updateProfileAction = (formData) => async (dispatch, getState) => {
  dispatch(setUpdateProfileStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/host/UpdateProfile",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: formData,
    });

    dispatch(setUpdateProfileStatus(status.finish));
    dispatch(readProfileAction(false));
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setUpdateProfileStatus(`${status.error} ${caughtError}`));
  }
};

//
//

export const setBusinessInfo = (businessInfo) => ({
  type: SET_BUSINESS_INFO,
  payload: businessInfo,
});

export const setReadBusinessStatus = (readBusinessStatus) => ({
  type: READ_BUSINESS_STATUS,
  payload: readBusinessStatus,
});

export const setUpdateBusinessStatus = (updateBusinessStatus) => ({
  type: UPDATE_BUSINESS_STATUS,
  payload: updateBusinessStatus,
});

export const readBusinessAction =
  (updateStatus = true) =>
  async (dispatch, getState) => {
    if (updateStatus) {
      dispatch(setReadBusinessStatus(status.loading));
    }

    try {
      const readBusinessRes = await axiosInstance({
        method: "get",
        url: "/host/ReadBusinessProfile",
        headers: {
          Authorization: "Bearer " + getState().AppReducer.token,
        },
        withCredentials: true,
      });

      if (readBusinessRes.data) {
        dispatch(setBusinessInfo(readBusinessRes.data));
        if (updateStatus) {
          dispatch(setReadBusinessStatus(status.finish));
        }
      } else {
        if (updateStatus) {
          dispatch(setReadBusinessStatus(`${status.error} 404`));
        }
      }
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      if (updateStatus) {
        dispatch(setReadBusinessStatus(`${status.error} ${caughtError}`));
      }
    }
  };

export const updateBusinessAction =
  (formData) => async (dispatch, getState) => {
    dispatch(setUpdateBusinessStatus(status.loading));

    try {
      await axiosInstance({
        method: "put",
        url: "/host/UpdateBusinessProfile",
        headers: {
          Authorization: "Bearer " + getState().AppReducer.token,
        },
        withCredentials: true,
        data: formData,
      });

      dispatch(setUpdateBusinessStatus(status.finish));
      dispatch(readBusinessAction(false));
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      dispatch(setUpdateBusinessStatus(`${status.error} ${caughtError}`));
    }
  };

//
//

export const loginAction = () => async (dispatch, getState) => {
  const initializationStatus = getState().AppReducer.initializationStatus;

  try {
    const loginResponse = await axiosInstance({
      method: "get",
      url: "/host/Login",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (loginResponse.data) {
      const loginData = loginResponse.data;

      dispatch(setProdStatus(loginData.Status));
      dispatch(
        setUserInfo({
          firstName: loginData.FirstName,
          country: loginData.Country,
        })
      );
      dispatch(
        setBusinessInfo({
          businessName: loginData.BuisnessName,
          country: loginData.Country,
        })
      );

      if (initializationStatus !== status.finish) {
        dispatch(setInitializationStatus(status.success_login));
      }
    } else {
      if (initializationStatus !== status.finish) {
        dispatch(setInitializationStatus(status.error_login));
      }
    }
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    if (initializationStatus !== status.finish) {
      dispatch(setInitializationStatus(status.error_login));
    }
  }
};

//
//

export const setRegisterStatus = (registerStatus) => ({
  type: REGISTER_STATUS,
  payload: registerStatus,
});

export const registerAction = (formData) => async (dispatch, getState) => {
  dispatch(setRegisterStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/api/RegisterUser",
      data: formData,
    });

    dispatch(setRegisterStatus(status.finish));
    localStorage.setItem("@registrationSuccessTime", Date.now());
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
      if (error.response.data) {
        caughtError += " " + error.response.data;
      }
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setRegisterStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setInitializationStatus = (initializationStatus) => ({
  type: SET_INITIALIZATION_STATUS,
  payload: initializationStatus,
});

//
//

export const setHomePageStatus = (homePageStatus) => ({
  type: HOME_PAGE_STATUS,
  payload: homePageStatus,
});

export const setHomePage = (homePage) => ({
  type: SET_HOME_PAGE,
  payload: homePage,
});

export const getHomePageAction =
  (options = {}) =>
  async (dispatch, getState) => {
    const { updateStatus = true } = options;

    if (updateStatus) {
      dispatch(setHomePageStatus(status.loading));
    }

    const errorHomePage = {
      Location: null,
      Date: null,
      Stage: -2, //stage -2 will fall to unknown step
      Count: -1,
      ItemsList: null,
      Link2PrintList: null,
    };

    try {
      const homePageRes = await axiosInstance({
        method: "get",
        url: "/api/HomePage",
        headers: {
          Authorization: "Bearer " + getState().AppReducer.token,
        },
        withCredentials: true,
      });

      if (homePageRes.data) {
        dispatch(setHomePage(homePageRes.data));
        if (updateStatus) {
          dispatch(setHomePageStatus(status.finish));
        }
      } else {
        dispatch(setHomePage(errorHomePage));
        if (updateStatus) {
          dispatch(setHomePageStatus(`${status.error} 404`));
        }
      }
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      dispatch(setHomePage(errorHomePage));
      if (updateStatus) {
        dispatch(setHomePageStatus(`${status.error} ${caughtError}`));
      }
    }
  };

//
//

export const setIsSupportOpen = (isSupportOpen) => ({
  type: SUPPORT_OPEN,
  payload: isSupportOpen,
});

export const setSupportStatus = (supportStatus) => ({
  type: SUPPORT_STATUS,
  payload: supportStatus,
});

export const supportAction =
  (support, fakeLogin = false) =>
  async (dispatch, getState) => {
    dispatch(setSupportStatus(status.loading));

    try {
      let token = getState().AppReducer.token;
      if (fakeLogin) {
        const tokenResponse = await axiosInstance({
          method: "post",
          url: "/Token",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: querystring.stringify({
            grant_type: "password",
            username: "fake@gmail.com",
            password: "Fake12345!",
            ipaddress: "",
          }),
        });
        token = tokenResponse.data.access_token;
      }

      await axiosInstance({
        method: "post",
        url: "/host/support",
        headers: {
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
        data: {
          Support: support,
        },
      });

      dispatch(setSupportStatus(status.finish));
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      dispatch(setSupportStatus(`${status.error} ${caughtError}`));
      return;
    }
  };

//
//

export const setApplicationStage = (applicationStage) => ({
  type: APPLICATION_STAGE,
  payload: applicationStage,
});

export const setGetApplicationStageStatus = (getApplicationStageStatus) => ({
  type: GET_APPLICATION_STAGE_STATUS,
  payload: getApplicationStageStatus,
});

export const getApplicationStageAction =
  (options = {}) =>
  async (dispatch, getState) => {
    const { updateStatus = true } = options;

    if (updateStatus) {
      dispatch(setGetApplicationStageStatus(status.loading));
    }

    try {
      const getApplicationStageRes = await axiosInstance({
        method: "get",
        url: "/host/ApplicationStageRead",
        headers: {
          Authorization: "Bearer " + getState().AppReducer.token,
        },
        withCredentials: true,
      });

      dispatch(
        setApplicationStage(getApplicationStageRes.data.ApplicationStage)
      );
      if (updateStatus) {
        dispatch(setGetApplicationStageStatus(status.finish));
      }
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      if (updateStatus) {
        dispatch(
          setGetApplicationStageStatus(`${status.error} ${caughtError}`)
        );
      }
      return;
    }
  };

export const setUpdateApplicationStageStatus = (
  updateApplicationStageStatus
) => ({
  type: UPDATE_APPLICATION_STAGE_STATUS,
  payload: updateApplicationStageStatus,
});

export const updateApplicationStageAction =
  (newStage) => async (dispatch, getState) => {
    dispatch(setUpdateApplicationStageStatus(status.loading));

    try {
      await axiosInstance({
        method: "put",
        url: "/host/ApplicationStageUpdate",
        headers: {
          Authorization: "Bearer " + getState().AppReducer.token,
        },
        withCredentials: true,
        params: {
          stage: newStage,
        },
      });

      dispatch(setApplicationStage(newStage));
      dispatch(setUpdateApplicationStageStatus(status.finish));
    } catch (error) {
      let caughtError = 500;

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        caughtError = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }

      dispatch(
        setUpdateApplicationStageStatus(`${status.error} ${caughtError}`)
      );
      return;
    }
  };
