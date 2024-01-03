let confirguracion_cv = {};
let array_skills = [];
let array_idiomas = [];
let array_titulos_academicos = [];
let array_expriencias = [];
confirguracion_cv.array_skills = array_skills;
confirguracion_cv.array_idiomas = array_idiomas;
confirguracion_cv.array_titulos_academicos = array_titulos_academicos;
confirguracion_cv.array_expriencias = array_expriencias;

$(document).ready(function () {
    // Agrega eventos para detectar cambios en los campos de entrada
    $('#curriculum-form :input').on('input', function () {
        actualizarVistaEnTiempoReal(confirguracion_cv)
    });

    document.querySelectorAll('.skill-icon').forEach(function (icon) {
        icon.addEventListener('click', function (event) {
            event.preventDefault();
            let skillName = this.querySelector('img').alt;
            console.log('skillname', skillName);
            const index = confirguracion_cv.array_skills.indexOf(skillName);

            if (index === -1) {
                confirguracion_cv.array_skills.push(skillName);
                this.classList.add('selected-skill');
                $(`#${skillName}`).show();
            } else {
                // Si existe, elimínalo del array
                confirguracion_cv.array_skills.splice(index, 1);
                this.classList.remove('selected-skill');
                $(`#${skillName}`).hide();
            };

            if (confirguracion_cv.array_skills.length > 0) {
                $(`#id_cv_personal`).show();
            } else {
                $(`#id_cv_personal`).hide();
            }
        });
    });

})

function actualizarVistaEnTiempoReal() {
    // Obtén los valores de los campos de entrada
    let nombre = $('#nombre').val()
    let apellidos = $('#apellidos').val()
    let prefijo = $('#prefijo').val()
    let telefono = $('#telefono').val()
    let email = $('#email').val()
    let link_linkedin = $('#link_linkedin').val()
    let txt_sobre_mi = $('#sobre_mi').val()
    let puesto=$('#puesto').val()

    confirguracion_cv.nombre = nombre.toUpperCase();
    confirguracion_cv.apellidos = apellidos.toUpperCase();
    confirguracion_cv.prefijo = prefijo;
    confirguracion_cv.telefono = telefono;
    confirguracion_cv.email = email;
    confirguracion_cv.link_linkedin = link_linkedin;
    confirguracion_cv.txt_sobre_mi = txt_sobre_mi;
    confirguracion_cv.puesto = puesto;
    // Actualiza la vista en tiempo real
    $('#preview_nombre').text(confirguracion_cv.nombre);
    $('#preview_apellidos').text(confirguracion_cv.apellidos)
    $('#cv_prefijo_telefono').text(confirguracion_cv.prefijo)
    $('#cv_telefono').text(confirguracion_cv.telefono)
    $('#span_email').text(confirguracion_cv.email)
    $('#span_linkdin').text(confirguracion_cv.link_linkedin)
    $('#preview_info_sobre_mi').text(confirguracion_cv.txt_sobre_mi)
    $('#preview_titulo_pst').text(confirguracion_cv.puesto)


    let fecha_inicio = '';
    let fecha_fin = '';
    if ($('#estudios_fecha_ini').val() != '') {
        fecha_inicio = $('#estudios_fecha_ini').val().split('-')[2] + '/' + $('#estudios_fecha_ini').val().split('-')[0]
    }
    if ($('#estudios_fecha_fin').val() != '') {
        fecha_fin = $('#estudios_fecha_fin').val().split('-')[2] + '/' + $('#estudios_fecha_fin').val().split('-')[0]
    }

    if (fecha_inicio != '') $('#estudio_inicio').text(`${fecha_inicio}`);
    if (fecha_fin != '') $('#estudio_fin').text(`${fecha_fin}`);

    $('#titulo_estudios').text($('#estudios_titulo').val());
    $('#lugar_estudios').text($('#lugar_de_estudios').val());
}

const avatarContainer = document.getElementById('avatar-container')
const avatarInput = document.getElementById('avatar-input')

avatarContainer.addEventListener('click', () => {
    avatarInput.click() // Hacer clic en el input de archivo al hacer clic en la imagen
})

