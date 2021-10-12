import {
  GET_ALL_ADDITIONS,
  GET_ALL_LOCATION_ITEMS,
  CREATE_ADDITION,
  UPDATE_ADDITION,
  DELETE_ADDITION
} from "./Additions.types";

const initialState = {
  allAdditions: [],
  allLocationItems: []
};

const AdditionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ADDITIONS: {
      return {
        ...state,
        allAdditions: action.payload
      };
    }
    case GET_ALL_LOCATION_ITEMS: {
      return {
        ...state,
        allLocationItems: action.payload
      };
    }
    case CREATE_ADDITION: {
      return { ...state, allAdditions: [...state.allAdditions, action.payload] }
    }
    case UPDATE_ADDITION: {
      const updateAdditions = [...state.allAdditions];
      const { LinkedAdditionsID, LinkName, MainProductId, AdditionProducts } = action.payload
      updateAdditions.forEach(addition => {
        if (addition.LinkedAdditionsID === LinkedAdditionsID) {
          addition.LinkName = LinkName;
          addition.MainProductId = MainProductId;
          addition.AdditionProducts = AdditionProducts;
        }
      })
      return { ...state, allAdditions: updateAdditions }
    }
    case DELETE_ADDITION: {
      const deleteAdditions = [...state.allAdditions];
      const { LinkedAdditionsID } = action.payload;
      state.allAdditions.forEach((addition, index) => {
        if (addition.LinkedAdditionsID === LinkedAdditionsID) {
          deleteAdditions.splice(index, 1);
        }
      })
      return { ...state, allAdditions: deleteAdditions }
    }
    default: {
      return state;
    }
  }
};

export default AdditionsReducer;
