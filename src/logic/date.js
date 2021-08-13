/**
 * Switches from the current month to the next month
 */
export function getNextMonthDate() {
  const currDate = new Date(getSelectedValue());
  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  const nextMonth = new Date(year, month + 1, 1);

  const nextMonthText = nextMonth.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  return (validMonth(nextMonthText)) ? nextMonth : -1;
}

/**
 * Switches from the current month to the previous month
 */
export function getPrevMonthDate() {
  const currDate = new Date(getSelectedValue());
  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  const prevMonth = new Date(year, month - 1, 1);

  const prevMonthText = prevMonth.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  return (validMonth(prevMonthText)) ? prevMonth : -1;
}

/**
 * Retrieves the value of the option selected from the month dropdown selector
 */
function getSelectedValue() {
  let selectList = document.getElementById("date-range");
  let selectedValue = selectList.options[selectList.selectedIndex].value;
  return selectedValue;
}

/**
 * Checks if the given month/year is in the data
 */
function validMonth(month) {
  let selector = document.getElementById('date-range');
  for (let i = 0; i < selector.options.length; i++) {
    if (selector.options[i].text === month) {
      selector.selectedIndex = i;
      return true;
    }
  }
  return false;
}
