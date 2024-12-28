let topZIndex = 5;
const windows = document.querySelectorAll('.window');
const desktop = document.querySelector('.desktop');
const dayTxt = document.querySelector('.day-text');
const dateTxt = document.querySelector('.date-text');
const timeTxt = document.querySelector('.time-text');

function openWindow(windowId) {
  const win = document.getElementById(windowId);
  win.classList.remove('hidden');
  topZIndex += 1;
  win.style.zIndex = `${topZIndex}`;
}

windows.forEach((win) => {
  const titleBar = win.querySelector('.title-bar');
  const closeBtn = win.querySelector('.close-btn');
  const maximizeBtn = win.querySelector('.maximize-btn');
  const resizeHandle = win.querySelector('.resize-handle');

  let isDragging = false;
  let isResizing = false;
  let offsetX, offsetY;
  let startWidth, startHeight;
  let startMouseX, startMouseY;
  let previousLeft = 0;
  let previousTop = 0;
  let previousWidth = 0;
  let previousHeight = 0;

  win.addEventListener('mousedown', () => {
    topZIndex += 1;
    win.style.zIndex = `${topZIndex}`;
  });

  closeBtn.addEventListener('click', (e) => {
    win.classList.add('hidden');
  });

  maximizeBtn.addEventListener('click', (e) => {
    win.classList.toggle('maximized');
    if (win.classList.contains('maximized')) {
      previousWidth = win.offsetWidth;
      previousHeight = win.offsetHeight;
      previousLeft = win.style.left;
      previousTop = win.style.top;

      win.style.top = 0;
      win.style.left = 0;
      win.style.width = '100vw';
      win.style.height = '100vh';
    } else {
      win.style.top = previousTop;
      win.style.left = previousLeft;
      win.style.width = `${previousWidth}px`;
      win.style.height = `${previousHeight}px`;
    }
  });

  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      // Ensure the window stays within the desktop bounds
      x = Math.max(0, Math.min(x, desktop.clientWidth - win.offsetWidth));
      y = Math.max(0, Math.min(y, desktop.clientHeight - win.offsetHeight));

      win.style.left = `${x}px`;
      win.style.top = `${y}px`;
    } else if (isResizing) {
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;

      win.style.width = `${startWidth + deltaX}px`;
      win.style.height = `${startHeight + deltaY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
  });

  resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation(); // Prevent triggering drag
    isResizing = true;
    startWidth = win.offsetWidth;
    startHeight = win.offsetHeight;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    document.body.style.cursor = 'se-resize';
  });
});

// format center text
setInterval(() => {
  // runs every second
  const date = new Date();
  const dateInfo = {
    day: date.getDay(),
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    hour: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
  const days = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];
  const months = [
    'JANUARY',
    'FEBUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  // if the number is a sigle digit add a 0 in front of it
  let dateNumber =
    dateInfo.date < 10 ? '0' + `${dateInfo.date}` : `${dateInfo.date}`;
  let hour = dateInfo.hour < 10 ? '0' + `${dateInfo.hour}` : `${dateInfo.hour}`;
  let minutes =
    dateInfo.minutes < 10 ? '0' + `${dateInfo.minutes}` : `${dateInfo.minutes}`;
  let seconds =
    dateInfo.seconds < 10 ? '0' + `${dateInfo.seconds}` : `${dateInfo.seconds}`;

  dayTxt.innerHTML = days[dateInfo.day];
  dateTxt.innerHTML = `${dateNumber} ${months[dateInfo.month]}, ${
    dateInfo.year
  }`;
  timeTxt.innerHTML = `- ${hour}:${minutes}:${seconds} -`;
}, 1000);
