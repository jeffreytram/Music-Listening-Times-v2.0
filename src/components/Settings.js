import React from 'react';

const categories = ['default', 'day', 'search', 'select', 'hidden'];

const PointSettings = ({ display, timePeriod, settings, setSetting, }) => {
  return (
    <div className="point-setting">
      <h3>{display} Settings</h3>
      <div className="settings-container">
        <div>
          <h4>Point Opacity</h4>
          <div className="settings-flexbox">
            {categories.map((cat, i) => {
              return (
                <>
                  <label htmlFor={`${timePeriod}-${cat}-opacity-setting`}>{cat}</label>
                  <input type="range" step=".01" min="0" max="1" value={settings[cat]['opacity']} onChange={(event) => setSetting({ type: cat, setting: 'opacity', value: event.target.value })} id={`${timePeriod}-${cat}-opacity-setting`} />
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
                  <input type="range" step=".5" min="1" max="10" value={settings[cat]['radius']} onChange={(event) => setSetting({ type: cat, setting: 'radius', value: event.target.value })} id={`${timePeriod}-${cat}-radius-setting`} />
                </>
              );
            })}
          </div>
        </div>
      </div>
      <button className="button reset-default" onClick={() => setSetting({ mode: `reset-${timePeriod}-settings` })}>Reset Default</button>
    </div>
  )
};

function Settings({ dispatchMonth, dispatchYear, monthlySettings, yearlySettings }) {
  return (
    <div className="point-settings-container">
      <PointSettings display="Monthly" timePeriod="monthly" settings={monthlySettings}
        setSetting={dispatchMonth} />
      <PointSettings display="Yearly" timePeriod="yearly" settings={yearlySettings}
        setSetting={dispatchYear} />
    </div >
  );
}

export default Settings;
