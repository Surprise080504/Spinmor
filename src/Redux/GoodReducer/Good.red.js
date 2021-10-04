import {
  INITIALIZE_LOCATIONS_GOODS,
  //
  SET_LOCATIONS_GOODS,
  SET_ALL_GOODS,
  //
  SELECTED_GOOD,
  READ_GOOD_STATUS,
  UPDATE_GOOD_STATUS,
  CREATE_GOOD_STATUS,
  UPLOAD_SELECTED_IMAGE_STATUS,
  UPLOAD_GOOD_IMAGE_QR
} from "./Good.types";
import { status } from "../../api/api";

const initialState = {
  locationsGoods: [
    //array of objects
    // LocationId,
    // LocationName,
    // ItemCount, //initialized from server
    // getGoodsStatus: status.not_started,
    // deleteGoodStatus: status.not_started, //no good reason for this to be here. mistake!
    // goods: [] //this will be kept empty, but the code can save the returned items in this array as well
  ],

  allGoods: [],

  selectedGood: {
    //for ReadItem use query param 'itemListId'. for DeleteItem use query param 'ItemListId'. for UpdateItem use body param 'ItemListId'
    //ReadItem returns 'ItemListid' and ReadAllItems return 'ItemListid'
    ItemListId: -1, //ItemListId is re named from the returned field 'ItemListid'
    LocationId: null,
    ItemName: null,
    Description: null,
    Price: null,
    Tax: null,
    PriceIncludeTax: null,
    QRCode: null,
  },
  readGoodStatus: status.not_started,
  updateGoodStatus: status.not_started,
  createGoodStatus: status.not_started,
  uploadSelectedImageStatus: status.not_started,
  uploadGoodImageQR: null,
};

const GoodReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_LOCATIONS_GOODS: {
      return {
        ...state,
        locationsGoods: action.payload.map((location) => ({
          LocationId: location.LocationId,
          LocationName: location.LocationName,
          ItemCount: location.ItemCount,
          getGoodsStatus: status.not_started,
          readGoodStatus: status.not_started,
          createGoodStatus: status.not_started,
          deleteGoodStatus: status.not_started,
          goods: [],
        })),
      };
    }

    //
    //

    case SET_LOCATIONS_GOODS: {
      return {
        ...state,
        locationsGoods: action.payload,
      };
    }

    case SET_ALL_GOODS: {
      return {
        ...state,
        allGoods: action.payload,
      };
    }

    //
    //

    case SELECTED_GOOD: {
      return {
        ...state,
        selectedGood: action.payload,
      };
    }

    case READ_GOOD_STATUS: {
      return {
        ...state,
        readGoodStatus: action.payload,
      };
    }

    case UPDATE_GOOD_STATUS: {
      return {
        ...state,
        updateGoodStatus: action.payload,
      };
    }

    case CREATE_GOOD_STATUS: {
      return {
        ...state,
        createGoodStatus: action.payload,
      };
    }

    case UPLOAD_SELECTED_IMAGE_STATUS: {
      return {
        ...state,
        uploadSelectedImageStatus: action.payload,
      };
    }

    case UPLOAD_GOOD_IMAGE_QR: {
      return {
        ...state,
        uploadGoodImageQR: action.payload
      }
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default GoodReducer;
