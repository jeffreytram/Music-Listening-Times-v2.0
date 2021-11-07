import { useReducer } from 'react';

const initMonthlySettings = {
  default: { opacity: .3, radius: 3 },
  day: { opacity: .3, radius: 3 },
  search: { opacity: .5, radius: 5 },
  select: { opacity: .7, radius: 7 },
  hidden: { opacity: .05, radius: 3 },
};

const initYearlySettings = {
  default: { opacity: .3, radius: 2 },
  day: { opacity: .3, radius: 2 },
  search: { opacity: .4, radius: 3 },
  select: { opacity: .7, radius: 7 },
  hidden: { opacity: .03, radius: 2 },
}

const useSettings = () => {
  function reducer(state, { mode, type, setting, value }) {
    switch (mode) {
      case 'reset-monthly-settings':
        return initMonthlySettings;
      case 'reset-yearly-settings':
        return initYearlySettings;
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
  const [monthlySettings, dispatchMonth] = useReducer(reducer, initMonthlySettings);
  const [yearlySettings, dispatchYear] = useReducer(reducer, initYearlySettings);

  return { monthlySettings, dispatchMonth, yearlySettings, dispatchYear };
}

export default useSettings;