// Cuando se selecciona una nueva imagen, mostrarla en el fondo del avatar
avatarInput.addEventListener('change', () => {
    const selectedImage = avatarInput.files[0]
    if (selectedImage) {
        const imageUrl = URL.createObjectURL(selectedImage)
        avatarContainer.style.backgroundImage = `url(${imageUrl})`
    }
})

function configuracion_steps(id_elemento) {
    if (id_elemento == 'ir_a_step_2') {

        $(`#volver_atras_step_1`).show();
        $(`#volver_atras_step_2`).hide();
        $(`#volver_atras_step_3`).hide();

        $(`#ir_a_step_2`).hide();
        $(`#ir_a_step_3`).show();
        $(`#ir_a_step_4`).hide();
        $(`#finalizar_cv`).hide();

        $(`#contenedor_step_1`).hide();
        $(`#contenedor_step_2`).show();
        $(`#contenedor_step_3`).hide();
        $(`#contenedor_step_4`).hide();


        $(`#titulo_step_actual`).text('Skills + Idiomas');

    }

    if (id_elemento == 'volver_atras_step_1') {

        $(`#volver_atras_step_1`).hide();
        $(`#volver_atras_step_2`).hide();
        $(`#volver_atras_step_3`).hide();

        $(`#ir_a_step_2`).show();
        $(`#ir_a_step_3`).hide();
        $(`#ir_a_step_4`).hide();
        $(`#finalizar_cv`).hide();

        $(`#contenedor_step_1`).show();
        $(`#contenedor_step_2`).hide();
        $(`#contenedor_step_3`).hide();
        $(`#contenedor_step_4`).hide();

        $(`#titulo_step_actual`).text('Datos Personales');

    }

    if (id_elemento == 'ir_a_step_3') {

        $(`#volver_atras_step_1`).hide();
        $(`#volver_atras_step_2`).show();
        $(`#volver_atras_step_3`).hide();

        $(`#ir_a_step_2`).hide();
        $(`#ir_a_step_3`).hide();
        $(`#ir_a_step_4`).show();
        $(`#finalizar_cv`).hide();

        $(`#contenedor_step_1`).hide();
        $(`#contenedor_step_2`).hide();
        $(`#contenedor_step_3`).show();
        $(`#contenedor_step_4`).hide();

        $(`#titulo_step_actual`).text('Datos Academicos');


    }

    if (id_elemento == 'volver_atras_step_2') {

        $(`#volver_atras_step_1`).show();
        $(`#volver_atras_step_2`).hide();
        $(`#volver_atras_step_3`).hide();

        $(`#ir_a_step_2`).hide();
        $(`#ir_a_step_3`).show();
        $(`#ir_a_step_4`).hide();
        $(`#finalizar_cv`).hide();

        $(`#contenedor_step_1`).hide();
        $(`#contenedor_step_2`).show();
        $(`#contenedor_step_3`).hide();
        $(`#contenedor_step_4`).hide();

        $(`#titulo_step_actual`).text('Skills + Idiomas');

    }

    if (id_elemento == 'ir_a_step_4') {

        $(`#volver_atras_step_1`).hide();
        $(`#volver_atras_step_2`).hide();
        $(`#volver_atras_step_3`).show();

        $(`#ir_a_step_2`).hide();
        $(`#ir_a_step_3`).hide();
        $(`#ir_a_step_4`).hide();
        $(`#finalizar_cv`).show();

        $(`#contenedor_step_1`).hide();
        $(`#contenedor_step_2`).hide();
        $(`#contenedor_step_3`).hide();
        $(`#contenedor_step_4`).show();

        $(`#titulo_step_actual`).text('Experiencia Laboral');


    }

    if (id_elemento == 'volver_atras_step_3') {

        $(`#volver_atras_step_1`).hide();
        $(`#volver_atras_step_2`).show();
        $(`#volver_atras_step_3`).hide();

        $(`#ir_a_step_2`).hide();
        $(`#ir_a_step_3`).hide();
        $(`#ir_a_step_4`).show();
        $(`#finalizar_cv`).hide();

        $(`#contenedor_step_1`).hide();
        $(`#contenedor_step_2`).hide();
        $(`#contenedor_step_3`).show();
        $(`#contenedor_step_4`).hide();

        $(`#titulo_step_actual`).text('Datos Academicos');


    }

}

