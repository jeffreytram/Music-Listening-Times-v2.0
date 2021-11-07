import { useState, useEffect } from 'react';

function useDataset(datasetBuckets) {
  const [dataset, setDataset] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [timePeriod, setTimePeriod] = useState('monthly');

  useEffect(() => {
    if (datasetBuckets !== undefined && datasetBuckets.size > 0) {
      if (timePeriod === 'monthly') {
        setDataset(datasetBuckets.get(year)[month]);
        setMonth(month);
        setYear(year);
      } else if (timePeriod === 'yearly') {
        setDataset(datasetBuckets.get(year)['yearArr']);
        setYear(year);
      }
    }
  }, [month, year, timePeriod, datasetBuckets]);

  return { dataset, month, setMonth, year, setYear, timePeriod, setTimePeriod };
}

export default useDataset;