import { renderHook, act } from '@testing-library/react-hooks';
import useSettings from './SettingsLogic';

const initPointSettings = {
  default: { opacity: .3, radius: 3 },
  day: { opacity: .3, radius: 3 },
  search: { opacity: .5, radius: 5 },
  select: { opacity: .7, radius: 7 },
  hidden: { opacity: .05, radius: 3 },
  constant: { opacity: 1, radius: 1 },
};

test('useSettings', () => {
  const { result } = renderHook(useSettings);

  expect(result.current.pointSettings).toEqual(initPointSettings);

  // changing opacity
  const value = .5;
  act(() => {
    result.current.dispatchPointSettings({ setting: 'opacity', value: value });
  });
  for (const key of Object.keys(initPointSettings)) {
    expect(result.current.pointSettings[key].opacity).toBe(initPointSettings[key].opacity * value);
  }

  // changing radius
  act(() => {
    result.current.dispatchPointSettings({ setting: 'radius', value: value });
  });
  for (const key of Object.keys(initPointSettings)) {
    expect(result.current.pointSettings[key].opacity).toBe(initPointSettings[key].opacity * value);
  }

  // reset default
  act(() => {
    result.current.dispatchPointSettings({ mode: 'reset-point-settings' });
  });
  expect(result.current.pointSettings).toEqual(initPointSettings);
});