// Función para guardar estudios
function guardar_estudios() {
    const estudios_titulo = $('#estudios_titulo').val();
    const estudios_fecha_ini = $('#estudios_fecha_ini').val();
    const estudios_fecha_fin = $('#estudios_fecha_fin').val();
    const lugar_de_estudios = $('#lugar_de_estudios').val();

    console.log(estudios_titulo);
    console.log(estudios_fecha_ini);
    console.log(estudios_fecha_fin);
    console.log(lugar_de_estudios);

    if (estudios_titulo && estudios_fecha_ini && estudios_fecha_fin && lugar_de_estudios) {
        const nuevoEstudio = {
            'titulo_estudios': estudios_titulo,
            'fecha_ini': estudios_fecha_ini,
            'fecha_fin': estudios_fecha_fin,
            'lugar_de_estudios': lugar_de_estudios,
        };

        confirguracion_cv.array_titulos_academicos.push(nuevoEstudio);

        $('#estudios_titulo').val('');
        $('#estudios_fecha_ini').val('');
        $('#estudios_fecha_fin').val('');
        $('#lugar_de_estudios').val('');
        console.log(confirguracion_cv.array_titulos_academicos);

        let HTML_DATOS_ACADEMICOS = ``;
        let HTML_DATOS_ESTUDIOS_AGREGADOS = ``;

        if (confirguracion_cv.array_titulos_academicos.length > 0) {

            confirguracion_cv.array_titulos_academicos.forEach(item => {
                HTML_DATOS_ACADEMICOS += `
                <li>
                    <div class="cv-msg-1"><span id="estudio_inicio">${item.fecha_ini.split('-')[1]}/${item.fecha_ini.split('-')[0]}</span>-<span>${item.fecha_fin.split('-')[1]}/${item.fecha_fin.split('-')[0]}</span> | <span>${item.titulo_estudios}</span></div>
                    <div class="cv-msg-2">${item.lugar_de_estudios}</div>
                </li>
                `;
                HTML_DATOS_ESTUDIOS_AGREGADOS += `
                <div class="estudios_agregados">
                    <div>
                        <div class="cv-msg-1"><span id="estudio_inicio">${item.fecha_ini.split('-')[1]}/${item.fecha_ini.split('-')[0]}</span>-<span>${item.fecha_fin.split('-')[1]}/${item.fecha_fin.split('-')[0]}</span> | <span>${item.titulo_estudios}</span></div>
                        <div class="cv-msg-2">${item.lugar_de_estudios}</div>
                    </div>
                    <div>
                        <button type="button" class="btn btn-danger btn-sm btn-eliminar-estudios" data-index="${confirguracion_cv.array_titulos_academicos.indexOf(item)}">Eliminar</button>
                    </div>
                </div>
            
                `;
            });
        }

        $(`#lista_info_datos_academicos`).html(HTML_DATOS_ACADEMICOS);
        $(`#lista_estudios_agregados`).html(HTML_DATOS_ESTUDIOS_AGREGADOS);
        $(`#anyadir_mas_estudios`).prop('disabled', false);
        $(`#preview_lista_info_datos_academicos`).html('');
    } else {
        alert('Por favor, completa todos los campos de estudios antes de guardar.');
    }
}


$(document).on('click', '.btn-eliminar-estudios', function () {
    const index = $(this).data('index');
    if (index !== undefined && index >= 0 && index < confirguracion_cv.array_titulos_academicos.length) {
        // Elimina la experiencia del array
        confirguracion_cv.array_titulos_academicos.splice(index, 1);
        // Actualiza la lista en la vista
        $(`#lista_estudios_agregados .estudios_agregados`).eq(index).remove();
        $(`#lista_info_datos_academicos li`).eq(index).remove();
    }
});



