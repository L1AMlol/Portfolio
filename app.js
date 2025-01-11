let topZIndex = 5;
const windows = document.querySelectorAll('.window');
const desktop = document.querySelector('.desktop');
const dayTxt = document.querySelector('.day-text');
const dateTxt = document.querySelector('.date-text');
const timeTxt = document.querySelector('.time-text');
const startMenu = document.getElementById('start-menu');
const clockMenu = document.getElementById('clock-menu');
const volumeMenu = document.getElementById('volume-menu');

// ----------------------- Window -----------------------
let isHolding = false;

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

    isHolding = true;
    isDragging = true;
    offsetX = clientX - win.offsetLeft;
    offsetY = clientY - win.offsetTop;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  function mouseMove(e) {
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    if (isDragging) {
      let x = clientX - offsetX;
      let y = clientY - offsetY;

      // Ensure the window stays within the desktop bounds
      x = Math.max(0, Math.min(x, desktop.clientWidth - win.offsetWidth));
      y = Math.max(0, Math.min(y, desktop.clientHeight - win.offsetHeight));

      win.style.left = `${x}px`;
      win.style.top = `${y}px`;
    } else if (isResizing) {
      const deltaX = clientX - startMouseX;
      const deltaY = clientY - startMouseY;

      win.style.width = `${startWidth + deltaX}px`;
      win.style.height = `${startHeight + deltaY}px`;
    }
  }

  function mouseUp(e) {
    isHolding = false;
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

// ----------------------- open en close taskbar stuff -----------------------

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

// ----------------------- Timed events -----------------------

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
      'FEBRUARY',
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
  document.querySelector('.tray-icon-hour').innerHTML = `${
    dateInfo.hour < 10 ? '0' + String(dateInfo.hour) : dateInfo.hour
  }:${
    dateInfo.minutes < 10 ? '0' + String(dateInfo.minutes) : dateInfo.minutes
  }`;
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

// ----------------------- Selection Box -----------------------

function startSelectionbox(e) {
  document.querySelectorAll('.highlight').forEach((highlightedElement) => {
    highlightedElement.classList.remove('highlight');
  });

  if (e.target == desktop) return;
  if (e.target in [...document.querySelectorAll('.grid-spot')]) return;
  if (e.target == document.querySelector('.taskbar')) return;

  isSelecting = true;

  startX =
    e.type === 'touchstart'
      ? e.touches[0].clientX - desktop.offsetLeft
      : e.clientX - desktop.offsetLeft;
  startY =
    e.type === 'touchstart'
      ? e.touches[0].clientY - desktop.offsetTop
      : e.clientY - desktop.offsetTop;

  selectionBox = document.createElement('div');
  selectionBox.classList.add('selection-box');
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  desktop.appendChild(selectionBox);

  document.body.style.userSelect = 'none';
}

function moveSelectionbox(e) {
  if (!isSelecting & (document.querySelector('.selection-box') != null))
    desktop.removeChild(document.querySelector('.selection-box')); // if it glitches remove the selectionbox left behind
  if (!isSelecting || !selectionBox) return;
  if (finishedDragging & isSelecting) {
    endSelectionbox();
    finishedDragging = false;
    return;
  }
  if (isHolding && isSelecting) {
    endSelectionbox();
    return;
  }

  checkSelectionCollision();
  const currentX =
    e.type === 'touchmove'
      ? e.touches[0].clientX - desktop.offsetLeft
      : e.clientX - desktop.offsetLeft;
  const currentY =
    e.type === 'touchmove'
      ? e.touches[0].clientY - desktop.offsetTop
      : e.clientY - desktop.offsetTop;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionBox.style.left = `${Math.min(currentX, startX)}px`;
  selectionBox.style.top = `${Math.min(currentY, startY)}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
}

function endSelectionbox(e) {
  if (isSelecting) {
    isSelecting = false;
    if (selectionBox) {
      desktop.removeChild(selectionBox);
      selectionBox = null;
    }
    document.body.style.userSelect = '';
  }
}

function checkSelectionCollision() {
  if (!selectionBox) return;

  const selectionRect = selectionBox.getBoundingClientRect();
  const shortcuts = document.querySelectorAll('.desktop-shortcut');
  shortcuts.forEach((shortcut) => {
    const shortcutRect = shortcut.getBoundingClientRect();

    // Check if the selection box overlaps with the shortcut
    const isOverlapping = !(
      (
        selectionRect.right < shortcutRect.left || // No overlap on the right
        selectionRect.left > shortcutRect.right || // No overlap on the left
        selectionRect.bottom < shortcutRect.top || // No overlap on the bottom
        selectionRect.top > shortcutRect.bottom
      ) // No overlap on the top
    );

    if (isOverlapping) {
      shortcut.classList.add('highlight');
    } else {
      shortcut.classList.remove('highlight');
    }
  });
}

let isSelecting = false;
let selectionBox = null;
let startX = 0;
let startY = 0;

desktop.addEventListener('mousedown', startSelectionbox);
desktop.addEventListener('touchstart', startSelectionbox);

desktop.addEventListener('mousemove', moveSelectionbox);
desktop.addEventListener('touchmove', moveSelectionbox);

desktop.addEventListener('mouseup', endSelectionbox);
desktop.addEventListener('touchend', endSelectionbox);

document.addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    const allSelected = document.querySelectorAll('.highlight');
    allSelected.forEach((selected) => {
      openWindow(selected.getAttribute('data-target'));
    });
  }
});

// ----------------------- Grid -----------------------

let finishedDragging = false;

function calculateGrid(e) {
  const root = document.documentElement;
  const container = document.querySelector('.desktop-shortcuts');
  let containerRect = container.getBoundingClientRect();
  let spotSize = getComputedStyle(root).getPropertyValue('--spot-width');
  spotSize = spotSize.substring(0, spotSize.length - 2);

  let containerWidth = containerRect.width;
  let containerHeight = containerRect.height;

  const numberOfRows = Math.floor(containerHeight / spotSize);
  const numberOfCols = Math.floor(containerWidth / spotSize);

  container.style.gridTemplateRows = `repeat(${numberOfRows}, var(--spot-width))`;
  container.style.gridTemplateColumns = `repeat(${numberOfCols}, var(--spot-width))`;

  let html = '';
  for (i = 0; i < numberOfCols * numberOfRows; i++) {
    let addShortcut = '';
    if (i == 0) {
      addShortcut = `<button onclick="openWindow('AboutMe')" draggable="true" class="desktop-shortcut" data-target="AboutMe">About Me</button>`;
    } else if (i == numberOfCols) {
      addShortcut = `<button onclick="openWindow('Projects')" draggable="true" class="desktop-shortcut" data-target="Projects">Projects</button>`;
    } else if (i == numberOfCols * 2) {
      addShortcut = `<button onclick="openWindow('TODO')" draggable="true" class="desktop-shortcut" data-target="TODO">TODO</button>`;
    }
    html += `<div class="grid-spot" id="${i}">${addShortcut}</div>`;
  }
  container.innerHTML = html;
}

window.addEventListener('resize', calculateGrid);
calculateGrid();

const shortcuts = document.querySelectorAll('.desktop-shortcut');
const spots = document.querySelectorAll('.grid-spot');

shortcuts.forEach((shortcut) => {
  shortcut.addEventListener('dragstart', (e) => {
    shortcut.classList.add('dragging');
  });

  shortcut.addEventListener('dragend', (e) => {
    shortcut.classList.remove('dragging');
    finishedDragging = true;
  });
});

spots.forEach((spot) => {
  spot.addEventListener('dragover', (e) => {
    e.preventDefault();

    const shortcut = document.querySelector('.dragging');
    if (!spot.firstChild) {
      spot.appendChild(shortcut);
    }
  });
});
