import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { getNextMonth, getPrevMonth } from "../logic/chart";

const DateNavigation = ({ month, year, timePeriod, timeRange, yearList, dispatchData, datasetBuckets }) => {

  const handleMonthlyMonthChange = (event) => {
    const newMonth = parseInt(event.target.value);
    dispatchData({ type: 'monthly-month-change', nMonth: newMonth, datasetBuckets: datasetBuckets });
  };

  const handleMonthlyYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    dispatchData({ type: 'monthly-year-change', nYear: newYear, datasetBuckets: datasetBuckets });
  }

  const handleYearlyYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    dispatchData({ type: 'year-change', nYear: newYear, datasetBuckets: datasetBuckets });
  }

  const handleNextPeriodChange = (timePeriod) => {
    if (timePeriod === 'monthly') {
      const nextMonthDate = getNextMonth(month, year);
      const nextMonth = nextMonthDate.getMonth() + 1;
      const nextMonthYear = nextMonthDate.getFullYear();
      dispatchData({ type: 'month-change', nMonth: nextMonth, nYear: nextMonthYear, datasetBuckets: datasetBuckets });
    } else if (timePeriod === 'yearly') {
      dispatchData({ type: 'year-change', nYear: parseInt(year) + 1, datasetBuckets: datasetBuckets });
    }
  }

  const handlePrevPeriodChange = (timePeriod) => {
    if (timePeriod === 'monthly') {
      const prevMonthDate = getPrevMonth(month, year);
      const prevMonth = prevMonthDate.getMonth() + 1;
      const prevMonthYear = prevMonthDate.getFullYear();
      dispatchData({ type: 'month-change', nMonth: prevMonth, nYear: prevMonthYear, datasetBuckets: datasetBuckets });
    } else if (timePeriod === 'yearly') {
      dispatchData({ type: 'year-change', nYear: parseInt(year) - 1, datasetBuckets: datasetBuckets });
    }
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const abbrev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const nextMonthDate = getNextMonth(month, year);
  const prevMonthDate = getPrevMonth(month, year);

  let nextDisabled;
  let prevDisabled;

  if (timePeriod === 'monthly') {
    nextDisabled = (nextMonthDate > timeRange[1]) ? 'disabled-arrow' : '';
    prevDisabled = (prevMonthDate < timeRange[0]) ? 'disabled-arrow' : '';
  } else if (timePeriod === 'yearly') {
    nextDisabled = (yearList.indexOf(parseInt(year) + 1) === -1) && 'disabled-arrow';
    prevDisabled = (yearList.indexOf(parseInt(year) - 1) === -1) && 'disabled-arrow';
  }

  return (
    <div className="date-navigation">
      <FontAwesomeIcon icon={faCaretUp} className={`up-caret arrow ${prevDisabled}`} onClick={() => handlePrevPeriodChange(timePeriod)}
        title={`Go to previous ${(timePeriod === 'monthly') ? 'month' : 'year'}`}
      />
      <FontAwesomeIcon icon={faCaretDown} className={`down-caret arrow ${nextDisabled}`} onClick={() => handleNextPeriodChange(timePeriod)}
        title={`Go to the next ${(timePeriod === 'monthly') ? 'month' : 'year'}`}
      />
      {(timePeriod === 'monthly') && (
        <select id="month-select" onChange={handleMonthlyMonthChange} value={month}>
          {months.map((month, i) => {
            return (
              <option value={abbrev[i]}>{month}</option>
            )
          })}
        </select>
      )}
      <select id="year-select" onChange={(timePeriod === 'monthly') ? handleMonthlyYearChange : handleYearlyYearChange} value={year}>
        {yearList.map((year) => {
          return (
            <option value={year}>{year}</option>
          )
        })}
      </select>
    </div>
  )
}

export default DateNavigation;