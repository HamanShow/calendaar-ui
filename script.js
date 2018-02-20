'use strict';

const nextButton = $('#next_button');
const prevButton = $('#prev_button');
const calendarBody = $('#calendar tbody');
const textYear = $('#calendar_heading .year');
const textMonth = $('#calendar_heading .month');
const days = [
  {jp: '月', en: 'mon'},
  {jp: '火', en: 'tue'},
  {jp: '水', en: 'wed'},
  {jp: '木', en: 'thu'},
  {jp: '金', en: 'fri'},
  {jp: '土', en: 'sat'},
  {jp: '日', en: 'sun'}
];
const today = new Date();
const current = {
  year: today.getFullYear(),
  month: today.getMonth()
};

function setCols(count, row, cols, args, callback) {
  let td;
  if (row === 0 && args.startDay === count) {
    args.textSkip = false;
  } 
  if (args.textDate > args.endDay) {
    args.textSkip = true;
  } 
  if (args.textSkip) {
    td = '<td class="col sp-none">&nbsp;</td>';
  } else {
    td = '<td class="col defined ' + days[count].en + '"><div class="text-date">' + args.textDate + '<span class="pc-none">(' + days[count].jp + ')</span></div><div class="text-schedule"></div></td>';
    args.textDate++;
  }
  cols += td;
  count++;
  if (count < days.length) {
    setCols(count, row, cols, args, callback);
  } else {
    callback(null, cols);
  }
}

function setRows(count, rows, args, callback) {
  let cols;
  setCols(0, count, cols, args, function(err, res) {
    if (err) {
      callback(err);
    } else {
      rows += '<tr>' + res + '</tr>';
    }
  });
  count++;
  if (count < args.maxRow) {
    setRows(count, rows, args, callback);
  } else {
    callback(null, rows);
  }
}

function createCalendarBody(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  let startDay = startDate.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  const endDay = endDate.getDate();
  const maxCol = startDay + endDay;
  const maxRow = maxCol % 7 === 0 ? Math.floor(maxCol / 7) : Math.floor(maxCol / 7) + 1;
  const args = {
    startDate: startDate,
    endDate: endDate,
    startDay: startDay,
    endDay: endDay,
    maxRow: maxRow,
    textDate: 1,
    textSkip: true
  };
  let rows = '';
  setRows(0, rows, args, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      calendarBody.html(res);
    }
  });
}

function createCalendar(year, month) {
  textYear.text(year);
  textMonth.text(month + 1);
  current.year = year;
  current.month = month;
  createCalendarBody(year, month);
}

function setCurrentYearAndMonth(year, month, nextOrPrev) {
  if (nextOrPrev) {
    if (month < 11) {
      month++;
    } else {
      year++;
      month = 0;
    }
  } else {
    if (month > 0) {
      month--;
    } else {
      year--;
      month = 11;
    }
  }
  createCalendar(year, month);
}

$(window).on('load', function(){
  createCalendar(current.year, current.month);
});

nextButton.click(function() {
  setCurrentYearAndMonth(current.year, current.month, true);
});

prevButton.click(function() {
  setCurrentYearAndMonth(current.year, current.month, false);
});
