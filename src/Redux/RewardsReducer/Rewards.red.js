import {
  GET_ALL_REWARDS,
  CREATE_REWARD,
  UPDATE_REWARD,
  DELETE_REWARD,
  GET_ALL_ITEMS,
  GET_LINKED_REWARDS,
  SET_ALL_ITEMS,
  SET_LINKED_REWARDS
} from "./Rewards.types";

const initialState = {
  allRewards: [],
  allItems: [],
  linkedRewards: []
};

const RewardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REWARDS: {
      return {
        ...state,
        allRewards: action.payload
      };
    }
    case GET_ALL_ITEMS: {
      return {
        ...state,
        allItems: action.payload
      };
    }
    case GET_LINKED_REWARDS: {
      return {
        ...state,
        linkedRewards: action.payload
      };
    }
    case SET_ALL_ITEMS: {
      return {
        ...state,
        allItems: []
      };
    }
    case SET_LINKED_REWARDS: {
      return {
        ...state,
        linkedRewards: []
      };
    }
    case CREATE_REWARD: {
      return { ...state, allRewards: [...state.allRewards, action.payload] }
    }
    case UPDATE_REWARD: {
      const updateRewards = [...state.allRewards];
      const { CoffeeRewardsId, HowMany, Name, Message } = action.payload
      updateRewards.forEach(reward => {
        if (reward.CoffeeRewardsId === CoffeeRewardsId) {
          reward.HowMany = HowMany;
          reward.Name = Name;
          reward.Message = Message;
        }
      })
      return { ...state, allRewards: updateRewards }
    }
    case DELETE_REWARD: {
      const deleteRewards = [...state.allRewards];
      const { CoffeeRewardsId } = action.payload;
      state.allRewards.forEach((reward, index) => {
        if (reward.CoffeeRewardsId === CoffeeRewardsId) {
          deleteRewards.splice(index, 1);
        }
      })
      return { ...state, allRewards: deleteRewards }
    }
    default: {
      return state;
    }
  }
};

export default RewardsReducer;
