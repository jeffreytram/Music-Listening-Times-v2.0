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
    datasetBuckets, entireDataset, timeRange, yearList, loading
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
      {
        (loading) ?
          (
            <div id="loading">
              <div className="lds-dual-ring"></div>
              <h2>Loading...</h2>
            </div>
          )
          :
          (
            <>
              <div id="content-container">
                <div className="time-settings">
                  <div className="time-period">
                    <TimePeriodButton value="monthly" />
                    <TimePeriodButton value="yearly" />
                  </div>
                  <DateNavigation
                    month={month}
                    year={year}
                    timePeriod={timePeriod}
                    timeRange={timeRange}
                    yearList={yearList}
                    dispatchData={dispatchData}
                    datasetBuckets={datasetBuckets}
                  />
                  <div id="entries">{(filteredDataset) ? filteredDataset.length : 0} entries</div>
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
              <div className="side-options">
                <div className="info-grid">
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
                  <SearchFilter
                    setDatalistSetting={setDatalistSetting}
                    dispatchFilter={dispatchData}
                    datalistSetting={datalistSetting}
                    dataset={dataset}
                  />
                  <DayFilter dayFilter={dayFilter} dispatchFilter={dispatchData} dataset={dataset} />
                  <button id="reset" className="button" onClick={() => dispatchData({ type: 'reset' })}><FontAwesomeIcon icon={faRedoAlt} flip="horizontal" /> Reset</button>
                </div>
                <Settings
                  dispatchMonth={dispatchMonth}
                  dispatchYear={dispatchYear}
                  monthlySettings={monthlySettings}
                  yearlySettings={yearlySettings}
                  timePeriod={timePeriod}
                />
              </div>
              <Datalist dataset={dataset} />
              <div id="corner-options-container">
                <label htmlFor="file-upload" className="corner-option button">
                  <FontAwesomeIcon icon={faUpload} />
                </label>
                <input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload}></input>
                <div className="button corner-option" onClick={() => setIsDarkTheme(!isDarkTheme)}>
                  {
                    (isDarkTheme) ?
                      (<FontAwesomeIcon icon={faMoon} />)
                      :
                      (<FontAwesomeIcon icon={faSun} />)
                  }
                </div>
              </div>
            </>
          )
      }
    </div>
  );
}

export default Visualization;
