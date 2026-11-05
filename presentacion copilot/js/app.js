/**
 * app.js
 * Application bootstrap file.
 * Initializes Model, Views, and Controller following strict MVC separation of concerns.
 */

import { SlideModel } from './models/SlideModel.js';
import { PresentationView } from './views/PresentationView.js';
import { ControlsView } from './views/ControlsView.js';
import { PresentationController } from './controllers/PresentationController.js';
import { $ } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const viewportEl = $('#slides-viewport');
  const terminalPathEl = $('#terminal-path');

  // Initialize MVC Components
  const model = new SlideModel();
  const presentationView = new PresentationView(viewportEl, terminalPathEl);
  const controlsView = new ControlsView();
  const controller = new PresentationController(model, presentationView, controlsView);

  // Start presentation
  controller.init();

  // Expose controller instance safely for debugging/console inspection if needed
  window.__fsocietyPresentation = {
    controller,
    model,
    presentationView,
    controlsView
  };
});
