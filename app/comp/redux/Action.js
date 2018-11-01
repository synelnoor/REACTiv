export const get = (params) => {
  const action = {
    type: 'GET',
    key: params.key
  };
  return action;
};

export const update = (params) => {
  console.log("data => ",params)
  const action = {
    type: 'UPDATE',
    data: params.data,
    name: params.name,
  };
  return action;
};

export const remove = (params) => {
  const action = {
    type: 'REMOVE',
    key: params.key
  };
  return action;
};

export const reset = (params) => {
  const action = {
    type: 'RESET',
    key: params.key
  };
  return action;
};
