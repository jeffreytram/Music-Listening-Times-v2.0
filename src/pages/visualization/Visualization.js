import React, { useState, useEffect } from 'react';
import * as d3 from "d3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faRedoAlt, faUpload } from '@fortawesome/free-solid-svg-icons'
import Graph from '../../components/Graph';
import SearchFilter from '../../components/SearchFilter';
import DayFilter from '../../components/DayFilter';
import DateNavigation from '../../components/DateNavigation';
import SongInfo from '../../components/SongInfo';
import Datalist from '../../components/Datalist';
import Settings from '../../components/Settings';
import useData from './DataLogic';
import useSettings from '../../components/SettingsLogic';
import { setup, uploadedDataSetup } from '../../logic/chart.js';
import './visualization.css';

function Visualization(props) {
  const { data, dispatchData } = useData();

  const {
    dataset, filteredDataset, month, year, timePeriod, dayFilter, clickedPoint, filterView,
    datasetBuckets, entireDataset, timeRange, yearList
  } = data;

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [datalistSetting, setDatalistSetting] = useState('artist');
  const { monthlySettings, dispatchMonth, yearlySettings, dispatchYear } = useSettings();

  useEffect(() => {
    setup(dispatchData);
  }, [dispatchData]);

  const handleFileUpload = (event) => {
    const fileList = event.target.files;
    const file = fileList[0];

    const fileReader = new FileReader();

    const parseFile = () => {
      var data = d3.csvParse(fileReader.result, function (d) {
        return d;
      });
      uploadedDataSetup(data, dispatchData);
    }

    fileReader.addEventListener("load", parseFile, false);
    if (file) {
      fileReader.readAsText(file);
    }
  }

  const body = document.getElementsByTagName('body')[0];
  body.className = (isDarkTheme) ? 'dark-theme' : '';

  const TimePeriodButton = ({ value }) => (
    <span className="time-period-button">
      <input id={value} type="radio" value={value} name="time-period" checked={timePeriod === value}
        onChange={() => dispatchData({ type: `change-to-${value}`, datasetBuckets: datasetBuckets })}
      />
      <label htmlFor={value}>{value}</label>
    </span>
  )

  return (
    <div className="site-container">
      <div id="loading">
        <div className="lds-dual-ring"></div>
        <h2>Loading...</h2>
      </div>
      <div id="content-container">
        <div id="side-options-container">
          <label htmlFor="file-upload" className="side-option button">
            <FontAwesomeIcon icon={faUpload} /> Import CSV
          </label>
          <input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload}></input>
          <div className="button side-option" onClick={() => setIsDarkTheme(!isDarkTheme)}>
            {
              (isDarkTheme) ?
                (<FontAwesomeIcon icon={faMoon} />)
                :
                (<FontAwesomeIcon icon={faSun} />)
            }
          </div>
        </div>
        <h1>Music Listening Times</h1>
        <div className="info-grid">
          <SearchFilter
            setDatalistSetting={setDatalistSetting}
            dispatchFilter={dispatchData}
            datalistSetting={datalistSetting}
            dataset={dataset}
          />
          <DayFilter dayFilter={dayFilter} dispatchFilter={dispatchData} dataset={dataset} />
          <button id="reset" className="button" onClick={() => dispatchData({ type: 'reset' })}><FontAwesomeIcon icon={faRedoAlt} flip="horizontal" /> Reset</button>
          {clickedPoint !== -1 && (
            <SongInfo
              clickedPoint={clickedPoint}
              dispatchFilter={dispatchData}
              setDatalistSetting={setDatalistSetting}
              data={dataset}
              entireDataset={entireDataset}
              timePeriod={timePeriod}
            />
          )}
        </div>
        <div className="time-settings">
          <div className="time-period">
            <TimePeriodButton value="monthly" />
            <TimePeriodButton value="yearly" />
          </div>
          <div className="side-container">
            <div id="entries">{(filteredDataset) ? filteredDataset.length : 0} entries</div>
            <DateNavigation
              month={month}
              year={year}
              timePeriod={timePeriod}
              timeRange={timeRange}
              yearList={yearList}
              dispatchData={dispatchData}
              datasetBuckets={datasetBuckets}
            />
          </div>
        </div>
        <div id="main">
          <Graph
            data={dataset}
            filteredData={filteredDataset}
            filterView={filterView}
            dispatchFilter={dispatchData}
            sampleDateString={`${month} 1 ${year}`}
            timePeriod={timePeriod}
            settings={(timePeriod === 'monthly') ? monthlySettings : yearlySettings}
          />
        </div>
      </div>
      <Datalist dataset={dataset} />
      <Settings
        dispatchMonth={dispatchMonth}
        dispatchYear={dispatchYear}
        monthlySettings={monthlySettings}
        yearlySettings={yearlySettings}
        timePeriod={timePeriod}
      />
    </div>
  );
}

export default Visualization;
