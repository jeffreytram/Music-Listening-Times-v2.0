import React from 'react';

const categories = ['default', 'day', 'search', 'select', 'hidden'];

const PointSettings = ({ settings, dispatchPointSettings, }) => {
  return (
    <div className="point-setting">
      <h3>Settings</h3>
      <div className="settings-container">
        <div>
          <h4>Point Opacity</h4>
          <div className="settings-flexbox">
            {categories.map((cat, i) => {
              return (
                <>
                  <label htmlFor={`point-${cat}-opacity-setting`}>{cat}</label>
                  <input type="range" step=".01" min="0" max="1" value={settings[cat]['opacity']} onChange={(event) => dispatchPointSettings({ type: cat, setting: 'opacity', value: event.target.value })} id={`point-${cat}-opacity-setting`} />
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
                  <label htmlFor={`point-${cat}-radius-setting`}>{cat}</label>
                  <input type="range" step=".5" min="1" max="10" value={settings[cat]['radius']} onChange={(event) => dispatchPointSettings({ type: cat, setting: 'radius', value: event.target.value })} id={`point-${cat}-radius-setting`} />
                </>
              );
            })}
          </div>
        </div>
      </div>
      <button className="button reset-default" onClick={() => dispatchPointSettings({ mode: `reset-point-settings` })}>Reset Default</button>
    </div>
  )
};

function Settings({ dispatchPointSettings, pointSettings }) {
  return (
    <div className="point-settings-container">
      <PointSettings timePeriod="monthly" settings={pointSettings}
        dispatchPointSettings={dispatchPointSettings} />
    </div >
  );
}

export default Settings;
