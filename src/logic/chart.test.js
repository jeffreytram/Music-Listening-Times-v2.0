const chart = require('./chart');

const fromisSongs = [
  {
    Song: 'WE GO',
    Artist: 'fromis_9',
    Album: '9 WAY TICKET',
    Day: 'Monday',
  },
  {
    Song: 'Airplane Mode',
    Artist: 'fromis_9',
    Album: '9 WAY TICKET',
    Day: 'Monday',
  },
  {
    Song: 'LOVE BOMB',
    Artist: 'fromis_9',
    Album: 'From.9',
    Day: 'Tuesday',
  },
  {
    Song: 'WE GO',
    Artist: 'fromis_9',
    Album: '9 WAY TICKET',
    Day: 'Saturday',
  },
  {
    Song: 'Airplane Mode',
    Artist: 'fromis_9',
    Album: '9 WAY TICKET',
    Day: 'Saturday',
  },
];

const wekiMekiSongs = [
  {
    Song: 'Siesta',
    Artist: 'Weki Meki',
    Album: 'I AM ME',
    Day: 'Wednesday',
  },
  {
    Song: 'Luminous',
    Artist: 'Weki Meki',
    Album: 'I AM ME',
    Day: 'Thursday',
  },
];

const dreamcatcherSongs = [{
  Song: 'BEcause',
  Artist: 'Dreamcatcher',
  Album: '[Summer Holiday]',
  Day: 'Friday',
}];

const ohmygirlSongs = [
  {
    Song: 'Nonstop',
    Artist: 'OH MY GIRL',
    Album: 'NONSTOP',
    Day: 'Sunday',
  },
  {
    Song: 'Nonstop',
    Artist: 'OH MY GIRL',
    Album: 'NONSTOP',
    Day: 'Sunday',
  },
  {
    Song: 'Nonstop',
    Artist: 'OH MY GIRL',
    Album: 'NONSTOP',
    Day: 'Sunday',
  },
  {
    Song: 'Dun Dun Dance',
    Artist: 'OH MY GIRL',
    Album: 'Dear OHMYGIRL',
    Day: 'Monday',
  },
]

const dataset = fromisSongs.concat(wekiMekiSongs, dreamcatcherSongs, ohmygirlSongs);

test('generate y state', () => {
  expect(chart.generateYState(new Date('Jan 6 2021'), 'monthly'))
    .toEqual([new Date('Jan 31 2021'), new Date('Jan 1 2021')]);

  expect(chart.generateYState(new Date('Feb 28 2021'), 'monthly'))
    .toEqual([new Date('Feb 28 2021'), new Date('Feb 1 2021')]);

  expect(chart.generateYState(new Date('Dec 1 2021'), 'monthly'))
    .toEqual([new Date('Dec 31 2021'), new Date('Dec 1 2021')]);


  expect(chart.generateYState(new Date('Jan 6 2021'), 'yearly'))
    .toEqual([new Date('Dec 31 2021'), new Date('Jan 1 2021')]);

  expect(chart.generateYState(new Date('Feb 28 2020'), 'yearly'))
    .toEqual([new Date('Dec 31 2020'), new Date('Jan 1 2020')]);

  expect(chart.generateYState(new Date('Dec 1 2021'), 'yearly'))
    .toEqual([new Date('Dec 31 2021'), new Date('Jan 1 2021')]);
});

