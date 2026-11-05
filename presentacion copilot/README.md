# Presentación Web — Antropología Filosófica
## Ciberseguridad, Ciberfraude e Inteligencia Artificial
### La reconfiguración antropológica de la verdad, la confianza y la condición humana

---

### Datos Académicos
- **Institución:** Instituto Superior Particular Incorporado Nº 4021 ICOP Santa Fe
- **Carrera:** Tecnicatura Superior en Desarrollo de Software
- **Materia:** Antropología Filosófica
- **Profesor:** Roces, Gonzalo
- **Alumno:** Suiva, Matias
- **Ciclo Lectivo:** 2026

---

## 1. Descripción del Proyecto

Aplicación web interactiva desarrollada con **HTML5 semántico, CSS3 modular y JavaScript vanilla (ES Modules)**, estructurada bajo una arquitectura **MVC (Modelo-Vista-Controlador)** y aplicando principios **SOLID**.

Diseñada para la exposición y defensa del 2do. Examen Parcial / Coloquio Final Integrador.

- **Contenido académico:** Proviene **exclusivamente** del documento de investigación `Trabajo Practico antropologia.pdf`.
- **Identidad visual:** Inspirada en la atmósfera cinematográfica, oscura, minimalista y tecnológica de *Mr. Robot* (terminales Unix, fondos negros profundos, detalles en rojo carmesí, scanlines analógicas sutiles y espacios negativos).

---

## 2. Cómo Ejecutar la Presentación

La aplicación cuenta con compatibilidad universal:

### Opción A (Doble clic directo - Sin servidor)
Simplemente hacé doble clic sobre `index.html` o `presentacion.html` en el explorador de archivos de Windows. El cargador inteligente detecta el protocolo `file:///` y ejecuta la presentación sin errores de CORS.

### Opción B (Servidor Local de Desarrollo)
Si usás VS Code o Antigravity, podés abrirlo con la extensión **Live Server** o cualquier servidor HTTP local:
```bash
# Ejemplo con npx serve (si contás con Node)
npx serve .
```

---

## 3. Controles y Atajos de Teclado

| Tecla / Control | Acción |
| :--- | :--- |
| `→` / `Espacio` / `AvPág` | Avanzar a la siguiente diapositiva |
| `←` / `RePág` | Retroceder a la diapositiva anterior |
| `F` | Alternar modo pantalla completa (*Fullscreen*) |
| `O` o `G` | Abrir / Cerrar el índice general de diapositivas |
| `ESC` | Cerrar modal de índice o salir de pantalla completa |
| `Ctrl + P` o botón `PDF` | Exportar o imprimir a PDF con estilos optimizados |
| `Swipe horizontal` | Navegación táctil para pantallas táctiles o tablets |

---

## 4. Estructura de Diapositivas (16:9)

1. **Portada:** Antropología Filosófica, título del trabajo, máscara de fsociety estilizada y datos del alumno e institución.
2. **De Herramienta a Hábitat Existencial:** Relación bidireccional humano-máquina y el factor humano como eslabón vulnerable.
3. **Evolución del Ciberfraude mediante IA:** Salto cualitativo con LLMs, telemetría de amenazas y el principio *"lo digital crea verdad"*.
4. **Nuevas Amenazas Automatizadas:** Phishing hiperpersonalizado, Smishing/Vishing sintético, Malware semi-polimórfico y DDoS inteligente.
5. **Caso Emblemático Ferrari (2024):** Intento de fraude con clonación de voz de Benedetto Vigna y el quiebre de la simulación ante la memoria humana.
6. **Antropología Digital (Tatiana Alexandra Cruz):** Mediación tecnológica y la ruptura del *sesgo de autenticidad*.
7. **Yuval Noah Harari I:** Emergencia de entidades inorgánicas y la *Profecía de Frankenstein*.
8. **Yuval Noah Harari II:** El animal que se convirtió en un *"dios irresponsable e insatisfecho"*.
9. **Byung-Chul Han I:** De la disciplina a la *Infocracia* y el "efecto de verdad" instantáneo.
10. **Byung-Chul Han II:** El *Panóptico Digital*, la atrofia analítica y la sociedad de la desconfianza.
11. **Impacto en Nosotros:** Análisis dual (Usuarios bajo paranoia preventiva vs. Desarrolladores hacia arquitecturas éticas).
12. **Impacto en la Sociedad:** Colapso de la confianza comunitaria vs. Conciencia ciudadana y revalorización de la presencialidad.
13. **Conclusiones Finales:** La ciberseguridad como dilema antropológico y la caverna digital.
14. **Bibliografía y Fuentes:** Harari, Han, Cruz, Informes de CrowdStrike, Kaspersky, Palo Alto Networks y reportes de Bloomberg.

---

## 5. Arquitectura del Código (MVC & SOLID)

```text
presentacion/
├── index.html                   # Documento semántico y stage 16:9
├── presentacion.html            # Alias directo para ejecución inmediata
├── README.md                    # Documentación técnica
│
├── assets/
│   ├── images/
│   │   ├── mask.jpg             # Máscara estilizada (Mr. Robot aesthetic)
│   │   ├── cyber-telemetry.jpg  # Pantalla de operaciones y amenazas
│   │   └── mr-robot-title.png   # Favicon e isotipo
│   ├── icons/
│   └── fonts/
│
├── css/
│   ├── variables.css            # Paleta de color (#08090B, #E63946, etc.) y métricas
│   ├── animations.css           # Glitch sutil, scanlines, pulso LED y transiciones
│   ├── layout.css               # Contenedor 16:9 matemático y rejillas
│   ├── components.css           # Tarjetas cibernéticas, citas, badges y controles
│   └── main.css                 # Reset tipográfico y reglas @media print
│
└── js/
    ├── app.js                   # Bootstrap con ES Modules
    ├── app.local.js             # Standalone bundle para protocolo file:///
    │
    ├── models/
    │   └── SlideModel.js        # Gestión de datos, textos y metadatos (Model)
    │
    ├── views/
    │   ├── PresentationView.js  # Renderizado y transiciones de diapositivas (View)
    │   └── ControlsView.js      # Botones, barra de progreso y atajos (View)
    │
    ├── controllers/
    │   └── PresentationController.js # Orquestación, hash URL y navegación (Controller)
    │
    └── utils/
        └── helpers.js           # Funciones de apoyo, clamp y formateo
```
