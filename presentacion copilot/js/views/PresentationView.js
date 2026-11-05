/**
 * PresentationView.js
 * View layer responsible for rendering slide markup, handling DOM transitions,
 * and maintaining visual presentation integrity.
 */

import { $, $$, padZero } from '../utils/helpers.js';

export class PresentationView {
  constructor(viewportElement, terminalPathElement) {
    this.viewport = viewportElement;
    this.terminalPath = terminalPathElement;
    this.slideElements = [];
  }

  /**
   * Render all slides into the DOM once upon initialization
   */
  renderAllSlides(slides) {
    this.viewport.innerHTML = '';
    this.slideElements = slides.map((slideData, index) => {
      const slideEl = document.createElement('article');
      slideEl.className = 'slide';
      slideEl.id = `slide-${slideData.id}`;
      slideEl.setAttribute('role', 'region');
      slideEl.setAttribute('aria-roledescription', 'slide');
      slideEl.setAttribute('aria-label', `${slideData.number}: ${slideData.title}`);

      slideEl.innerHTML = this.getSlideHtml(slideData);
      this.viewport.appendChild(slideEl);
      return slideEl;
    });
  }

  /**
   * Select template generator based on layout
   */
  getSlideHtml(slide) {
    switch (slide.layout) {
      case 'cover':
        return this.renderCover(slide);
      case 'split':
        return this.renderSplit(slide);
      case 'split-media':
        return this.renderSplitMedia(slide);
      case 'grid-3col':
        return this.renderGrid3Col(slide);
      case 'grid-2x2':
        return this.renderGrid2x2(slide);
      case 'case-study':
        return this.renderCaseStudy(slide);
      case 'author-concept':
        return this.renderAuthorConcept(slide);
      case 'quote-split':
        return this.renderQuoteSplit(slide);
      case 'comparison':
        return this.renderComparison(slide);
      case 'bibliography':
        return this.renderBibliography(slide);
      default:
        return this.renderDefault(slide);
    }
  }

  renderHeader(slide) {
    return `
      <header class="slide-header animate-enter">
        <div class="slide-tag">
          <span class="status-dot-pulse"></span>
          <span>${slide.tag}</span>
        </div>
        <h2 class="slide-title">${slide.title}</h2>
        ${slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : ''}
      </header>
    `;
  }

