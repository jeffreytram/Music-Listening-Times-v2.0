import React from 'react';

const PointSetting = ({ title, settingName, dispatchPointSettings, pointSettings }) => {
  return (
    <div className="point-setting">
      <div className="settings-flexbox">
        <>
          <label htmlFor={`point-${settingName}-setting`}>{title}</label>
          <input type="range" step={.01} min={.5} max={1.5} value={pointSettings['constant'][settingName]} onChange={(event) => dispatchPointSettings({ setting: settingName, value: event.target.value })} id={`point-${settingName}-setting`} />
        </>
      </div>
    </div>
  );
};

function Settings({ dispatchPointSettings, pointSettings }) {
  return (
    <div className="point-settings-container">
      <h3>Settings</h3>
      <div className="settings-container">
        <PointSetting
          title='Point Opacity'
          settingName='opacity'
          dispatchPointSettings={dispatchPointSettings}
          pointSettings={pointSettings}
        />
        <PointSetting
          title='Point Radius'
          settingName='radius'
          dispatchPointSettings={dispatchPointSettings}
          pointSettings={pointSettings}
        />
      </div>
      <button className="button reset-default" onClick={() => dispatchPointSettings({ mode: `reset-point-settings` })}>Reset default settings</button>
    </div >
  );
}

export default Settings;
