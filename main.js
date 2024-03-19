import renderPage from './screen.js';

// Alert on errors globally
window.onerror = (message, url, line, col) => {
  // eslint-disable-next-line no-alert
  alert(
    `${message}\n At ${line}:${col} of ${url}. 

Please inform the author if you see this! This shouldn't happen.`,
  );
};

renderPage();