  renderCover(slide) {
    const meta = slide.academicMeta;
    return `
      <div class="layout-cover">
        <div class="cover-image-container animate-enter">
          <img src="${slide.image}" alt="Máscara de fsociety y estética visual de Mr. Robot" class="cover-mask-image" />
        </div>
        <div class="cover-content animate-enter">
          <div class="cover-badge-top">
            <span class="status-dot-pulse"></span>
            <span>${slide.tag}</span>
          </div>
          <div class="cover-subject">${meta.subject}</div>
          <h1 class="cover-title">${slide.subtitle}</h1>
          <p class="cover-subtitle">La reconfiguración antropológica de la verdad, la confianza y la condición humana ante la inteligencia artificial generativa.</p>
          
          <div class="academic-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Alumno</span>
              <span class="meta-value">${meta.student}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Profesor</span>
              <span class="meta-value">${meta.professor}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Carrera</span>
              <span class="meta-value">${meta.career}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Institución</span>
              <span class="meta-value">${meta.institution}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSplit(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body layout-split">
        ${slide.sections.map(sec => `
          <div class="cyber-card card-accent interactive-card animate-enter">
            <div class="cyber-card-header">
              <span class="card-index">${sec.index}</span>
              <span class="card-badge badge-danger">${sec.badge}</span>
            </div>
            <h3 class="cyber-card-title">${sec.title}</h3>
            <p class="cyber-card-text">${sec.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSplitMedia(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; height: 100%; align-items: stretch;">
        <div style="display: flex; flex-direction: column; gap: 14px; justify-content: space-between;">
          ${slide.sections.map(sec => `
            <div class="cyber-card card-accent interactive-card animate-enter" style="padding: 14px 18px; flex: 1;">
              <div class="cyber-card-header" style="margin-bottom: 6px;">
                <span class="card-index">${sec.index}</span>
                <span class="card-badge badge-danger">${sec.badge}</span>
              </div>
              <h3 class="cyber-card-title" style="font-size: 1.05rem; margin-bottom: 6px;">${sec.title}</h3>
              <p class="cyber-card-text" style="font-size: 0.88rem; line-height: 1.45;">${sec.text}</p>
            </div>
          `).join('')}
        </div>
        <div class="animate-enter" style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
          <div style="position: relative; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-color); background: #000; height: 100%; max-height: 440px; display: flex; flex-direction: column;">
            <div style="position: relative; flex: 1; overflow: hidden;">
              <img src="${slide.image}" alt="Telemetría de ciberseguridad" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" />
              <div style="position: absolute; top: 12px; right: 12px; background: rgba(8, 9, 11, 0.85); border: 1px solid var(--border-active); padding: 4px 10px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--red-accent); border-radius: 2px;">
                ● LIVE THREAT MAP
              </div>
            </div>
            <div style="background-color: var(--bg-surface); padding: 10px 14px; border-top: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
              <span>${slide.imageCaption}</span>
              <span class="text-accent">[CRÍTICO]</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGrid3Col(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body layout-grid-3col">
        ${slide.sections.map(sec => `
          <div class="cyber-card card-accent interactive-card animate-enter">
            <div class="cyber-card-header">
              <span class="card-index">${sec.index}</span>
              <span class="card-badge badge-danger">${sec.badge}</span>
            </div>
            <h3 class="cyber-card-title">${sec.title}</h3>
            <p class="cyber-card-text">${sec.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderGrid2x2(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body layout-grid-2x2">
        ${slide.sections.map(sec => `
          <div class="cyber-card card-accent interactive-card animate-enter">
            <div class="cyber-card-header">
              <span class="card-index">${sec.index}</span>
              <span class="card-badge badge-danger">${sec.badge}</span>
            </div>
            <h3 class="cyber-card-title">${sec.title}</h3>
            <p class="cyber-card-text">${sec.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderCaseStudy(slide) {
    const data = slide.caseData;
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body case-study-grid">
        <div class="case-flow">
          ${data.steps.map(step => `
            <div class="flow-step animate-enter">
              <div class="flow-step-number">${step.num}</div>
              <div class="flow-step-content">
                <h4>${step.title}</h4>
                <p>${step.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="case-resolution-box animate-enter">
          <div>
            <div class="cover-badge-top">
              <span class="status-dot-pulse"></span>
              <span>VERIFICACIÓN RELACIONAL // 2024</span>
            </div>
            <h3 class="slide-title" style="font-size: 1.6rem; margin-bottom: 16px;">${data.conclusion.title}</h3>
            <p class="cyber-card-text" style="font-size: 1.05rem; line-height: 1.6;">
              ${data.conclusion.text}
            </p>
          </div>
          <div class="quote-box" style="margin-top: 20px;">
            <p class="quote-text" style="font-size: 1.05rem;">
              "No son solo herramientas: nos enfrentamos a sistemas inorgánicos capaces de adaptarse y simular el lenguaje, pero el factor humano quebró la ilusión."
            </p>
            <div class="quote-author">BENEDETTO VIGNA // INCIDENTE FERRARI</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAuthorConcept(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body layout-author">
        <div class="author-profile-card animate-enter">
          <span class="author-pill">${slide.author.pill}</span>
          <h3 class="author-name">${slide.author.name}</h3>
          <ul class="author-concept-list">
            ${slide.author.concepts.map(concept => `
              <li class="author-concept-item">${concept}</li>
            `).join('')}
          </ul>
        </div>
        <div class="cyber-card card-accent interactive-card animate-enter" style="height: 100%;">
          <div class="cyber-card-header">
            <span class="card-index">[TRANSFORMACIÓN]</span>
            <span class="card-badge badge-danger">SESGO COGNITIVO</span>
          </div>
          <h3 class="cyber-card-title">${slide.impactBox.title}</h3>
          <p class="cyber-card-text" style="font-size: 1rem; line-height: 1.6;">
            ${slide.impactBox.text}
          </p>
          <div class="cyber-card-footer">
            <span>MEDIACIÓN TECNOLÓGICA</span>
            <span class="text-accent">ESTADO DE ALERTA</span>
          </div>
        </div>
      </div>
    `;
  }

  renderQuoteSplit(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body" style="gap: 20px;">
        <div class="quote-box animate-enter">
          <p class="quote-text">"${slide.quote}"</p>
          <div class="quote-author">
            <span>${slide.author.toUpperCase()}</span>
            <span class="quote-source">// ${slide.source}</span>
          </div>
        </div>
        <div class="layout-split">
          ${slide.cards.map(c => `
            <div class="cyber-card card-accent interactive-card animate-enter">
              <div class="cyber-card-header">
                <span class="card-index">[FILOSOFÍA]</span>
                <span class="card-badge badge-danger">${c.badge}</span>
              </div>
              <h3 class="cyber-card-title">${c.title}</h3>
              <p class="cyber-card-text">${c.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderComparison(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body layout-comparison">
        ${slide.columns.map(col => `
          <div class="comparison-column ${col.type === 'negative' ? 'col-negative' : 'col-positive'} animate-enter">
            <div class="comparison-header">
              <h3 class="comparison-title">${col.title}</h3>
              <span class="card-badge ${col.type === 'negative' ? 'badge-danger' : 'badge-success'}">${col.badge}</span>
            </div>
            <ul class="comparison-list">
              ${col.items.map(item => `
                <li class="comparison-item">${item}</li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderBibliography(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body biblio-grid">
        <div class="biblio-card animate-enter">
          <h3 class="biblio-card-title">Marco Teórico y Filosófico</h3>
          <ul class="biblio-list">
            ${slide.theoretical.map(item => `
              <li class="biblio-item">
                <span class="biblio-author">${item.author}</span> — <em>${item.work}</em>
                <br /><span class="text-muted">${item.detail}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="biblio-card animate-enter">
          <h3 class="biblio-card-title">Fuentes de Ciberseguridad y Casos</h3>
          <ul class="biblio-list">
            ${slide.technical.map(item => `
              <li class="biblio-item">
                <span class="biblio-author">${item.author}</span> — <em>${item.work}</em>
                <br /><span class="text-muted">${item.detail}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  renderDefault(slide) {
    return `
      ${this.renderHeader(slide)}
      <div class="slide-body">
        <p class="cyber-card-text">${slide.subtitle || ''}</p>
      </div>
    `;
  }

  /**
   * Transition to a specific slide by index
   */
  showSlide(index, slideData) {
    this.slideElements.forEach((el, i) => {
      if (i === index) {
        el.classList.add('active');
        const titleEl = el.querySelector('.slide-title');
        if (titleEl) {
          titleEl.classList.remove('glitch-effect');
          void titleEl.offsetWidth; // Trigger reflow to restart CSS animation
          titleEl.classList.add('glitch-effect');
        }
      } else {
        el.classList.remove('active');
      }
    });

    // Update terminal path in top chrome
    if (this.terminalPath && slideData) {
      this.terminalPath.innerHTML = `fsociety://antropologia-filosofica/<span>slide-${padZero(slideData.number)}_${slideData.id}</span>`;
    }
  }
}
