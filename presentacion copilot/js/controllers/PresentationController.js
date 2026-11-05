/**
 * PresentationController.js
 * Controller layer coordinating SlideModel, PresentationView, and ControlsView.
 * Implements SOLID principles with strict decoupling of data, rendering, and navigation.
 */

import { clamp } from '../utils/helpers.js';

export class PresentationController {
  /**
   * @param {SlideModel} model
   * @param {PresentationView} presentationView
   * @param {ControlsView} controlsView
   */
  constructor(model, presentationView, controlsView) {
    this.model = model;
    this.presentationView = presentationView;
    this.controlsView = controlsView;
    this.currentIndex = 0;
  }

  /**
   * Initialize presentation, views, and bindings
   */
  init() {
    const slides = this.model.getSlides();

    // Render slides into DOM
    this.presentationView.renderAllSlides(slides);

    // Render overview thumbnails in modal
    this.controlsView.renderOverview(slides);

    // Bind event callbacks from controls view
    this.controlsView.onNextCallback = () => this.next();
    this.controlsView.onPrevCallback = () => this.prev();
    this.controlsView.onGoToCallback = (index) => this.goTo(index);
    this.controlsView.onToggleFullscreenCallback = () => this.toggleFullscreen();
    this.controlsView.bindEvents();

    // Handle hash change from browser URL
    window.addEventListener('hashchange', () => this.handleHashChange());

    // Listen to fullscreen changes to update button icon/text
    document.addEventListener('fullscreenchange', () => {
      this.controlsView.updateFullscreenButton(Boolean(document.fullscreenElement));
    });

    // Read initial slide from URL hash if available (e.g., #slide-3)
    const initialIndex = this.getSlideIndexFromHash();
    this.goTo(initialIndex, false);
  }

  /**
   * Navigate to the next slide if available
   */
  next() {
    if (this.currentIndex < this.model.getTotal() - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  /**
   * Navigate to the previous slide if available
   */
  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  /**
   * Navigate to a specific slide by index
   * @param {number} index
   * @param {boolean} updateHistory
   */
  goTo(index, updateHistory = true) {
    const validIndex = clamp(index, 0, this.model.getTotal() - 1);
    this.currentIndex = validIndex;

    const slideData = this.model.getSlide(this.currentIndex);

    // Update presentation view
    this.presentationView.showSlide(this.currentIndex, slideData);

    // Update controls view
    this.controlsView.updateState(this.currentIndex, this.model.getTotal());

    // Update URL hash
    if (updateHistory && slideData) {
      window.location.hash = `slide-${slideData.number}`;
    }
  }

  /**
   * Parse slide index from current window.location.hash
   */
  getSlideIndexFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return 0;

    // Pattern #slide-X
    const match = hash.match(/^slide-(\d+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10);
      return clamp(slideNum - 1, 0, this.model.getTotal() - 1);
    }

    // Pattern by slide ID
    const indexById = this.model.getIndexById(hash);
    if (indexById !== -1) {
      return indexById;
    }

    return 0;
  }

  /**
   * Handle hash changes (back/forward browser buttons)
   */
  handleHashChange() {
    const targetIndex = this.getSlideIndexFromHash();
    if (targetIndex !== this.currentIndex) {
      this.goTo(targetIndex, false);
    }
  }

  /**
   * Toggle fullscreen mode using standard Fullscreen API
   */
  async toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed or was dismissed:', err);
    }
  }
}
