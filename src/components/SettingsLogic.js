import { useReducer } from 'react';

const initPointSettings = {
  default: { opacity: .3, radius: 3 },
  day: { opacity: .3, radius: 3 },
  search: { opacity: .5, radius: 5 },
  select: { opacity: .7, radius: 7 },
  hidden: { opacity: .05, radius: 3 },
};

const useSettings = () => {
  function reducer(state, { mode, type, setting, value }) {
    switch (mode) {
      case 'reset-point-settings':
        return initPointSettings;
      default:
        return {
          ...state,
          [type]: {
            ...state[type],
            [setting]: value,
          }
        };
    }
  }
  const [pointSettings, dispatchPointSettings] = useReducer(reducer, initPointSettings);

  return { pointSettings, dispatchPointSettings };
}

export default useSettings;