// Añadir mas estudios 

function fun_mas_estudios() {
    let HTML_EJEMPLO_DATOS_ACADEMICOS = `
    <li>
        <div class="cv-msg-1"><span id="estudio_inicio">2017</span>-<span id="estudio_fin">2018</span> | <span id="titulo_estudios"></span></div>
        <div class="cv-msg-2" id="lugar_estudios">Masterall School of Texas</div>
    </li>
    `;
    $(`#preview_lista_info_datos_academicos`).html(HTML_EJEMPLO_DATOS_ACADEMICOS);
}

// Definir la función para guardar experiencia
function guardar_experiencia() {
    const experiencia_titulo = $('#experiencia_titulo').val();
    const experiencia_fecha_ini = $('#experiencia_fecha_ini').val();
    const experiencia_fecha_fin = $('#experiencia_fecha_fin').val();
    const breve_descripcion_puesto = $('#breve_descripcion_puesto').val();
    const checkbox_actualmente = $('#experiencia_actualmente').is(':checked'); // Corregir el error tipográfico

    if (experiencia_titulo && experiencia_fecha_ini && (checkbox_actualmente || experiencia_fecha_fin)) {
        // Crea un objeto con los datos
        const fecha_o_actualmente = checkbox_actualmente ? 'Actualmente' : `${experiencia_fecha_ini.split('-')[2]}/${experiencia_fecha_ini.split('-')[0]} | ${experiencia_fecha_fin.split('-')[2]}/${experiencia_fecha_fin.split('-')[0]}`;

        const nueva_experiencia = {
            'experiencia_titulo': experiencia_titulo,
            'experiencia_fecha_ini': experiencia_fecha_ini,
            'experiencia_fecha_fin': experiencia_fecha_fin,
            'breve_descripcion_puesto': breve_descripcion_puesto,
            'checkbox_actualmente': checkbox_actualmente,
            'info_fechas_experiencia': fecha_o_actualmente,
        };

        // Agrega el objeto al array
        confirguracion_cv.array_expriencias.push(nueva_experiencia);

        // Vacía los campos del formulario
        $('#experiencia_titulo').val('');
        $('#experiencia_fecha_ini').val('');
        $('#experiencia_fecha_fin').val('');
        $('#breve_descripcion_puesto').val('');
        $('#experiencia_actualmente').prop('checked', false);

        let HTML_DATOS_EXPERIENCIA = '';
        let HTML_DATOS_EXPERIENCIA_AGREGADA = '';

        if (confirguracion_cv.array_expriencias.length > 0) {
            confirguracion_cv.array_expriencias.forEach(item => {
                HTML_DATOS_EXPERIENCIA += `
                <li>
                    <div class="cv-msg-1">${item.info_fechas_experiencia}</div>
                    <div class="cv-msg-2">${item.experiencia_titulo}</div>
                    <div class="cv-msg-3">${item.breve_descripcion_puesto}.</div>
                </li>
                `;
                HTML_DATOS_EXPERIENCIA_AGREGADA += `
                <div class="experiencia_agregada">
                    <div>
                        <div class="cv-msg-1">${item.info_fechas_experiencia}</div>
                        <div class="cv-msg-2">${item.experiencia_titulo}</div>
                        <div class="cv-msg-3">${item.breve_descripcion_puesto}.</div>
                    </div>
                    <div>
                        <button type="button" class="btn btn-danger btn-sm btn-eliminar-experiencia" data-index="${confirguracion_cv.array_expriencias.indexOf(item)}">Eliminar</button>
                    </div>
                </div>
            
                `;
            });
        }

        $(`#lista_info_experiencia_laboral`).html(HTML_DATOS_EXPERIENCIA);
        $(`#btn_anyadir_experiencia`).prop('disabled', false);
        $(`#preview_lista_info_experiencia_laboral`).html('');
        $(`#lista_experiencias_agregadas`).html(HTML_DATOS_EXPERIENCIA_AGREGADA);
        // Imprime el array de experiencias en la consola (borra esto en producción)
        console.log(confirguracion_cv.array_expriencias);
    } else {
        alert('Por favor, completa todos los campos de experiencia laboral antes de guardar.');
    }
}

