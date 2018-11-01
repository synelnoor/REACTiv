import { createStore } from 'redux';

const initialState = {
  count: 0,
  gikHomeList : [],
};

const dataReduce = (state = initialState, action) => {
  let dataReturn = {}
  switch (action.type) {
    case 'GET':
      return state[action.name];
    case 'UPDATE':
      dataReturn[action.name] = action.data
      return dataReturn;
    case 'REMOVE':
      return {
        count: 0
      };
    case 'RESET':
      return {

      };
    default:
      return state;
  }
};

export default createStore(dataReduce);
