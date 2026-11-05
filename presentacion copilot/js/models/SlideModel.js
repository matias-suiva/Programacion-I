/**
 * SlideModel.js
 * Model layer managing slide data, academic content, metadata, and slide queries.
 * Content derived exclusively from 'Trabajo Practico antropologia.pdf'.
 */

export class SlideModel {
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

  getSlides() {
    return this.slides;
  }

  getSlide(index) {
    if (this.isValidIndex(index)) {
      return this.slides[index];
    }
    return null;
  }

  getTotal() {
    return this.slides.length;
  }

  isValidIndex(index) {
    return typeof index === 'number' && index >= 0 && index < this.slides.length;
  }

  getIndexById(id) {
    return this.slides.findIndex(s => s.id === id);
  }
}