test('search filter', () => {
  // song multi match
  expect(chart.searchFilter('song', 'WE GO', dataset))
    .toEqual([
      {
        Song: 'WE GO',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'WE GO',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Saturday',
      },
    ]);

  // song single match
  expect(chart.searchFilter('song', 'Siesta', dataset))
    .toEqual([
      {
        Song: 'Siesta',
        Artist: 'Weki Meki',
        Album: 'I AM ME',
        Day: 'Wednesday',
      },
    ]);

  // song no match
  expect(chart.searchFilter('song', 'Likey', dataset))
    .toEqual([]);

  // song no input
  expect(chart.searchFilter('song', '', dataset))
    .toEqual([]);



  // artist multi match
  expect(chart.searchFilter('artist', 'fromis_9', dataset))
    .toEqual(fromisSongs);

  // artist single match
  expect(chart.searchFilter('artist', 'Dreamcatcher', dataset))
    .toEqual(dreamcatcherSongs);

  // artist no match
  expect(chart.searchFilter('artist', 'TWICE', dataset))
    .toEqual([]);

  // artist no input
  expect(chart.searchFilter('artist', '', dataset))
    .toEqual([]);


  // album multi match
  expect(chart.searchFilter('album', '9 WAY TICKET', dataset))
    .toEqual([
      {
        Song: 'WE GO',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'Airplane Mode',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'WE GO',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Saturday',
      },
      {
        Song: 'Airplane Mode',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Saturday',
      },
    ]);

  // album single match
  expect(chart.searchFilter('album', '[Summer Holiday]', dataset))
    .toEqual(dreamcatcherSongs);

  // album no match
  expect(chart.searchFilter('album', 'Twicetagram', dataset))
    .toEqual([]);

  // album no input
  expect(chart.searchFilter('album', '', dataset))
    .toEqual([]);
});

test('filter day', () => {
  const filter = {
    mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false,
  }

  // no day filters
  expect(chart.filterDay(filter, dataset))
    .toEqual(dataset);

  // 1 day filter
  filter.mon = true;
  expect(chart.filterDay(filter, dataset))
    .toEqual([
      {
        Song: 'WE GO',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'Airplane Mode',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'Dun Dun Dance',
        Artist: 'OH MY GIRL',
        Album: 'Dear OHMYGIRL',
        Day: 'Monday',
      },
    ]);

  // 2 day filters
  filter.tue = true;
  expect(chart.filterDay(filter, dataset))
    .toEqual([
      {
        Song: 'WE GO',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'Airplane Mode',
        Artist: 'fromis_9',
        Album: '9 WAY TICKET',
        Day: 'Monday',
      },
      {
        Song: 'Dun Dun Dance',
        Artist: 'OH MY GIRL',
        Album: 'Dear OHMYGIRL',
        Day: 'Monday',
      },
      {
        Song: 'LOVE BOMB',
        Artist: 'fromis_9',
        Album: 'From.9',
        Day: 'Tuesday',
      },
    ]);

  // 6 day filters
  filter.wed = true;
  filter.thu = true;
  filter.fri = true;
  filter.sat = true;
  expect(chart.filterDay(filter, dataset))
    .toEqual(expect.arrayContaining([
      ...fromisSongs,
      ...wekiMekiSongs,
      ...dreamcatcherSongs,
      {
        Song: 'Dun Dun Dance',
        Artist: 'OH MY GIRL',
        Album: 'Dear OHMYGIRL',
        Day: 'Monday',
      },
    ]));
  expect(chart.filterDay(filter, dataset))
    .toEqual(expect.not.arrayContaining([
      {
        Song: 'Nonstop',
        Artist: 'OH MY GIRL',
        Album: 'NONSTOP',
        Day: 'Sunday',
      },
      {
        Song: 'Nonstop',
        Artist: 'OH MY GIRL',
        Album: 'NONSTOP',
        Day: 'Sunday',
      },
      {
        Song: 'Nonstop',
        Artist: 'OH MY GIRL',
        Album: 'NONSTOP',
        Day: 'Sunday',
      },
    ]))

  // all day filters
  filter.sun = true;
  expect(chart.filterDay(filter, dataset))
    .toEqual(expect.arrayContaining(dataset));
  expect(chart.filterDay(filter, dataset).length)
    .toBe(dataset.length);
});

test('get next month', () => {
  // next month
  expect(chart.getNextMonth(3, 2021))
    .toEqual(new Date('April 2021'));

  // next month into new year
  expect(chart.getNextMonth(12, 2021))
    .toEqual(new Date('Jan 2022'));

});

test('get prev month', () => {
  // prev month
  expect(chart.getPrevMonth(3, 2021))
    .toEqual(new Date('Feb 2021'));

  // prev month into prev year
  expect(chart.getPrevMonth(1, 2021))
    .toEqual(new Date('Dec 2020'));
});