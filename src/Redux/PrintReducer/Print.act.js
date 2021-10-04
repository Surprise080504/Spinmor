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

import { status, axiosInstance } from "../../api/api";

export const setTemplates = (templates) => ({
  type: SET_TEMPLATES,
  payload: templates,
});

export const setGetTemplatesStatus = (getTemplatesStatus) => ({
  type: GET_TEMPLATES_STATUS,
  payload: getTemplatesStatus,
});

export const getTemplatesAction = () => async (dispatch, getState) => {
  dispatch(setGetTemplatesStatus(status.loading));

  try {
    const getTemplatesRes = await axiosInstance({
      method: "get",
      url: "/host/Templates",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (getTemplatesRes.data && Array.isArray(getTemplatesRes.data)) {
      dispatch(setTemplates(getTemplatesRes.data));
      dispatch(setGetTemplatesStatus(status.finish));
    } else {
      dispatch(setGetTemplatesStatus(`${status.error} 404`));
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

    dispatch(setGetTemplatesStatus(`${status.error} ${caughtError}`));
  }
};

export const setSelectedTemplate = (selectedTemplate) => ({
  type: SELECTED_TEMPLATE,
  payload: selectedTemplate,
});

//
//

export const setLabelLocation = (labelLocation) => ({
  type: SET_LABEL_LOCATION,
  payload: labelLocation,
});

export const toggleLabelItem = (labelItem) => ({
  type: TOGGLE_LABEL_ITEM,
  payload: { ...labelItem, createDocStatus: status.not_started },
  // payload: labelItem,
});

export const clearLabelItems = () => ({
  type: CLEAR_LABEL_ITEMS,
});

//
//

export const setCreateDocStatus = (id, status) => ({
  type: SET_CREATE_DOC_STATUS,
  payload: {
    id,
    status,
  },
});

export const createDocAction = (item) => async (dispatch, getState) => {
  let idField = "";
  if (item.hasOwnProperty("ItemListId")) {
    idField = "ItemListId";
  } else if (item.hasOwnProperty("LocationId")) {
    idField = "LocationId";
  }
  dispatch(setCreateDocStatus(item[idField], status.loading));

  try {
    let data = {};
    if (idField === "ItemListId") {
      data = {
        QRNumber: item.QRCode?.trim?.(),
        Description: item.Description,
        Price:
          getState()
            .PrintReducer.labelLocation?.CurrencySymbol?.trim?.()
            ?.substring?.(0, 2) +
          "$" +
          item.PriceIncludeTax,
        // Price:
        //   item.PriceIncludeTax +
        //   getState().PrintReducer.labelLocation?.CurrencySymbol?.trim?.(),
        QRURL: "www.spinmor.com",
        TemplateName: getState().PrintReducer.selectedTemplate.TemplateName,
        Type: "L",
        Symbol: "",
      };
    }

    if (idField === "LocationId") {
      data = {
        QRNumber: item.QRCode?.trim?.(),
        Description: item.Description,
        Price: " ",
        QRURL: "www.spinmor.com",
        TemplateName: getState().PrintReducer.selectedTemplate.TemplateName,
        Type: "C",
        Symbol: null,
      };
    }

    await axiosInstance({
      method: "post",
      url: "/api/QRDocs",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data,
    });

    dispatch(setCreateDocStatus(item[idField], status.finish));
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
      setCreateDocStatus(item[idField], `${status.error} ${caughtError}`)
    );
  }
};

//
//

export const toggleCardLocation = (cardLocation) => ({
  type: TOGGLE_CARD_LOCATION,
  payload: { ...cardLocation, createDocStatus: status.not_started },
});

export const clearCardLocations = () => ({
  type: CLEAR_CARD_LOCATIONS,
});

//
//

export const setGetLinksStatus = (getLinksStatus) => ({
  type: GET_LINKS_STATUS,
  payload: getLinksStatus,
});

export const setPrintLinks = (printLinks) => ({
  type: SET_PRINT_LINKS,
  payload: printLinks,
});

export const getLinksAction = () => async (dispatch, getState) => {
  dispatch(setGetLinksStatus(status.loading));

  try {
    const getLinksRes = await axiosInstance({
      method: "get",
      url: "/host/Link2Print",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (getLinksRes.data && Array.isArray(getLinksRes.data)) {
      dispatch(setPrintLinks(getLinksRes.data));
      dispatch(setGetLinksStatus(status.finish));
    } else {
      dispatch(setGetLinksStatus(`${status.error} 404`));
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

    dispatch(setGetLinksStatus(`${status.error} ${caughtError}`));
  }
};

//
//

export const setDeleteLinkStatus = (deleteLinkStatus) => ({
  type: DELETE_LINK_STATUS,
  payload: deleteLinkStatus,
});

export const deleteLinkAction = (linkToDelete) => async (
  dispatch,
  getState
) => {
  dispatch(setDeleteLinkStatus(status.loading));

  try {
    await axiosInstance({
      method: "delete",
      url: "/host/DeleteLink2Print",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        Link2PrintId: linkToDelete.Link2PrintID,
      },
    });

    dispatch(setDeleteLinkStatus(status.finish));
    const linksWithoutDeleted = getState().PrintReducer.printLinks.filter(
      (pLink) => pLink.Link2PrintID !== linkToDelete.Link2PrintID
    );
    dispatch(setPrintLinks(linksWithoutDeleted));
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

    dispatch(setDeleteLinkStatus(`${status.error} ${caughtError}`));
  }
};
