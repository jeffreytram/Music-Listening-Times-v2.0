import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

const DayFilter = ({ dayFilter, toggleDayCheckbox }) => {
  const DayButton = ({ abbrevation, fullName, displayName }) => {
    return (
      <label htmlFor={abbrevation}>
        <input
          type="checkbox"
          name={abbrevation}
          id={abbrevation}
          value={fullName}
          checked={dayFilter[abbrevation]}
          onChange={toggleDayCheckbox}
        />
        <span className="checkbox">{displayName}</span>
      </label>
    )
  }
  return (
    <div id="day-filters">
      <label><FontAwesomeIcon icon={faFilter} /> Filter by day of the week:</label>
      <div id="day-container">
        <DayButton abbrevation="mon" fullName="Monday" displayName="Mon" />
        <DayButton abbrevation="tue" fullName="Tuesday" displayName="Tue" />
        <DayButton abbrevation="wed" fullName="Wednesday" displayName="Wed" />
        <DayButton abbrevation="thu" fullName="Thursday" displayName="Thu" />
        <DayButton abbrevation="fri" fullName="Friday" displayName="Fri" />
        <DayButton abbrevation="sat" fullName="Saturday" displayName="Sat" />
        <DayButton abbrevation="sun" fullName="Sunday" displayName="Sun" />
      </div>
    </div>
  )
}

export default DayFilter;