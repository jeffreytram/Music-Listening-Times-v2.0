import React from 'react';

const categories = ['default', 'day', 'search', 'select', 'hidden'];

function Settings({ dispatchPointSettings, pointSettings }) {
  const PointSetting = ({ title, step, min, max, settingName }) => {
    return (
      <div className="point-setting">
        <h4>{title}</h4>
        <div className="settings-flexbox">
          {categories.map((cat, i) => {
            return (
              <>
                <label htmlFor={`point-${cat}-${settingName}-setting`}>{cat}</label>
                <input type="range" step={step} min={min} max={max} value={pointSettings[cat][settingName]} onChange={(event) => dispatchPointSettings({ type: cat, setting: settingName, value: event.target.value })} id={`point-${cat}-${settingName}-setting`} />
              </>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="point-settings-container">
      <h3>Settings</h3>
      <div className="settings-container">
        <PointSetting
          title='Point Opacity'
          step={.01}
          min={0}
          max={1}
          settingName='opacity'
        />
        <PointSetting
          title='Point Radius'
          step={.5}
          min={1}
          max={10}
          settingName='radius'
        />
      </div>
      <button className="button reset-default" onClick={() => dispatchPointSettings({ mode: `reset-point-settings` })}>Reset default settings</button>
    </div >
  );
}

export default Settings;
