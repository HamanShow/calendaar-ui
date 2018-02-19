'use strict';

const nextButton = $('#next_button');
const prevButton = $('#prev_button');
const calendarBody = $('#calendar tbody');
const textYear = $('#calendar_heading .year');
const textMonth = $('#calendar_heading .month');
const daysJp = ['月', '火', '水', '木', '金', '土', '日'];
const daysEn = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const today = new Date();
const current = {
  year: undefined,
  month: undefined
};

function createCalendarBody(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  let startDay = startDate.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  const endDay = endDate.getDate();
  let textSkip = true;
  let textDate = 1;
  const maxCol = startDay + endDay;
  const maxRow = maxCol % 7 === 0 ? Math.floor(maxCol / 7) : Math.floor(maxCol / 7) + 1;
  let tableBody = '';
  
  for (let row = 0; row < maxRow; row++) {
    let tr = '<tr>';
    
    for (let col = 0; col < 7; col++) {
      if (row === 0 && startDay === col) {
        textSkip = false;
      } 
      if (textDate > endDay) {
        textSkip = true;
      } 
      let td;
      if (textSkip) {
        td = '<td class="col sp-none">&nbsp;</td>';
      } else {
        td = '<td class="col defined ' + daysEn[col] + '"><div class="text-date">' + textDate + '<span class="pc-none">(' + daysJp[col] + ')</span></div><div class="text-schedule"></div></td>';
        textDate++;
      }
      tr += td;
    }
    tr += '</tr>';
    tableBody += tr;
  }
  calendarBody.html(tableBody);
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
  createCalendar(today.getFullYear(), today.getMonth());
});

nextButton.click(function() {
  setCurrentYearAndMonth(current.year, current.month, true);
});

prevButton.click(function() {
  setCurrentYearAndMonth(current.year, current.month, false);
});
