let topZIndex = 5;
const windows = document.querySelectorAll('.window');
const desktop = document.querySelector('.desktop');
const dayTxt = document.querySelector('.day-text');
const dateTxt = document.querySelector('.date-text');
const timeTxt = document.querySelector('.time-text');
const startMenu = document.getElementById('start-menu');
const clockMenu = document.getElementById('clock-menu');
const volumeMenu = document.getElementById('volume-menu');

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

  // add window to the top when clicked
  win.addEventListener('mousedown', () => {
    clickedOutsideTaskbar();
    topZIndex += 1;
    win.style.zIndex = `${topZIndex}`;
  });

  // closes the window
  closeBtn.addEventListener('click', (e) => {
    win.classList.add('hidden');
  });

  // maximizes the window
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

  function mouseDown(e) {
    // Use the first touch point for touchscreen or the mouse event position
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    isDragging = true;
    offsetX = clientX - win.offsetLeft;
    offsetY = clientY - win.offsetTop;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  function mouseMove(e) {
    if (isDragging) {
      // Use the first touch point for touchscreen or the mouse event position
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      let x = clientX - offsetX;
      let y = clientY - offsetY;

      // Ensure the window stays within the desktop bounds
      x = Math.max(0, Math.min(x, desktop.clientWidth - win.offsetWidth));
      y = Math.max(0, Math.min(y, desktop.clientHeight - win.offsetHeight));

      win.style.left = `${x}px`;
      win.style.top = `${y}px`;
    } else if (isResizing) {
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startMouseX;
      const deltaY = clientY - startMouseY;

      win.style.width = `${startWidth + deltaX}px`;
      win.style.height = `${startHeight + deltaY}px`;
    }
  }

  function mouseUp(e) {
    isDragging = false;
    isResizing = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
  }

  function resize(e) {
    // Use the first touch point for touchscreen or the mouse event position
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    e.stopPropagation(); // Prevent triggering drag
    e.preventDefault(); // Prevent default actions (e.g., text selection)
    isResizing = true;
    startWidth = win.offsetWidth;
    startHeight = win.offsetHeight;
    startMouseX = clientX;
    startMouseY = clientY;
    document.body.style.cursor = 'se-resize';
  }

  function checkIfWindowsInView() {
    windows.forEach((win) => {
      const rect = win.getBoundingClientRect();
      let newLeft = parseInt(win.style.left || rect.left, 10);
      let newTop = parseInt(win.style.top || rect.top, 10);

      if (rect.right > desktop.clientWidth) {
        newLeft = Math.max(0, desktop.clientWidth - rect.width);
      }
      if (rect.bottom > desktop.clientHeight) {
        newTop = Math.max(0, desktop.clientHeight - rect.height);
      }
      if (rect.left < 0) {
        newLeft = 0;
      }
      if (rect.top < 0) {
        newTop = 0;
      }

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });
  }

  // Check if the window is still in vieuw after resizing and move it if not
  window.addEventListener('resize', checkIfWindowsInView);

  // initiate window move
  titleBar.addEventListener('mousedown', mouseDown);
  titleBar.addEventListener('touchstart', mouseDown);

  // move window
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('touchmove', mouseMove);

  // stop window move
  document.addEventListener('mouseup', mouseUp);
  document.addEventListener('touchend', mouseUp);

  // resize
  resizeHandle.addEventListener('mousedown', resize);
  resizeHandle.addEventListener('touchstart', resize);
});

function openTaskbarMenu(menuId) {
  const menu = document.getElementById(menuId);
  menu.classList.toggle('hidden');
  closeTaskbarMenu(menu);
}

function closeTaskbarMenu(menuId = null) {
  menus = [startMenu, clockMenu, volumeMenu];

  menus.forEach((menu) => {
    if (menu != menuId) {
      menu.classList.add('hidden');
    }
  });
}

function openStartMenu() {
  startMenu.classList.toggle('hidden');
}

function clickedOutsideTaskbar() {
  closeTaskbarMenu();
}

function openClock() {
  clockMenu.classList.toggle('hidden');
}

function getTimeData() {
  const date = new Date();
  const dateInfo = {
    day: date.getDay(),
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    hour: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    days: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    months: [
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
    ],
  };
  return dateInfo;
}

function formatCenterText(dateInfo) {
  let dateNumber =
    dateInfo.date < 10 ? '0' + `${dateInfo.date}` : `${dateInfo.date}`;
  let hour = dateInfo.hour < 10 ? '0' + `${dateInfo.hour}` : `${dateInfo.hour}`;
  let minutes =
    dateInfo.minutes < 10 ? '0' + `${dateInfo.minutes}` : `${dateInfo.minutes}`;
  let seconds =
    dateInfo.seconds < 10 ? '0' + `${dateInfo.seconds}` : `${dateInfo.seconds}`;

  dayTxt.innerHTML = dateInfo.days[dateInfo.day - 1];
  dateTxt.innerHTML = `${dateNumber} ${dateInfo.months[dateInfo.month]}, ${
    dateInfo.year
  }`;
  timeTxt.innerHTML = `- ${hour}:${minutes}:${seconds} -`;
}

function formatClockIcon(dateInfo) {
  document.querySelector(
    '.tray-icon-hour'
  ).innerHTML = `${dateInfo.hour}:${dateInfo.minutes}`;
  document.querySelector(
    '.tray-icon-date'
  ).innerHTML = `${dateInfo.date}/${dateInfo.month}/${dateInfo.year}`;
}

setInterval(() => {
  // runs every second
  dateInfo = getTimeData();
  formatCenterText(dateInfo);
  formatClockIcon(dateInfo);
}, 1000);
