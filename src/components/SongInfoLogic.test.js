import { renderHook } from '@testing-library/react-hooks';
import { useSongInfo } from './SongInfoLogic';

const sampleProcessedDataset = require('../TestProcessedDataset.json').dataset;
// NOTE: the data type of the actual bucket key is a number
// string year is used for the sample instead
const sampleBuckets = new Map(Object.entries(require('../TestBuckets.json')));

describe('useSongInfo', () => {
  const testCase = (result, left, right, pointID) => {
    expect(result.current.leftArrowVisibility).toBe(left);
    expect(result.current.rightArrowVisibility).toBe(right);
    expect(result.current.point).toEqual(sampleProcessedDataset[pointID]);
  };
  const { result, rerender } = renderHook(({ clickedPoint, data, entireDataset, timePeriod }) =>
    useSongInfo(clickedPoint, data, entireDataset, timePeriod),
    {
      initialProps: {
        clickedPoint: 105,
        data: sampleBuckets.get('2021')['10'],
        entireDataset: sampleProcessedDataset,
        timePeriod: 'monthly',
      }
    }
  );

  it('shows both left and right arrows for a point in monthly view', () => {
    testCase(result, '', '', 105);
  });
  it('hides the left and shows the right arrow for the first point in monthly view', () => {
    rerender({
      clickedPoint: 118,
      data: sampleBuckets.get('2021')['10'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'monthly',
    });
    testCase(result, 'disabled-arrow', '', 118);
  });
  it('shows the left and hides the right arrow for the last point in monthly view', () => {
    rerender({
      clickedPoint: 58,
      data: sampleBuckets.get('2021')['10'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'monthly',
    });
    testCase(result, '', 'disabled-arrow', 58);
  });
  it('shows both left and right arrows for a point in yearly view', () => {
    rerender({
      clickedPoint: 792,
      data: sampleBuckets.get('2020')['yearArr'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'yearly',
    });
    testCase(result, '', '', 792);
  });
  it('hides the left and shows the right arrow for the first point in yearly view', () => {
    rerender({
      clickedPoint: 1231,
      data: sampleBuckets.get('2020')['yearArr'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'yearly',
    });
    testCase(result, 'disabled-arrow', '', 1231);
  });
  it('shows the left and hides the right arrow for the last point in yearly view', () => {
    rerender({
      clickedPoint: 573,
      data: sampleBuckets.get('2020')['yearArr'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'yearly',
    });
    testCase(result, '', 'disabled-arrow', 573);
  });
  it('shows both the left and right arrows for the first point of the month that isnt the first point of the year', () => {
    rerender({
      clickedPoint: 979,
      data: sampleBuckets.get('2020')['yearArr'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'yearly',
    });
    testCase(result, '', '', 979);
  });
  it('shows both the left and right arrows for the last point of the month that isnt the last point of the year', () => {
    rerender({
      clickedPoint: 929,
      data: sampleBuckets.get('2020')['yearArr'],
      entireDataset: sampleProcessedDataset,
      timePeriod: 'yearly',
    });
    testCase(result, '', '', 929);
  });
});
