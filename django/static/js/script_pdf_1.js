function generarPDF() {
    // Selecciona el contenedor del currículum que deseas convertir a PDF
    const cvContainer = document.getElementById('real-time-preview');
    console.log("cvContainer: ", cvContainer);

    // Define las opciones de impresión, como el tamaño de papel y la orientación
    const printOptions = {
        printable: 'real-time-preview',
        type: 'html',
        /*header: 'Mi Currículum',*/
        style: `
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");

@media print {
  @page {
    margin: 0;
    size: A4;
  }
  * {
    -webkit-print-color-adjust: exact;
  }

  .print-btn {
    display: none;
  }
}
* {
  font-family: "Montserrat", sans-serif;
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}


.centrar-elementos {
  display: flex;
  justify-content: center;
  align-items: center;
}

#header {
  text-align: center;
  padding: 20px;
  background-color: #007bff;
  color: #fff;
}

#body {
  padding: 20px;
}

#footer {
  text-align: center;
  padding: 20px;
  background-color: #007bff;
  color: #fff;
}


.centrar-elementos {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cv-container {
  margin: auto;
  display: grid;
  grid-template-columns: 0.33fr 1fr;
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.7);
}
.cv-container .cv-header {
  padding: 40px 20px;
  padding-left: 25px;
  background: #d1d1d1;
  width: 100%;
  color: #313131;
}
.cv-container .cv-header .cv-avatar {
  display: inline-flex;
  margin-bottom: 5px;
  margin-left: -15px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background-image: url("/static/img/profile.jpg");
  background-position: center top;
  background-size: cover;
  border: 4px solid #2c2b29;
}
.cv-container .cv-header .cv-contact {
  margin-top: 15px;
}
.cv-container .cv-header .cv-contact .cv-section-title {
  font-size: 1.5em;
}
.cv-container .cv-header .cv-contact .cv-info {
  width: 100%;
  display: grid;
  grid-template-columns: 0.3fr 1fr;
  margin-top: 25px;
  align-items: center;
}
.cv-container .cv-header .cv-contact .cv-info i {
  font-size: 1.3em;
}
.cv-container .cv-header .cv-contact .cv-info .cv-text {
  display: inline-flex;
  word-break: break-all;
}
.cv-container .cv-header .cv-personal {
  margin-top: 35px;
}
.cv-container .cv-header .cv-personal .cv-section-title {
  font-size: 1.5em;
}
.cv-container .cv-header .cv-personal .cv-skill {
  margin: 25px 0px;
  grid-template-columns: 0.55fr 1fr;
  display: grid;
}
.cv-container .cv-header .cv-personal .cv-skill .cv-progress .cv-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #313131;
  border-radius: 50%;
  margin-left: 4px;
}
.cv-container .cv-header .cv-personal .cv-skill .cv-progress .cv-dot.active {
  background-color: #ffe3b9;
}
.cv-container .cv-header .cv-hobbies {
  margin-top: 35px;
}
.cv-container .cv-header .cv-hobbies .cv-logo {
  margin: 10px 0px;
  display: grid;
  grid-template: 1fr 1fr/1fr 1fr;
  font-size: 2.8em;
  grid-row-gap: 15px;
}
.cv-container .cv-body {
  background: #ffffff;
  padding: 40px 20px;
  padding-right: 75px;
  /*color: #b5b5b4;*/
  color: #3b3b3b;
  
}
.cv-container .cv-body .cv-title {
  font-size: 1.9em;
  color: #935800;
}
.cv-container .cv-body .cv-title h1 {
  font-weight: 400 !important;
}
.cv-container .cv-body .cv-subtitle h1 {
  font-weight: 400 !important;
}
.cv-container .cv-body .cv-group-1 .cv-box {
  display: inline-block;
  padding: 2px 70px 2px 20px;
  margin-left: -20px;
  margin-top: 35px;
  background: #ffe3b9;
  color: #2c2b29;
  border-radius: 0 10px 10px 0;
}
.cv-container .cv-body .cv-group-1 .cv-description {
  margin-top: 15px;
  line-height: 1.5;
}
.cv-container .cv-body .cv-group-2 .cv-box {
  display: inline-block;
  padding: 2px 70px 2px 20px;
  margin-left: -20px;
  margin-top: 35px;
  background: #ffe3b9;
  color: #2c2b29;
  border-radius: 0 10px 10px 0;
}
.cv-container .cv-body .cv-group-2 .cv-description {
  margin-top: 15px;
  margin-left: 20px;
}
.cv-container .cv-body .cv-group-2 .cv-description ul {
  position: relative;
  margin-top: 20px;
  margin-left: 5px;
}
.cv-container .cv-body .cv-group-2 .cv-description ul:before {
  content: "";
  position: absolute;
  top: 12px;
  left: -22px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffe3b9;
}
.cv-container .cv-body .cv-group-2 .cv-description ul li {
  list-style-type: none;
  position: relative;
}
.cv-container .cv-body .cv-group-2 .cv-description ul li:before {
  content: "";
  position: absolute;
  top: 12px;
  left: -18px;
  height: 60px;
  border-left: 2px solid #ffe3b9;
}
.cv-container .cv-body .cv-group-2 .cv-description ul:last-of-type li:before {
  content: none;
}
.cv-container .cv-body .cv-group-2 .cv-description ul li div:last-of-type {
  color: #a36a15;
  font-weight: bold;
}
.cv-container .cv-body .cv-group-3 .cv-box {
  display: inline-block;
  padding: 2px 70px 2px 20px;
  margin-left: -20px;
  margin-top: 35px;
  background: #ffe3b9;
  color: #2c2b29;
  border-radius: 0 10px 10px 0;
}
.cv-container .cv-body .cv-group-3 .cv-description {
  margin-top: 15px;
  margin-left: 20px;
}
.cv-container .cv-body .cv-group-3 .cv-description ul {
  position: relative;
  margin-top: 20px;
  margin-left: 5px;
}
.cv-container .cv-body .cv-group-3 .cv-description ul:before {
  content: "";
  position: absolute;
  top: 30px;
  left: -22px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffe3b9;
}
.cv-container .cv-body .cv-group-3 .cv-description ul li {
  list-style-type: none;
  position: relative;
}
.cv-container .cv-body .cv-group-3 .cv-description ul li:before {
  content: "";
  position: absolute;
  top: 30px;
  left: -18px;
  height: 100px;
  border-left: 2px solid #ffe3b9;
}
.cv-container .cv-body .cv-group-3 .cv-description ul:last-of-type li:before {
  content: none;
}
.cv-container .cv-body .cv-group-3 .cv-description ul li div:nth-child(2) {
  color: #a36a15;
  font-weight: bold;
}

.print-btn {
  position: fixed;
  bottom: 15px;
  right: 15px;
  background: white;
  padding: 10px;
  cursor: pointer;
  transition-duration: 0.2s;
}
.print-btn span {
  margin-left: 5px;
  font-weight: bold;
  color: #313131;
}
.print-btn:hover {
  transition-duration: 0.2s;
  background: #313131;
  color: white;
}
.print-btn:hover span {
  color: white;
}

.contenedor-skills {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px;
}
.contenedor-skills > img.icono-skills-png {
  width: 35px;
  height: 35px;
}
.cv-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icono-info-png {
  width: 20px;
  height: 20px;
  margin-bottom: 0px !important ;
}
.custom-space-between {
  display: flex;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 5px;
  flex-direction: row !important;
}
.custom-center {
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  gap: 5px;
  flex-direction: row !important;
}
input::placeholder {
  font-size: 13px !important;
}
textarea::placeholder {
  font-size: 13px !important;
}
.skill-icon {
  position: relative;
  display: inline-block;
  margin: 5px;
}

.skill-icon::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: url("../img/iconos/check_verde_1.png") no-repeat center center;
  background-size: contain;
  opacity: 0;
  transition: opacity 0.3s;
}

.selected-skill::after {
  opacity: 1; /* Muestra el icono de check cuando se aplica la clase .selected-skill */
}

.lista-idiomas {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.custom-active {
  display: block !important;
}

#lista_experiencias_agregadas {
  display: flex;
  flex-direction: column;
}

#lista_estudios_agregados {
  display: flex;
  flex-direction: column;
}

.experiencia_agregada,
.estudios_agregados {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border: #e3e3e3 1px solid;
  border-radius: 10px;
  padding: 8px;
  background-color: #e6fff7;
}
.h1-custom-cv{
  font-size:24px !important;
  margin-bottom:20px !important;
 }

        `,
    };
    console.log("printOptions: ", printOptions);

    // Llama a Print.js para imprimir el contenido y generar un PDF
    printJS(printOptions);
}
document.addEventListener("DOMContentLoaded", function () {
    const botonDescargarPDF = document.getElementById('finalizar_cv');
    botonDescargarPDF.addEventListener('click', generarPDF);
});

function getCSSProperties(element) {
    const computedStyles = window.getComputedStyle(element);
    const cssProperties = {};

    for (let i = 0; i < computedStyles.length; i++) {
        const propertyName = computedStyles[i];
        const propertyValue = computedStyles.getPropertyValue(propertyName);
        cssProperties[propertyName] = propertyValue;
    }

    return cssProperties;
}

// const myElement = document.getElementById('real-time-preview');
// const styles = getCSSProperties(myElement);

// console.log(styles);

