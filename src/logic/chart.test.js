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
];

const dataset = fromisSongs.concat(wekiMekiSongs, dreamcatcherSongs, ohmygirlSongs);

describe('generate y state', () => {
  it('generates correct month y state given a date in a month', () => {
    expect(chart.generateYState(new Date('Jan 6 2021'), 'monthly'))
      .toEqual([new Date('Jan 31 2021'), new Date('Jan 1 2021')]);
  });

  it('generates correct month y state given the last date in a month', () => {
    expect(chart.generateYState(new Date('Feb 28 2021'), 'monthly'))
      .toEqual([new Date('Feb 28 2021'), new Date('Feb 1 2021')]);
  });

  it('generates correct month y state given first date in a month', () => {
    expect(chart.generateYState(new Date('Dec 1 2021'), 'monthly'))
      .toEqual([new Date('Dec 31 2021'), new Date('Dec 1 2021')]);
  });

  it('generates correct year y state given a date', () => {
    expect(chart.generateYState(new Date('Jan 20 2021'), 'yearly'))
      .toEqual([new Date('Dec 31 2021'), new Date('Jan 1 2021')]);
  });

  it('generates correct year y state given a date not in the most recent year', () => {
    expect(chart.generateYState(new Date('Feb 28 2020'), 'yearly'))
      .toEqual([new Date('Dec 31 2020'), new Date('Jan 1 2020')]);
  });

  it('generates correct year y state given the last date in a year', () => {
    expect(chart.generateYState(new Date('Dec 31 2021'), 'yearly'))
      .toEqual([new Date('Dec 31 2021'), new Date('Jan 1 2021')]);
  });

  it('generates correct year y state given the first date in a year ', () => {
    expect(chart.generateYState(new Date('Jan 1 2021'), 'yearly'))
      .toEqual([new Date('Dec 31 2021'), new Date('Jan 1 2021')]);
  });
});

describe('search filter', () => {
  it('filters by song title with multiple results', () => {
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
  });

  it('filters by song title with one result', () => {
    expect(chart.searchFilter('song', 'Siesta', dataset))
      .toEqual([
        {
          Song: 'Siesta',
          Artist: 'Weki Meki',
          Album: 'I AM ME',
          Day: 'Wednesday',
        },
      ])
  });

  it('shows no results when filtering by song title with no matching results', () => {
    expect(chart.searchFilter('song', 'Likey', dataset))
      .toEqual([]);
  });

  it('shows no results when filtering by song title with no input', () => {
    expect(chart.searchFilter('song', '', dataset))
      .toEqual([]);
  });

  it('filters by artist with multiple results', () => {
    expect(chart.searchFilter('artist', 'fromis_9', dataset))
      .toEqual(fromisSongs);
  });

  it('filters by artist with one result', () => {
    expect(chart.searchFilter('artist', 'Dreamcatcher', dataset))
      .toEqual(dreamcatcherSongs);
  });

  it('shows no results when filtering by artist with no matching results', () => {
    expect(chart.searchFilter('artist', 'TWICE', dataset))
      .toEqual([]);
  });

  it('shows no results when filtering by artist with no input', () => {
    expect(chart.searchFilter('artist', '', dataset))
      .toEqual([]);
  });

  it('filters by album with multiple results', () => {
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
  });

  it('filters by album with one result', () => {
    expect(chart.searchFilter('album', '[Summer Holiday]', dataset))
      .toEqual(dreamcatcherSongs);
  });

  it('shows no results when filtering by album with no matching results', () => {
    expect(chart.searchFilter('album', 'Twicetagram', dataset))
      .toEqual([]);
  });

  it('shows no results when filtering by album with no input', () => {
    expect(chart.searchFilter('album', '', dataset))
      .toEqual([]);
  });
});

describe('filter day', () => {
  const filter = {
    mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false,
  }

  it('doesnt filter any points when filtering with no days selected', () => {
    expect(chart.filterDay(filter, dataset))
      .toEqual(dataset);
  });

  it('filters by one selected day', () => {
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
  });

  it('filters by two selected days', () => {
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
  });

  it('filters by six selected days', () => {
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
      ]));
  });

  it('doesnt filter any points when filtering with all seven days selected', () => {
    filter.sun = true;
    expect(chart.filterDay(filter, dataset))
      .toEqual(expect.arrayContaining(dataset));
    expect(chart.filterDay(filter, dataset).length)
      .toBe(dataset.length);
  });
});

describe('get next month', () => {
  it('gets the next month given a month', () => {
    expect(chart.getNextMonth(3, 2021))
      .toEqual(new Date('April 2021'));
  });

  it('gets the next month given the last month of a year', () => {
    expect(chart.getNextMonth(12, 2021))
      .toEqual(new Date('Jan 2022'));
  });
});

describe('get prev month', () => {
  it('gets the prev month given a month', () => {
    expect(chart.getPrevMonth(3, 2021))
      .toEqual(new Date('Feb 2021'));
  });

  it('gets the prev month given the first month of a year', () => {
    expect(chart.getPrevMonth(1, 2021))
      .toEqual(new Date('Dec 2020'));
  });
});