import React from 'react';

const categories = ['default', 'day', 'search', 'select', 'hidden'];

const TimeSettings = ({ display, timePeriod, settings, setSetting, setDefaultSetting }) => {
  return (
    <div className="time-setting">
      <h3>{display} Settings</h3>
      <div className="settings-container">
        <div>
          <h4>Point Opacity</h4>
          <div className="settings-flexbox">
            {categories.map((cat, i) => {
              return (
                <>
                  <label htmlFor={`${timePeriod}-${cat}-opacity-setting`}>{cat}</label>
                  <input type="range" step=".01" min="0" max="1" value={settings[i][0]} onChange={(event) => setSetting(timePeriod, cat, 'opacity', event.target.value)} id={`${timePeriod}-${cat}-opacity-setting`} />
                </>
              );
            })}
          </div>
        </div>
        <div>
          <h4>Point Radius</h4>
          <div className="settings-flexbox">
            {categories.map((cat, i) => {
              return (
                <>
                  <label htmlFor={`${timePeriod}-${cat}-radius-setting`}>{cat}</label>
                  <input type="range" step=".5" min="1" max="10" value={settings[i][1]} onChange={(event) => setSetting(timePeriod, cat, 'radius', event.target.value)} id={`${timePeriod}-${cat}-radius-setting`} />
                </>
              );
            })}
          </div>
        </div>
      </div>
      <button className="button reset-default" onClick={() => setDefaultSetting(timePeriod)}>Reset Default</button>
    </div>
  )
};

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { setSetting, monthlySettings, yearlySettings, setDefaultSetting } = this.props

    return (
      <div className="time-settings-container">
        <TimeSettings display="Monthly" timePeriod="monthly" settings={monthlySettings}
          setSetting={setSetting} setDefaultSetting={setDefaultSetting} />
        <TimeSettings display="Yearly" timePeriod="yearly" settings={yearlySettings}
          setSetting={setSetting} setDefaultSetting={setDefaultSetting} />
      </div >
    );
  }
}