$(document).on('click', '.btn-eliminar-experiencia', function () {
    const index = $(this).data('index');
    if (index !== undefined && index >= 0 && index < confirguracion_cv.array_expriencias.length) {
        // Elimina la experiencia del array
        confirguracion_cv.array_expriencias.splice(index, 1);
        // Actualiza la lista en la vista
        $(`#lista_experiencias_agregadas div`).eq(index).remove();
        $(`#lista_info_experiencia_laboral li`).eq(index).remove();
    }
});

// Añadir mas estudios 

function fun_mas_experiencias() {
    let HTML_EJEMPLO_DATOS_EXPERIENCIA = `
    <li>
        <div class="cv-msg-1">Present | Architect</div>
        <div class="cv-msg-2">Lorem, ipsum dolor</div>
        <div class="cv-msg-3">Lorem ipsum dolor sit amet consectetur adipisicing.</div>
    </li>
    `;
    $(`#preview_lista_info_experiencia_laboral`).html(HTML_EJEMPLO_DATOS_EXPERIENCIA);
}


document.querySelectorAll('.lista-idiomas').forEach(function (idioma) {
    const checkbox = idioma.querySelector('input[type="checkbox"]');
    const rangeInput = idioma.querySelector('input[type="range"]');

    // Deshabilita el input range inicialmente y establece su valor en 1
    rangeInput.disabled = true;
    rangeInput.value = 1;

    // Agregar un evento de cambio al checkbox
    checkbox.addEventListener('change', function () {
        const nivel = rangeInput.value;

        // Habilita o deshabilita el input range según el estado del checkbox
        rangeInput.disabled = !checkbox.checked;

        if (checkbox.checked) {
            const idiomaSeleccionado = {
                id: checkbox.id,  // Usa el id del checkbox como identificador del idioma
                nivel: nivel
            };
            confirguracion_cv.array_idiomas.push(idiomaSeleccionado);
        } else {
            // Si el checkbox se desmarca, elimina el idioma del array
            const index = confirguracion_cv.array_idiomas.findIndex(item => item.id == checkbox.id);
            if (index !== -1) {
                confirguracion_cv.array_idiomas.splice(index, 1);
            }

            // Si el checkbox se desmarca, restaura el valor del rango a 1 y lo deshabilita
            rangeInput.value = 1;
            rangeInput.disabled = true;
        }

        if (confirguracion_cv.array_idiomas.length > 0) {
            $(`#id_cv_idiomas`).show();
        } else {
            $(`#id_cv_idiomas`).hide();
        }
        // Puedes realizar otras acciones relacionadas con la actualización del array aquí

        console.log(confirguracion_cv.array_idiomas);
    });

    // Agregar un evento de cambio al rango
    rangeInput.addEventListener('input', function () {
        const nivel = rangeInput.value;

        // Busca el idioma en el array y actualiza su nivel
        const idiomaSeleccionado = confirguracion_cv.array_idiomas.find(item => item.id == checkbox.id);
        if (idiomaSeleccionado) {
            idiomaSeleccionado.nivel = nivel;
        }

        console.log(confirguracion_cv.array_idiomas);

        let HTML_IDIOMAS = '';
        let trad_niveles = {
            '1': 'Básico',
            '2': 'Médio',
            '3': 'Alto',
        };
        if (confirguracion_cv.array_idiomas.length > 0) {
            confirguracion_cv.array_idiomas.forEach(item => {
                HTML_IDIOMAS += `
                <div class="elemento-idioma" style="width:100%;display: flex;justify-content: space-between;align-items: center;gap:5px">
                    <label for="" style="font-size: 16px;">${item.id.charAt(0).toUpperCase() + item.id.slice(1)}</label>
                    <span style="color: #0d6efd;font-size: 16px;">Nivel ${trad_niveles[item.nivel]}</span>
                </div>
                `;
            });
        };

        $(`#div_contenedor_idiomas`).html(HTML_IDIOMAS);
    });
});

