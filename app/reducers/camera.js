const INITIAL_STATE = {};

export default (state = INITIAL_STATE, { type, dataCamPreview }) => {
  switch (type) {
    case 'IK_CAMERA_PREVIEW':
      return { ...state, ...dataCamPreview };

    default:
      return state;
  }
};