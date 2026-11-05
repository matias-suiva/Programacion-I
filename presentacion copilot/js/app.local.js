/**
 * app.local.js
 * Universal standalone build for file:/// protocol execution.
 * Contains the identical MVC architecture (SlideModel, PresentationView, ControlsView, PresentationController)
 * wrapped in an IIFE to ensure 100% functionality when double-clicking HTML files directly in any browser
 * without hitting CORS origin 'null' restrictions.
 */

(function () {
  'use strict';

  // ==========================================================================
  // UTILS / HELPERS
  // ==========================================================================
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const padZero = (num, length = 2) => String(num).padStart(length, '0');

  // ==========================================================================
  // MODEL: SlideModel
  // ==========================================================================
  class SlideModel {
    constructor() {
      this.slides = [
        // 01. PORTADA
        {
          id: 'portada',
          number: 1,
          tag: 'ICOP Nº 4021 // COLOQUIO FINAL // 2026',
          title: 'Antropología Filosófica',
          subtitle: 'Ciberseguridad, ciberfraude e inteligencia artificial',
          layout: 'cover',
          image: 'assets/images/mask.jpg',
          academicMeta: {
            institution: 'Instituto Superior Particular Incorporado Nº 4021 ICOP',
            career: 'Tecnicatura Superior en Desarrollo de Software',
            subject: 'Antropología Filosófica',
            student: 'Suiva, Matias',
            professor: 'Roces, Gonzalo',
            year: 'Ciclo Lectivo 2026'
          }
        },

        // 02. INTRODUCCIÓN
        {
          id: 'introduccion',
          number: 2,
          tag: '01 // MARCO INTRODUCTORIO',
          title: 'De Herramienta a Hábitat Existencial',
          subtitle: 'La relación bidireccional entre el ser humano y los dispositivos digitales',
          layout: 'split',
          sections: [
            {
              index: '[01.1]',
              badge: 'PARADIGMA',
              title: 'El Espacio de la Vida Cotidiana',
              text: 'El entorno digital dejó de ser un simple conjunto de herramientas ocasionales: hoy es el <span class="highlight">espacio donde transcurre nuestra vida, relaciones y trabajo</span>. Nosotros diseñamos los dispositivos, pero estos reconfiguran la forma en que nos comunicamos, confiamos y percibimos la realidad.'
            },
            {
              index: '[01.2]',
              badge: 'TESIS CENTRAL',
              title: 'El Eslabón Vulnerable es Humano',
              text: 'La ciberseguridad impulsada por IA ya no es un asunto meramente técnico de código, firewalls o parches de servidor. Es un <span class="highlight">problema profundamente humano</span>, donde la manipulación de la conducta y la percepción constituyen la vulnerabilidad crítica.'
            }
          ]
        },

        // 03. EL PROBLEMA SELECCIONADO
        {
          id: 'problema-seleccionado',
          number: 3,
          tag: '02 // PROBLEMA SELECCIONADO',
          title: 'Evolución del Ciberfraude mediante IA',
          subtitle: 'La automatización de la manipulación y la simulación de la verdad',
          layout: 'split-media',
          image: 'assets/images/cyber-telemetry.jpg',
          imageCaption: 'CENTRO DE OPERACIONES // TELEMETRÍA DE AMENAZAS SINTÉTICAS',
          sections: [
            {
              index: '[02.1]',
              badge: 'VÍNCULO DISCIPLINAR',
              title: 'Más Allá del Código',
              text: 'En desarrollo de software la seguridad suele reducirse a firewalls y parches. La IA nos obliga a diseñar una <span class="highlight">seguridad centrada en la conducta</span> y verificación del usuario.'
            },
            {
              index: '[02.2]',
              badge: 'SALTO CUALITATIVO',
              title: 'De la Falta al Hiperrealismo',
              text: 'Las estafas previas fallaban por errores ortográficos y traducciones burdas. Los <span class="highlight">modelos LLM cambiaron las reglas</span>: eliminaron los indicios perceptibles de falsedad.'
            },
            {
              index: '[02.3]',
              badge: 'ANTROPOLOGÍA DIGITAL',
              title: '"Lo digital crea verdad"',
              text: 'El ciberfraude actual opera bajo la certeza de que <span class="highlight">"lo digital, sin ser real, crea verdad"</span>, operando directamente sobre la percepción humana.'
            }
          ]
        },

        // 04. NUEVAS AMENAZAS
        {
          id: 'nuevas-amenazas',
          number: 4,
          tag: '03 // VECTORES DE ATAQUE',
          title: 'Nuevas Amenazas Automatizadas',
          subtitle: 'El arsenal técnico potenciado por modelos generativos y algoritmos autónomos',
          layout: 'grid-2x2',
          sections: [
            {
              index: '[03.1]',
              badge: 'EMAIL // LLM',
              title: 'Phishing Hiperpersonalizado',
              text: 'La IA redacta correos electrónicos libres de errores, calibrando tono, vocabulario y registro institucional según el perfil psicológico y social de la víctima.'
            },
            {
              index: '[03.2]',
              badge: 'VOICE & BOTS',
              title: 'Smishing y Vishing Sintético',
              text: 'Bots de mensajería masiva por WhatsApp y llamadas con <span class="highlight">clonación de voz en tiempo real (deepfakes de audio)</span> extraídos de breves fragmentos de redes sociales.'
            },
            {
              index: '[03.3]',
              badge: 'EVASIÓN DE CÓDIGO',
              title: 'Malware Semi-Polimórfico',
              text: 'Código malicioso generado y mutado por algoritmos para alterar su estructura y firma casi automáticamente, eludiendo antivirus y defensas perimetrales.'
            },
            {
              index: '[03.4]',
              badge: 'RED & INFRAESTRUCTURA',
              title: 'Ataques DDoS Inteligentes',
              text: 'Enjambres distribuidos que adaptan sus patrones de tráfico en tiempo real mediante IA, modulando la presión hasta provocar el colapso de servidores.'
            }
          ]
        },

        // 05. CASO FERRARI 2024
        {
          id: 'caso-ferrari',
          number: 5,
          tag: '04 // CASO DE ESTUDIO',
          title: 'Incidente Ferrari (2024)',
          subtitle: 'Cuando la simulación de voz inorgánica confrontó la memoria compartida humana',
          layout: 'case-study',
          caseData: {
            steps: [
              {
                num: '1',
                title: 'La Llamada Infiltrada',
                desc: 'Un directivo de Ferrari recibió una llamada de quien parecía ser Benedetto Vigna, CEO de la compañía, solicitando una transferencia urgente de fondos.'
              },
              {
                num: '2',
                title: 'Clonación Sintética Exacta',
                desc: 'La IA reprodujo el tono, cadencia y timbre de voz del CEO con precisión quirúrgica, simulando una llamada confidencial verídica.'
              },
              {
                num: '3',
                title: 'La Sospecha Humana',
                desc: 'Pese al realismo del audio, el ejecutivo percibió un patrón sutil de anomalía y decidió someter la llamada a una prueba de validación personal.'
              },
              {
                num: '4',
                title: 'El Quiebre de la Máquina',
                desc: 'El directivo preguntó: "¿Cuál fue el libro que me recomendaste días atrás?". El clon de IA fue incapaz de responder y cortó la comunicación.'
              }
            ],
            conclusion: {
              title: 'Límite de la Simulación',
              text: 'Los sistemas inorgánicos procesan datos y simulan conductas en tiempo real, pero carecen de <span class="highlight">experiencia vital, contexto intersubjetivo y memoria relacional</span>. La sospecha crítica salvó la brecha.'
            }
          }
        },

        // 06. ANTROPOLOGÍA DIGITAL
        {
          id: 'antropologia-digital',
          number: 6,
          tag: '05 // FUNDAMENTO DISCIPLINAR',
          title: 'Antropología Digital y Mediación',
          subtitle: 'Tatiana Alexandra Cruz: La reconfiguración de la cotidianidad y el sesgo de autenticidad',
          layout: 'author-concept',
          author: {
            name: 'Tatiana Alexandra Cruz',
            pill: 'ETNOGRAFÍA & ANTROPOLOGÍA DIGITAL',
            concepts: [
              'Estudio de la relación humano-máquina de forma bidireccional: visibiliza los cambios provocados por el hombre en la tecnología y cómo la inserción técnica transforma al sujeto.',
              'Los dispositivos de seguridad y de IA no son instrumentos neutros, sino mediadores que reconfiguran activamente las prácticas, entidades y sujetos.'
            ]
          },
          impactBox: {
            title: 'Quiebre del "Sesgo de Autenticidad"',
            text: 'El ciberfraude mediado por IA destruye la confianza implícita en la voz o el texto. Nos obliga a <span class="highlight">dudar de audios de WhatsApp</span>, sospechar de comunicaciones legítimas e instaurar <span class="highlight">contraseñas familiares o palabras clave</span> de verificación íntima ante la sospecha permanente.'
          }
        },

        // 07. HARARI: LA VIDA INORGÁNICA
        {
          id: 'harari-inorganico',
          number: 7,
          tag: '06 // MARCO FILOSÓFICO // YUVAL NOAH HARARI',
          title: 'La Ruptura Biológica y la Profecía de Frankenstein',
          subtitle: 'El surgimiento de la vida inorgánica y la crisis ontológica de lo humano',
          layout: 'quote-split',
          author: 'Yuval Noah Harari',
          source: 'Sapiens: De animales a dioses (Capítulo 20: El fin de Homo sapiens)',
          quote: 'La revolución tecnológica está rompiendo las barreras biológicas tradicionales para dar paso a la creación de seres completamente inorgánicos.',
          cards: [
            {
              badge: 'ENTIDADES SINTÉTICAS',
              title: 'Códigos que Evolucionan',
              text: 'A diferencia de los organismos biológicos, la vida inorgánica emerge como programas, LLMs y algoritmos autónomos capaces de adaptarse, mutar y aprender en entornos computacionales.'
            },
            {
              badge: 'LA PROFECÍA DE FRANKENSTEIN',
              title: 'Transformación de la Conciencia',
              text: 'Harari anticipa que la interacción con entidades inorgánicas terminará transformando sustancialmente la conciencia, la identidad y las pautas relacionales, <span class="highlight">poniendo en crisis la definición misma de lo "humano"</span>.'
            }
          ]
        },

        // 08. HARARI: DIOSES IRRESPONSABLES
        {
          id: 'harari-dioses',
          number: 8,
          tag: '07 // ÉTICA TECNOLÓGICA // YUVAL NOAH HARARI',
          title: 'El Animal que se Convirtió en un Dios',
          subtitle: 'Poder de manipulación ilimitado sin responsabilidad moral',
          layout: 'quote-split',
          author: 'Yuval Noah Harari',
          source: 'Sapiens: De animales a dioses (Epílogo)',
          quote: 'La especie humana ha devenido en un dios irresponsable e insatisfecho: poseemos capacidades para manipular la realidad y crear simulaciones, pero actuamos sin responsabilidad moral ni objetivos claros.',
          cards: [
            {
              badge: 'SIMULACIÓN & ENGAÑO',
              title: 'La Irresponsabilidad del Engaño',
              text: 'Cuando la IA se pone al servicio de la suplantación de identidad y el fraude automatizado, se manifiesta esa misma irresponsabilidad tecnológica: capacidad creadora sin anclaje ético.'
            },
            {
              badge: 'INTERROGANTE EXISTENCIAL',
              title: '¿En qué deseamos convertirnos?',
              text: 'El dilema de la ciberseguridad con IA trasciende el desarrollo técnico. La pregunta fundamental no es qué tecnologías podemos inventar, sino <span class="highlight">en qué clase de seres deseamos convertirnos</span>.'
            }
          ]
        },

        // 09. BYUNG-CHUL HAN: INFOCRACIA
        {
          id: 'han-infocracia',
          number: 9,
          tag: '08 // FILOSOFÍA SOCIAL // BYUNG-CHUL HAN',
          title: 'De la Disciplina a la Infocracia',
          subtitle: 'El régimen de la información y la sustitución de la verdad por el efecto de verdad',
          layout: 'split',
          sections: [
            {
              index: '[08.1]',
              badge: 'CAMBIO DE RÉGIMEN',
              title: 'El Régimen de la Información',
              text: 'El antiguo régimen disciplinario que actuaba coactivamente sobre los cuerpos ha sido sustituido por un <span class="highlight">régimen de la información: la "Infocracia"</span>. El poder ya no exige sumisión física, sino la captura de datos, psicopolítica y viralidad algorítmica.'
            },
            {
              index: '[08.2]',
              badge: 'DESFACTIFICACIÓN',
              title: 'El "Efecto de Verdad" Instantáneo',
              text: 'La digitalización masiva destruye la facticidad y la conciencia de lo real. En el ciberataque con IA, <span class="highlight">el mensaje no necesita ser verídico</span>: basta con generar un efecto subjetivo de veracidad inmediato para manipular la conducta de la víctima.'
            }
          ]
        },

        // 10. BYUNG-CHUL HAN: SOCIEDAD DE LA DESCONFIANZA
        {
          id: 'han-panoptico',
          number: 10,
          tag: '09 // FILOSOFÍA SOCIAL // BYUNG-CHUL HAN',
          title: 'El Panóptico Digital y la Desconfianza',
          subtitle: 'Atrofia analítica, saturación de datos y el colapso del lazo interpersonal',
          layout: 'grid-3col',
          sections: [
            {
              index: '[09.1]',
              badge: 'FATIGA COGNITIVA',
              title: 'Atrofia Analítica',
              text: 'El tsunami incesante de información agota las defensas cognitivas. Incapaces de distinguir lo esencial de lo accesorio, los usuarios caen indefensos ante el sentido de urgencia explotado en las estafas virtuales.'
            },
            {
              index: '[09.2]',
              badge: 'CRISIS EPISTÉMICA',
              title: 'Información sin Verdad',
              text: 'Como postula Han en <em>La sociedad de la transparencia</em>: "El conjunto de información por sí solo no engendra ninguna verdad". La disponibilidad masiva disuelve la confianza y abre paso al control.'
            },
            {
              index: '[09.3]',
              badge: 'PANÓPTICO DIGITAL',
              title: 'Paranoia Preventiva',
              text: 'Al poder ser cualquier mensaje fabricado por un código inorgánico, la confianza social colapsa. La sociedad deviene en una red de vigilancia mutua forzada a verificar la autenticidad de cada interacción.'
            }
          ]
        },

        // 11. IMPACTO EN NOSOTROS
        {
          id: 'impacto-nosotros',
          number: 11,
          tag: '10 // ANÁLISIS DUAL',
          title: 'Impacto en Nosotros',
          subtitle: 'Consecuencias como usuarios cotidianos y responsabilidades como futuros desarrolladores',
          layout: 'comparison',
          columns: [
            {
              type: 'negative',
              badge: 'COMO USUARIOS // IMPACTO NEGATIVO',
              title: 'Alteración de la Cotidianidad',
              items: [
                'Quiebre del sesgo de autenticidad: un audio, llamada o correo ya no se perciben como genuinos por defecto.',
                'Imposición de protocolos de verificación personal: uso de palabras clave secretas entre familiares.',
                'Instalación de un estado de alerta y sospecha permanente en las interacciones más íntimas.'
              ]
            },
            {
              type: 'positive',
              badge: 'COMO DESARROLLADORES // IMPACTO POSITIVO',
              title: 'Hacia una Nueva Arquitectura Ética',
              items: [
                'Superación del enfoque reduccionista: la seguridad no es solo encriptar bases de datos o aislar redes.',
                'Arquitectura de software centrada en el factor humano y la resiliencia del usuario.',
                'Diseño de mecanismos de validación que protejan proactivamente frente a la manipulación cognitiva.'
              ]
            }
          ]
        },

        // 12. IMPACTO EN LA SOCIEDAD
        {
          id: 'impacto-sociedad',
          number: 12,
          tag: '11 // DIMENSIÓN SOCIAL',
          title: 'Impacto en la Sociedad',
          subtitle: 'Erosión del lazo social comunitario versus emergencia de conciencia crítica',
          layout: 'comparison',
          columns: [
            {
              type: 'negative',
              badge: 'RIESGOS SOCIALES // NEGATIVO',
              title: 'La Sociedad de la Desconfianza',
              items: [
                'Colapso de la confianza comunitaria cuando la identidad vocal y visual puede clonarse sin consentimiento.',
                'Explotación de la prisa, la falta de tiempo y el síndrome de fatiga de la información.',
                'Vulnerabilidad asimétrica: indefensión y pérdidas económicas críticas en adultos mayores y sectores con menor alfabetización digital.'
              ]
            },
            {
              type: 'positive',
              badge: 'RESPUESTAS SOCIALES // POSITIVO',
              title: 'Ciudadanía y Revalorización Humana',
              items: [
                'Catalizador ciudadano: demanda colectiva de regulaciones éticas y marcos normativos para la IA.',
                'Expansión de programas de formación comunitaria en Security Awareness.',
                'Retorno al valor de la presencialidad: rescate del diálogo directo y la confianza como construcción ética entre personas.'
              ]
            }
          ]
        },

        // 13. CONCLUSIONES
        {
          id: 'conclusiones',
          number: 13,
          tag: '12 // CONCLUSIONES FINALES',
          title: 'La Ciberseguridad como Dilema Antropológico',
          subtitle: 'De la protección del silicio a la defensa de la autonomía y el pensamiento crítico',
          layout: 'grid-3col',
          sections: [
            {
              index: '[12.1]',
              badge: 'CAMBIO DE FOCO',
              title: 'Más Allá del Código',
              text: 'El eslabón vulnerable no radica en el algoritmo ni en la infraestructura del servidor, sino en la <span class="highlight">capacidad de juicio y el sesgo de autenticidad</span> del usuario frente a la manipulación inorgánica.'
            },
            {
              index: '[12.2]',
              badge: 'RESPONSABILIDAD ÉTICA',
              title: 'La Praxis del Desarrollador',
              text: 'Los desarrolladores no operamos en un vacío neutro: debemos diseñar software que no solo persiga la eficiencia técnica, sino que promueva la transparencia, resguarde la autonomía y active la <span class="highlight">duda metódica</span>.'
            },
            {
              index: '[12.3]',
              badge: 'SÍNTESIS EPISTÉMICA',
              title: 'La Caverna Digital',
              text: 'El ciberfraude es síntoma de una época donde la saturación de datos y las entidades inorgánicas amenazan con transformarnos en <span class="highlight">"dioses irresponsables" dentro de una caverna digital</span>.'
            }
          ]
        },

        // 14. BIBLIOGRAFÍA
        {
          id: 'bibliografia',
          number: 14,
          tag: '13 // FUENTES & REFERENCIAS',
          title: 'Bibliografía y Fuentes Complementarias',
          subtitle: 'Corpus teórico de la materia e informes técnicos de ciberseguridad',
          layout: 'bibliography',
          theoretical: [
            {
              author: 'Harari, Yuval Noah (2014)',
              work: 'Sapiens. De animales a dioses: Breve historia de la humanidad.',
              detail: 'Capítulo 20: "El fin de Homo sapiens" / Epílogo: "El animal que se convirtió en un dios".'
            },
            {
              author: 'Han, Byung-Chul (2012 / 2013 / 2022)',
              work: 'La sociedad de la transparencia / En el enjambre / Infocracia: La digitalización y la crisis de la democracia.',
              detail: 'Análisis de la psicopolítica, la pérdida de la facticidad y el régimen de la información.'
            },
            {
              author: 'Cruz, Tatiana Alexandra',
              work: 'Antropología y Etnografía Digitales (Clases 08-10 y 29-10).',
              detail: 'Estudio bidireccional humano-máquina y mediación tecnológica en la vida cotidiana.'
            }
          ],
          technical: [
            {
              author: 'Caso Ferrari (2024)',
              work: 'Reportes periodísticos de Bloomberg y Página 12.',
              detail: 'Intento frustrado de estafa al directivo mediante clonación sintética de voz del CEO Benedetto Vigna.'
            },
            {
              author: 'Firmas de Ciberseguridad Global',
              work: 'Publicaciones e informes de CrowdStrike, Kaspersky y Palo Alto Networks.',
              detail: 'Campañas de phishing mediante LLMs, proliferación de malware semi-polimórfico y DDoS dirigidos por bots inteligentes.'
            }
          ]
        }
      ];
    }

    getSlides() { return this.slides; }
    getSlide(index) { return this.isValidIndex(index) ? this.slides[index] : null; }
    getTotal() { return this.slides.length; }
    isValidIndex(index) { return typeof index === 'number' && index >= 0 && index < this.slides.length; }
    getIndexById(id) { return this.slides.findIndex(s => s.id === id); }
  }

  // ==========================================================================
  // VIEW: PresentationView
  // ==========================================================================
  class PresentationView {
    constructor(viewportElement, terminalPathElement) {
      this.viewport = viewportElement;
      this.terminalPath = terminalPathElement;
      this.slideElements = [];
    }

    renderAllSlides(slides) {
      this.viewport.innerHTML = '';
      this.slideElements = slides.map((slideData) => {
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

    getSlideHtml(slide) {
      switch (slide.layout) {
        case 'cover': return this.renderCover(slide);
        case 'split': return this.renderSplit(slide);
        case 'split-media': return this.renderSplitMedia(slide);
        case 'grid-3col': return this.renderGrid3Col(slide);
        case 'grid-2x2': return this.renderGrid2x2(slide);
        case 'case-study': return this.renderCaseStudy(slide);
        case 'author-concept': return this.renderAuthorConcept(slide);
        case 'quote-split': return this.renderQuoteSplit(slide);
        case 'comparison': return this.renderComparison(slide);
        case 'bibliography': return this.renderBibliography(slide);
        default: return this.renderDefault(slide);
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

    showSlide(index, slideData) {
      this.slideElements.forEach((el, i) => {
        if (i === index) {
          el.classList.add('active');
          const titleEl = el.querySelector('.slide-title');
          if (titleEl) {
            titleEl.classList.remove('glitch-effect');
            void titleEl.offsetWidth;
            titleEl.classList.add('glitch-effect');
          }
        } else {
          el.classList.remove('active');
        }
      });

      if (this.terminalPath && slideData) {
        this.terminalPath.innerHTML = `fsociety://antropologia-filosofica/<span>slide-${padZero(slideData.number)}_${slideData.id}</span>`;
      }
    }
  }

  // ==========================================================================
  // VIEW: ControlsView
  // ==========================================================================
  class ControlsView {
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

      this.onNextCallback = null;
      this.onPrevCallback = null;
      this.onGoToCallback = null;
      this.onToggleFullscreenCallback = null;
    }

    bindEvents() {
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

      if (this.btnFullscreen) {
        this.btnFullscreen.addEventListener('click', () => {
          if (this.onToggleFullscreenCallback) this.onToggleFullscreenCallback();
        });
      }

      if (this.btnPrint) {
        this.btnPrint.addEventListener('click', () => {
          window.print();
        });
      }

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

      if (this.overviewModal) {
        this.overviewModal.addEventListener('click', (e) => {
          if (e.target === this.overviewModal) {
            this.closeOverview();
          }
        });
      }

      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        switch (e.key) {
          case 'ArrowRight':
          case 'PageDown':
          case ' ':
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

          case 'Escape':
            if (this.isOverviewOpen()) {
              e.preventDefault();
              this.closeOverview();
            }
            break;
        }
      });

      let touchStartX = 0;
      let touchEndX = 0;
      window.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      window.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 60) {
          if (diff < 0) {
            if (this.onNextCallback) this.onNextCallback();
          } else {
            if (this.onPrevCallback) this.onPrevCallback();
          }
        }
      }, { passive: true });
    }

    updateState(currentIndex, totalSlides) {
      if (this.slideCurrent) this.slideCurrent.textContent = padZero(currentIndex + 1);
      if (this.slideTotal) this.slideTotal.textContent = padZero(totalSlides);
      if (this.progressBarFill) {
        const percentage = ((currentIndex + 1) / totalSlides) * 100;
        this.progressBarFill.style.width = `${percentage}%`;
      }
      if (this.btnPrev) this.btnPrev.disabled = currentIndex === 0;
      if (this.btnNext) this.btnNext.disabled = currentIndex === totalSlides - 1;
      this.updateOverviewActive(currentIndex);
    }

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
          if (this.onGoToCallback) this.onGoToCallback(index);
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
      this.isOverviewOpen() ? this.closeOverview() : this.openOverview();
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

  // ==========================================================================
  // CONTROLLER: PresentationController
  // ==========================================================================
  class PresentationController {
    constructor(model, presentationView, controlsView) {
      this.model = model;
      this.presentationView = presentationView;
      this.controlsView = controlsView;
      this.currentIndex = 0;
    }

    init() {
      const slides = this.model.getSlides();
      this.presentationView.renderAllSlides(slides);
      this.controlsView.renderOverview(slides);

      this.controlsView.onNextCallback = () => this.next();
      this.controlsView.onPrevCallback = () => this.prev();
      this.controlsView.onGoToCallback = (index) => this.goTo(index);
      this.controlsView.onToggleFullscreenCallback = () => this.toggleFullscreen();
      this.controlsView.bindEvents();

      window.addEventListener('hashchange', () => this.handleHashChange());
      document.addEventListener('fullscreenchange', () => {
        this.controlsView.updateFullscreenButton(Boolean(document.fullscreenElement));
      });

      const initialIndex = this.getSlideIndexFromHash();
      this.goTo(initialIndex, false);
    }

    next() {
      if (this.currentIndex < this.model.getTotal() - 1) {
        this.goTo(this.currentIndex + 1);
      }
    }

    prev() {
      if (this.currentIndex > 0) {
        this.goTo(this.currentIndex - 1);
      }
    }

    goTo(index, updateHistory = true) {
      const validIndex = clamp(index, 0, this.model.getTotal() - 1);
      this.currentIndex = validIndex;
      const slideData = this.model.getSlide(this.currentIndex);

      this.presentationView.showSlide(this.currentIndex, slideData);
      this.controlsView.updateState(this.currentIndex, this.model.getTotal());

      if (updateHistory && slideData) {
        window.location.hash = `slide-${slideData.number}`;
      }
    }

    getSlideIndexFromHash() {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return 0;
      const match = hash.match(/^slide-(\d+)$/);
      if (match) {
        const slideNum = parseInt(match[1], 10);
        return clamp(slideNum - 1, 0, this.model.getTotal() - 1);
      }
      const indexById = this.model.getIndexById(hash);
      return indexById !== -1 ? indexById : 0;
    }

    handleHashChange() {
      const targetIndex = this.getSlideIndexFromHash();
      if (targetIndex !== this.currentIndex) {
        this.goTo(targetIndex, false);
      }
    }

    async toggleFullscreen() {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen request dismissed:', err);
      }
    }
  }

  // ==========================================================================
  // BOOTSTRAP
  // ==========================================================================
  function start() {
    const viewportEl = $('#slides-viewport');
    const terminalPathEl = $('#terminal-path');

    const model = new SlideModel();
    const presentationView = new PresentationView(viewportEl, terminalPathEl);
    const controlsView = new ControlsView();
    const controller = new PresentationController(model, presentationView, controlsView);

    controller.init();

    window.__fsocietyPresentation = {
      controller,
      model,
      presentationView,
      controlsView
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
