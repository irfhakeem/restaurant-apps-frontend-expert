import 'regenerator-runtime'; /* for async await transpile */
import '../styles/main.css';
import '../styles/detail.css';

import App from './views/app';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    mainContent: document.querySelector('#mainContent'),
  });

  app.renderPage();

  window.addEventListener('hashchange', () => {
    app.renderPage();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');

  toggleButton.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggleButton.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
});

document.querySelector('.skip-link').addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('mainContent');
  mainContent.focus();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((error) => {
      console.error(error);
    });
  });
}
