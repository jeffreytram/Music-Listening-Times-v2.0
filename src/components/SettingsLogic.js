import { useReducer } from 'react';

const initPointSettings = {
  default: { opacity: .3, radius: 3 },
  day: { opacity: .3, radius: 3 },
  search: { opacity: .5, radius: 5 },
  select: { opacity: .7, radius: 7 },
  hidden: { opacity: .05, radius: 3 },
  constant: { opacity: 1, radius: 1},
};

const useSettings = () => {
  function reducer(state, { mode, setting, value }) {
    switch (mode) {
      case 'reset-point-settings':
        return initPointSettings;
      default:
        return {
          ...state,
          default: {
            ...state['default'],
            [setting]: initPointSettings['default'][setting] * value,
          },
          day: {
            ...state['day'],
            [setting]: initPointSettings['day'][setting] * value,
          },
          search: {
            ...state['search'],
            [setting]: initPointSettings['search'][setting] * value,
          },
          select: {
            ...state['select'],
            [setting]: initPointSettings['select'][setting] * value,
          },
          hidden: {
            ...state['hidden'],
            [setting]: initPointSettings['hidden'][setting] * value,
          },
          constant: {
            ...state['constant'],
            [setting]: value,
          }
        };
    }
  }
  const [pointSettings, dispatchPointSettings] = useReducer(reducer, initPointSettings);

  return { pointSettings, dispatchPointSettings };
}

export default useSettings;