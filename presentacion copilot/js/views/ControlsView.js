/**
 * ControlsView.js
 * View layer managing interactive navigation controls, keyboard bindings,
 * progress bar, slide counter, and overview modal.
 */

import { $, $$, padZero } from '../utils/helpers.js';

export class ControlsView {
  constructor() {
    this.btnPrev = $('#btn-prev');
    this.btnNext = $('#btn-next');
    this.btnFullscreen = $('#btn-fullscreen');
    this.btnOverview = $('#btn-overview');
    this.btnPrint = $('#btn-print');
    this.btnOverviewClose = $('#btn-overview-close');
    this.slideCurrent = $('#slide-current');
    this.slideTotal = $('#slide-total');
    this.progressBarFill = $('#progress-bar-fill');
    this.overviewModal = $('#overview-modal');
    this.overviewGrid = $('#overview-grid');

    // Callbacks to be hooked by PresentationController
    this.onNextCallback = null;
    this.onPrevCallback = null;
    this.onGoToCallback = null;
    this.onToggleFullscreenCallback = null;
  }

  /**
   * Bind event listeners to DOM and keyboard
   */
  bindEvents() {
    // Navigation buttons
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        if (this.onNextCallback) this.onNextCallback();
      });
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        if (this.onPrevCallback) this.onPrevCallback();
      });
    }

    // Fullscreen toggle button
    if (this.btnFullscreen) {
      this.btnFullscreen.addEventListener('click', () => {
        if (this.onToggleFullscreenCallback) this.onToggleFullscreenCallback();
      });
    }

    // Print button
    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Overview modal toggles
    if (this.btnOverview) {
      this.btnOverview.addEventListener('click', () => {
        this.toggleOverview();
      });
    }

    if (this.btnOverviewClose) {
      this.btnOverviewClose.addEventListener('click', () => {
        this.closeOverview();
      });
    }

    // Close overview on clicking background backdrop
    if (this.overviewModal) {
      this.overviewModal.addEventListener('click', (e) => {
        if (e.target === this.overviewModal) {
          this.closeOverview();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Don't intercept if an input or textarea has focus
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ': // Spacebar
          e.preventDefault();
          if (this.onNextCallback) this.onNextCallback();
          break;

        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          if (this.onPrevCallback) this.onPrevCallback();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          if (this.onToggleFullscreenCallback) this.onToggleFullscreenCallback();
          break;

        case 'o':
        case 'O':
        case 'g':
        case 'G':
          e.preventDefault();
          this.toggleOverview();
          break;

        case 'p':
        case 'P':
          if (e.ctrlKey || e.metaKey) {
            // Let default print trigger
            return;
          }
          break;

        case 'Escape':
          if (this.isOverviewOpen()) {
            e.preventDefault();
            this.closeOverview();
          }
          break;

        default:
          break;
      }
    });

    // Touch swipe support for mobile or trackpads
    let touchStartX = 0;
    let touchEndX = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 60) {
        if (swipeDistance < 0) {
          // Swipe left -> Next
          if (this.onNextCallback) this.onNextCallback();
        } else {
          // Swipe right -> Prev
          if (this.onPrevCallback) this.onPrevCallback();
        }
      }
    }, { passive: true });
  }

  /**
   * Update controls state (buttons, counter, progress bar)
   */
  updateState(currentIndex, totalSlides) {
    if (this.slideCurrent) {
      this.slideCurrent.textContent = padZero(currentIndex + 1);
    }

    if (this.slideTotal) {
      this.slideTotal.textContent = padZero(totalSlides);
    }

    if (this.progressBarFill) {
      const percentage = ((currentIndex + 1) / totalSlides) * 100;
      this.progressBarFill.style.width = `${percentage}%`;
    }

    if (this.btnPrev) {
      this.btnPrev.disabled = currentIndex === 0;
    }

    if (this.btnNext) {
      this.btnNext.disabled = currentIndex === totalSlides - 1;
    }

    this.updateOverviewActive(currentIndex);
  }

  /**
   * Populate the overview modal grid with thumbnails of all slides
   */
  renderOverview(slides) {
    if (!this.overviewGrid) return;
    this.overviewGrid.innerHTML = '';

    slides.forEach((slide, index) => {
      const card = document.createElement('div');
      card.className = 'overview-thumbnail';
      card.dataset.index = index;
      card.innerHTML = `
        <div class="overview-thumb-index">[SLIDE ${padZero(slide.number)}]</div>
        <div class="overview-thumb-title">${slide.title}</div>
        <div class="overview-thumb-tag">${slide.tag}</div>
      `;

      card.addEventListener('click', () => {
        this.closeOverview();
        if (this.onGoToCallback) {
          this.onGoToCallback(index);
        }
      });

      this.overviewGrid.appendChild(card);
    });
  }

  updateOverviewActive(currentIndex) {
    if (!this.overviewGrid) return;
    const thumbs = $$('.overview-thumbnail', this.overviewGrid);
    thumbs.forEach((thumb, idx) => {
      if (idx === currentIndex) {
        thumb.classList.add('active-thumb');
      } else {
        thumb.classList.remove('active-thumb');
      }
    });
  }

  toggleOverview() {
    if (this.isOverviewOpen()) {
      this.closeOverview();
    } else {
      this.openOverview();
    }
  }

  openOverview() {
    if (this.overviewModal) {
      this.overviewModal.classList.add('open');
      this.overviewModal.setAttribute('aria-hidden', 'false');
    }
  }

  closeOverview() {
    if (this.overviewModal) {
      this.overviewModal.classList.remove('open');
      this.overviewModal.setAttribute('aria-hidden', 'true');
    }
  }

  isOverviewOpen() {
    return this.overviewModal && this.overviewModal.classList.contains('open');
  }

  updateFullscreenButton(isFullscreen) {
    if (this.btnFullscreen) {
      this.btnFullscreen.innerHTML = isFullscreen
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg> Salir`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg> Pantalla completa`;
    }
  }
}
