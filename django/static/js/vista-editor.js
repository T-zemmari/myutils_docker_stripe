
console.log('Vista-editor');
console.log('Vista-editor DOMAIN', MY_DOMAIN);
var archivos_a_subir = [];

/*#################################*/
/*########## EVENTOS ##############*/
/*#################################*/
$(window).on('resize', function () {
    console.log('Resize')
    detectar_Dispositivo()

})

$(document).ready(function () {

    detectar_Dispositivo()
    obtener_id_unica_proyecto()

    /*####################################################################################*/
    /*############ GESTIONAR LOS DIVS MEDIANTE LOS ICONOS DEL MENU IZQUIERDO #############*/
    /*####################################################################################*/
    $('.contenedor_icono_mostrar_trabajos').click(function () {
        $('.mostrar-div').removeClass('vista-activa').addClass('vista-no-activa');
        $(`#contenedor_mostrar_trabajos`).removeClass('vista-no-activa').addClass('vista-activa');
    })


    /*####################################################################################*/
    /*########## GESTIONAR LA VISIBILIADA DEL FORMULARIO DE UN NUEVO PROYECTO ############*/
    /*####################################################################################*/

    $(`#mostrar_form_nuevo_proyecto`).click(function () {
        $(`#contenedor_formulario_crear_nuevo_proyecto`).toggle();
        if ($(`#contenedor_formulario_crear_nuevo_proyecto`).is(':visible')) {
            $(`#contenedor_crear_nuevo_proyecto`).css('height', '20%')
        } else {
            $(`#contenedor_crear_nuevo_proyecto`).css('height', '7%')
        }
    })

    /*####################################################################################*/
    /*###### OBTENER LA INFO DEL NUEVO PROYECTO Y HACER LA PETICION PARA LA CREACION #####*/
    /*####################################################################################*/

    $('#btn_crear_nuevo_proyecto').click(function (e) {
        e.preventDefault();
        let nombreProyecto = $('#input_nombre_proyecto').val().trim();
        let regex = /^[a-zA-Z0-9_-]{1,50}$/;

        if (nombreProyecto === '') {
            Swal.fire({
                html: `<h3 style="color:red;margin-top:25px">ALERTA</h3><span>El nombre no puede estar vacío</span>`
            });
            return false;
        }

        if (!regex.test(nombreProyecto)) {
            Swal.fire({
                html: `<h3 style="color:red;margin-top:25px">ALERTA</h3><span>El nombre del proyecto no cumple con los requisitos.<br>Debe contener solo letras, números, guiones bajos (_) o medios (-) y tener máximo 50 caracteres.</span>`
            });
            return false;
        }

        let url = MY_DOMAIN + '/servicios/videos/editor/crear_nuevo_proyecto/';
        let csrfToken = $('[name=csrfmiddlewaretoken]').val();

        $.ajax({
            type: 'POST',
            url: url,
            data: {
                'nombre_proyecto': nombreProyecto,
            },
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (data) {
                console.log('Petición exitosa', data);
                if (data.proyecto && data.proyecto.id && data.proyecto.nombre) {
                    console.log('ok');

                    // Redireccionar a la nueva URL
                    window.location.href = `${MY_DOMAIN}/servicios/videos/editor/${data.proyecto.referencia_proyecto}`;
                } else {
                    Swal.fire({
                        html: `<h3 style="color:red;margin-top:25px">ALERTA</h3><span>Ha ocurrido un error.</span>`
                    });
                }
            },
            error: function (error) {
                console.error('Error en la petición', error);
                Swal.fire({
                    html: `<h3 style="color:red;margin-top:25px">ALERTA</h3><span>Estamos experimentando una gran cantidad de solicitudes en este momento. Por favor, inténtalo nuevamente en unos instantes. ¡Gracias por tu paciencia!</span>`
                });
            }
        });
    });

});



/*###################################*/
/*########## FUNCIONES ##############*/
/*###################################*/

function detectar_Dispositivo() {
    let anchoVentana = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let contenedorPrincipal = document.querySelector('.contenedor-editor-principal')
    let alerta = document.querySelector('.alerta')
    if (anchoVentana < 860) {
        contenedorPrincipal.style.display = 'none'
        alerta.style.display = 'block'
    } else {
        contenedorPrincipal.style.display = 'block'
        alerta.style.display = 'none'
    }
}

function obtener_id_unica_proyecto() {
    let url_actual = window.location.pathname;  // Utilizamos 'pathname' en lugar de 'href'
    let partes_ruta = url_actual.split('/');  // Dividimos la ruta en partes
    let proyecto_ref_index = partes_ruta.indexOf('editor') + 1;  // Encontramos el índice de 'editor' y agregamos 1 para obtener el siguiente segmento
    let referencia_proyecto = proyecto_ref_index < partes_ruta.length ? partes_ruta[proyecto_ref_index] : null;  // Obtenemos el valor de 'proyecto_ref' si está presente

    if (referencia_proyecto != undefined && referencia_proyecto != null && referencia_proyecto != '') {
        console.log('referencia_proyecto', referencia_proyecto);
        obtener_archivos_del_proyecto(referencia_proyecto)
    }
}



function renderizar_proyectos(data) {
    let HTML_NUEVO_PROYECTO = ``;
    if (data.id != '') {
        $(`#contenedor_formulario_crear_nuevo_proyecto`).hide();
        HTML_NUEVO_PROYECTO = `
        <div class="carpeta-proyecto" id="carpeta_${data.referencia_proyecto}">
            <img style="padding:5px;margin-bottom:0px;width:50px;cusror:pointer" src="/static/img/img_carpeta_1.png" alt="carpeta"/>
            <small style="color:#fff;cusror:pointer">${data.nombre}</small>
            <button class="btn btn-danger btn-sm btn-icon btn-eliminar-proyecto" id="btn_eliminar_proyecto_${data.nombre}" onclick="eliminar_proyecto('${data.nombre}')">X</button>
        </div>
        `;
        $(`#contenedor_mostrar_proyectos`).prepend(HTML_NUEVO_PROYECTO);
    }
}

function eliminar_proyecto(referencia_proyecto) {

    Swal.fire({
        html: `¿Seguro que quieres eliminar el proyecto?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Eliminar",
        denyButtonText: `Cancelar`
    }).then((result) => {
        if (result.isConfirmed) {
            let url = MY_DOMAIN + '/servicios/videos/editor/eliminar_proyecto/' + referencia_proyecto + '/';
            let csrfToken = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    'referencia_proyecto': referencia_proyecto,
                    'csrfmiddlewaretoken': csrfToken
                },
                success: function (data) {
                    console.log('Petición exitosa', data);
                    window.location.reload()
                },
                error: function (error) {
                    console.error('Error en la petición', error);
                    Swal.fire({
                        html: `<h3 style="color:red;margin-top:25px">ALERTA</h3><span>Estamos experimentando una gran cantidad de solicitudes en este momento. Por favor, inténtalo nuevamente en unos instantes. ¡Gracias por tu paciencia!</span>`
                    });
                }
            });
        }
    });

}


/*########################################################*/
/*################### DROPZONE ###########################*/
/*########################################################*/

function toggle_contenedor_dropZone() {
    console.log('click toggle_contenedor_dropZone');
    $('#contenedor_drop_zone').toggle(100);
    $("#contenedor_mostrar_archivos").toggleClass("contenedor-mostrar-archivo-dos");
    clear_dropzone()
}

function clear_dropzone() {
    $('#contenedor_drop_zone').html('');
    let HTML = `
        <form action="" class="">
            <div class="dropzone zona-dropzone-hijo">
              <div class="dz-default dz-message">
                <button class="dz-button" type="button">Arrastra tus archivos aqui</button>
              </div>
            </div>
            <div class="button">
                <input type="button" onclick="subir_archivos()" type="button" id="send" style="border:none;color:#fff;width:100%;background:linear-gradient(to right, #2196f3, rgb(207 79 220 / 95%))" value="Enviar"></button>
            </div>  
        </form>
    `;
    $('#contenedor_drop_zone').html(HTML);
    activar_dropzone();
}



function activar_dropzone() {
    if (document.querySelector('.dropzone')) {
        let url = MY_DOMAIN + "/servicios/videos/editor/subir_archivos/";
        console.log('URL de carga de archivos:', url);

        let myDropzone = new Dropzone(".dropzone",
            {
                url: url,
                headers: {
                    'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
                },
                maxFilesize: 200000,
                maxFiles: 4,
                acceptedFiles: 'image/jpeg,image/jpg,image/png,video/mp4,audio/mp3,audio/wav,audio/mp4',
                addRemoveLinks: true,
                dictRemoveFile: 'X'
            }
        );
        myDropzone.on("addedfile", file => {
            //console.log('File added: ', file);
            archivos_a_subir.push(file);
        });
        myDropzone.on("removedfile", file => {
            let posicion = archivos_a_subir.indexOf(file);
            archivos_a_subir.splice(posicion, 1);
        });
    }
}

/*###################################################################################*/
/*################### ENVIAR ARCHIVOS MEDIA DEL PROYECTO ############################*/
/*###################################################################################*/

function subir_archivos() {

    let referenciaProyecto = $('#referencia_proyecto').val();
    let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]').val();
    let formData = new FormData();

    for (let i = 0; i < archivos_a_subir.length; i++) {
        formData.append('archivos', archivos_a_subir[i]);
    }

    formData.append('referencia_proyecto', referenciaProyecto);
    formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);

    // Realizar la petición AJAX
    let url_subir_archivos = MY_DOMAIN + "/servicios/videos/editor/subir_archivos/";
    $.ajax({
        url: url_subir_archivos,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log('Respuesta subir_archivos', data);
            if (data.status == 'success') {
                clear_dropzone();
                obtener_archivos_del_proyecto(data.referencia_proyecto);
                archivos_a_subir = [];
            } else {
                alert('Ocurrio un error');
            }
        },
        error: function (error) {
            console.error('Error al realizar la petición:', error);
        }
    });
}

/*###################################################################################*/
/*################### OBTENER LOS ARCHIVOS DE UN PROYECTO############################*/
/*###################################################################################*/

function obtener_archivos_del_proyecto(referencia_proyecto) {
    let url_obtener_archivos = MY_DOMAIN + "/servicios/videos/editor/proyecto/obtener_archivos/";
    console.log('referencia_proyecto obtener_archivos_del_proyecto', referencia_proyecto)

    $.ajax({
        url: url_obtener_archivos,
        type: 'POST',
        data: { referencia_proyecto: referencia_proyecto },
        headers: {
            'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
        },
        dataType: 'json',
        success: function (data) {
            console.log('Respuesta obtener_archivos_del_proyecto', data);
            if (data.status === 'success') {
                console.log('Archivos del proyecto:', data.archivos);
                let archivos = data.archivos;
                if (archivos.length > 0) {
                    listar_archivos(archivos)
                    // archivos.forEach(archivo => {
                    //     listar_un_solo_archivo(archivo)
                    // })
                }
            } else {
                alert('Ocurrió un error al obtener archivos del proyecto.');
            }
        },
        error: function (error) {
            console.error('Error al realizar la petición:', error);
        }
    });
}

/*###################################################################################*/
/*################### RENDERIZAR LOS ARCHIVOS DE UN PROYECTO  #######################*/
/*###################################################################################*/

function listar_archivos(archivos) {
    let url_base = MY_DOMAIN + "/media/";
    if (archivos.length > 0) {
        console.log('resultado listar archivos', archivos);

        const container = document.getElementById('contenedor_mostrar_archivos');
        container.innerHTML = '';

        archivos.forEach((archivo) => {
            let nombre_archivo = archivo.file_name;
            const element = document.createElement('div');
            element.style.width = '60px';
            element.style.height = '60px';
            element.className = 'div-elemento-medio';
            element.setAttribute('id', `elemento_medio_${archivo.id}`);
            element.setAttribute('tipo', `${archivo.file_type}`);
            element.setAttribute('archivo_id', `${archivo.id}`);
            element.setAttribute('proyecto_ref', `${archivo.proyecto_ref}`);

            //if (archivo.capturas.length > 0) mostrar_capturas(archivo.id, archivo.capturas)

            switch (archivo.file_type) {
                case 'video':
                    const videoElement = document.createElement('video');
                    videoElement.src = url_base + archivo.url;
                    videoElement.style.width = '60px';
                    videoElement.style.height = '60px';
                    videoElement.style.borderRadius = '5px';
                    videoElement.style.position = 'absolute';
                    videoElement.style.top = '0';
                    videoElement.style.right = '0';
                    videoElement.setAttribute('id', `video_${archivo.id}`);
                    videoElement.setAttribute('ondragstart', 'drag(event)');
                    videoElement.setAttribute('draggable', true);
                    videoElement.setAttribute('archivo_id', `${archivo.id}`);
                    videoElement.setAttribute('proyecto_ref', `${archivo.proyecto_ref}`);
                    element.appendChild(videoElement);
                    element.style.position = 'relative';
                    element.style.borderRadius = '5px';
                    let src_muestra = url_base + archivo.url;
                    // element.onclick = () => {
                    //     previsualizar_video_muestra(src_muestra)
                    // }

                    break;
                case 'audio':
                    const audioElement = document.createElement('audio');
                    audioElement.src = url_base + archivo.url;
                    audioElement.style.width = '46px';
                    audioElement.style.height = '48px';
                    audioElement.style.position = 'absolute';
                    audioElement.style.top = '0';
                    audioElement.style.right = '0';
                    audioElement.setAttribute('ondragstart', 'drag(event)');
                    audioElement.setAttribute('draggable', true);
                    audioElement.setAttribute('id', `audio_${archivo.id}`);
                    element.style.backgroundImage = "url('./images/icono_audio.png')";
                    element.style.backgroundPosition = 'center';
                    element.style.backgroundSize = '42px 48px';
                    element.style.position = 'relative';
                    element.style.borderRadius = '5px';
                    element.style.width = '50px';
                    element.style.height = '50px';
                    element.style.borderRadius = '5px';
                    element.appendChild(audioElement);

                    break;
                case 'imagen':
                    const imgElement = document.createElement('img');
                    imgElement.src = url_base + archivo.url;
                    imgElement.style.width = '60px';
                    imgElement.style.height = '40px';
                    imgElement.style.position = 'absolute';
                    imgElement.style.top = '10px';
                    imgElement.style.right = '0';
                    imgElement.setAttribute('ondragstart', 'drag(event)');
                    imgElement.setAttribute('draggable', true);
                    imgElement.style.borderRadius = '5px';
                    imgElement.setAttribute('id', `image_${archivo.id}`);
                    element.appendChild(imgElement);
                    element.style.position = 'relative';
                    element.style.borderRadius = '5px';

                    break;
            }

            const deleteButton = document.createElement('button');
            deleteButton.style.background = 'transparent';
            deleteButton.style.border = 'none';
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '-7px';
            deleteButton.style.right = '-17px';
            deleteButton.innerHTML = '<ion-icon name="close-circle-outline" style="font-size:25px;color:#898989"></ion-icon>';
            deleteButton.onclick = () => {
                if (eliminar_archivo(archivo.id)) {
                    container.removeChild(element);
                }
            };

            element.appendChild(deleteButton);
            container.appendChild(element);


        });
    }
}
/*#########################################################################*/
/*################### FUNCIONES DRAG AND DROP  ############################*/
/*##########################################################################*/

var videos_a_manipular = [];//Aqui se guardan los videos que se arrastran y se sueltan en la zona de trabajo
var array_videos_modificados_a_manipular = [];//Aqui se guardan los videos manipulados , osea cuando se acorta un video

const canvas = document.getElementById("barraTiempoCanvas");
const ctx = canvas.getContext("2d");



function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragEnter(event) {
    event.dataTransfer.getData("text");
}




function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let element = document.getElementById(data);
    let clone = element.cloneNode();
    clone.draggable = true;
    clone.classList.add("video");
    element.draggable = true;

    if (element.tagName === "VIDEO") {
        videos_a_manipular.push(clone);
        let video_index = videos_a_manipular.length - 1;
        let galeriaCapturas = document.createElement("div");
        galeriaCapturas.id = "capturas_" + video_index;
        document.querySelector("#capturas").appendChild(galeriaCapturas);
        let archivo_id = clone.getAttribute('archivo_id');
        let proyecto_ref = clone.getAttribute('proyecto_ref');
        crear_capturas(video_index, archivo_id, proyecto_ref);
    }
}



function videoToBlob(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise(resolve => {
        canvas.toBlob(resolve, 'video/mp4');
    });
}

async function crear_capturas(video_index, id_archivo, proyecto_ref) {
    try {
        console.log('video_index', video_index);
        console.log('id_archivo', id_archivo);
        console.log('proyecto_ref', proyecto_ref);
        const video = videos_a_manipular[video_index];
        console.log('video', video);
        const videoBlob = await videoToBlob(video);
        const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('referencia_proyecto', proyecto_ref);
        formData.append('id_archivo', id_archivo);

        const url = MY_DOMAIN + '/servicios/videos/editor/crear_capturas/';
        const csrf_token = $('[name=csrfmiddlewaretoken]').val();

        const response = await $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrf_token,
            },
            data: formData,
            processData: false,
            contentType: false,
        });

        console.log('Respuesta del servidor:', response);
        const objeto_capturas = response.objeto_capturas;
        const archivo_id = objeto_capturas.archivo_id;
        const capturas = objeto_capturas.capturas;
        mostrar_capturas(capturas, archivo_id, proyecto_ref, video_index);
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
}

async function mostrar_capturas(capturas, archivo_id, proyecto_ref, indexVideo) {
    const duracion_Video = videos_a_manipular[indexVideo].duration;
    const anchoImagen = 60;

    const capturasContainer = document.getElementById('capturas');

    // Crear el contenedor de la galería
    const galeriaContainer = document.createElement('div');
    galeriaContainer.classList.add('galeria-container');
    galeriaContainer.setAttribute('id', `galeria_capturas_${archivo_id}`);
    galeriaContainer.setAttribute('indexvideo', indexVideo);

    // Configurar el estilo del contenedor
    galeriaContainer.style.width = (duracion_Video / anchoImagen) + 'cm';  // Ajustar el ancho máximo
    galeriaContainer.style.height = '60px';  // Ajustar el ancho máximo
    galeriaContainer.style.overflowX = 'auto'; // Permitir desplazar la galería horizontalmente
    galeriaContainer.style.position = 'relative';

    // Contenedor para los botones derecho e izquierdo
    const botonesContainer = document.createElement('div');
    botonesContainer.classList.add('botones-container');
    galeriaContainer.appendChild(botonesContainer);

    // Contador para llevar el control de imágenes cargadas
    let imagenesCargadas = 0;

    // Crear elementos img para cada captura
    for (let index = 0; index < capturas.length; index++) {
        try {
            const captura = capturas[index];
            const imagen = await cargarImagen(captura.ruta);  // Esperar a que la imagen se cargue

            // Configurar propiedades de la imagen
            imagen.alt = `Captura ${index}`;
            imagen.style.width = anchoImagen + 'px';
            imagen.style.height = '60px';
            imagen.style.marginBottom = '0px';

            // Agregar la imagen al contenedor solo si se carga correctamente
            galeriaContainer.appendChild(imagen);
            imagenesCargadas++;
        } catch (error) {
            console.error(error.message);
        }
    }

    // Mostrar la galería solo si todas las imágenes se han cargado correctamente
    if (imagenesCargadas === capturas.length) {
        capturasContainer.appendChild(galeriaContainer);

        // Agregar evento clic al contenedor de la galería
        galeriaContainer.addEventListener('click', (event) => {
            const contenedorRect = galeriaContainer.getBoundingClientRect();
            const x = event.clientX - contenedorRect.left;  // Coordenada X del clic con respecto al contenedor
            const porcentajeX = (x / contenedorRect.width) * 100;  // Porcentaje del clic en relación con el ancho del contenedor

            // Calcular el tiempo correspondiente en base al porcentaje
            const tiempo = (porcentajeX / 100) * capturas[capturas.length - 1].tiempo;
            //console.log('Clic en la galería. Tiempo:', tiempo);
            ver_video(indexVideo, tiempo);
        });

        // Crear los botones dentro del contenedor de botones
        const botonDerecho = document.createElement('div');
        botonDerecho.classList.add('boton-derecho');
   
        const botonIzquierdo = document.createElement('div');
        botonIzquierdo.classList.add('boton-izquierdo');
      
        botonesContainer.appendChild(botonDerecho);
        botonesContainer.appendChild(botonIzquierdo);

        // Actualizar posición de los botones al hacer scroll
        galeriaContainer.addEventListener('scroll', () => {
            actualizarPosicionBotones(botonesContainer, galeriaContainer);
        });
    } else {
        // Si no se cargaron todas las imágenes, eliminar el contenedor de la galería
        document.body.removeChild(galeriaContainer);
    }
}

function actualizarPosicionBotones(botonesContainer, galeriaContainer) {
    botonesContainer.style.left = galeriaContainer.scrollLeft + 'px';
}





async function ver_video(indexVideo, tiempo) {
    const videoVisualizacion = document.getElementById('video_visualizaciones');
    try {
        const nuevoVideoSrc = videos_a_manipular[indexVideo].src;

        // Detener la reproducción actual
        videoVisualizacion.pause();

        // Establecer el nuevo video
        videoVisualizacion.src = nuevoVideoSrc;

        // Esperar a que el video se cargue completamente
        await videoVisualizacion.load();

        // Establecer el tiempo después de cargar el video
        videoVisualizacion.currentTime = tiempo;

        // Iniciar la reproducción
        await videoVisualizacion.play();
    } catch (error) {
        console.error(error.message);
    }
}




function actualizarTiempoActual(tiempoActual, duracionTotal) {
    const formatoTiempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = Math.floor(segundos % 60);
        return `${minutos < 10 ? '0' : ''}${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
    };

    const tiempoActualFormateado = formatoTiempo(tiempoActual);
    const duracionTotalFormateada = formatoTiempo(duracionTotal);

    const tiempoInfo = document.getElementById('video-time');
    tiempoInfo.textContent = `${tiempoActualFormateado} | ${duracionTotalFormateada}`;
}



function cargarImagen(src) {
    return new Promise((resolve, reject) => {
        const imagen = new Image();
        imagen.src = src;
        imagen.onload = () => resolve(imagen);
        imagen.onerror = () => reject(new Error(`Error cargando la imagen ${src}`));
    });
}





/*####################################################################*/
/*################### ELIMINAR UN ARCHIVO ############################*/
/*####################################################################*/

function eliminar_archivo(archivo_id) {
    let url_eliminar_archivos = MY_DOMAIN + "/servicios/videos/editor/proyecto/eliminar_archivo/";
    console.log('archivo_id eliminar_archivo', archivo_id)

    $.ajax({
        url: url_eliminar_archivos,
        type: 'POST',
        data: { archivo_id: archivo_id },
        headers: {
            'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
        },
        dataType: 'json',
        success: function (data) {
            console.log('Respuesta eliminar_archivo', data);
            if (data.status === 'success') {
                $(`#elemento_medio_${data.archivo_id}`).hide();
                $(`#galeria_capturas_${archivo_id}`).remove();
            } else {
                alert('Ocurrió un error al intentar eliminar el archivo .');
            }
        },
        error: function (error) {
            console.error('Error al realizar la petición:', error);
        }
    });
}

function previsualizar_video_muestra(src) {
    $(`#video_visualizaciones`).attr('src', src);
}

// function play_video(elemento_video) {
//     $(`#elemento_play`).toggle();
//     $(`#elemento_pause`).toggle();
//     let vid = document.getElementById(`${elemento_video}`);
//     vid.currentTime = 0;
//     vid.play();
// }

// function pause_video(elemento_video) {
//     $(`#elemento_play`).toggle();
//     $(`#elemento_pause`).toggle();
//     let vid = document.getElementById(`${elemento_video}`);
//     vid.pause();
// }

// function ir_al_principio(elemento_video) {
//     stop_video(elemento_video);
// }

// function ir_al_final(elemento_video) {
//     stop_video(elemento_video);
// }

// function stop_video(elemento_video) {
//     $(`#elemento_play`).show();
//     $(`#elemento_pause`).hide();
//     let vid = document.getElementById(`${elemento_video}`);
//     vid.currentTime = 0;
// }

// function retroceder_video(elemento_video) {
//     console.log("retrocediendo 5s");
//     ajustar_tiempo_video(elemento_video, -5);
// }

// function avanzar_video(elemento_video) {
//     console.log("avanzando 5s");
//     ajustar_tiempo_video(elemento_video, 5);
// }

// function ajustar_tiempo_video(elemento_video, segundos) {
//     let vid = document.getElementById(`${elemento_video}`);
//     console.log("vid.currentTime", vid.currentTime);

//     // Asegúrate de que segundos sea un número y está en formato correcto
//     segundos = parseFloat(segundos);
//     if (isNaN(segundos)) {
//         console.error('El valor proporcionado no es un número válido.');
//         return;
//     }

//     // Redondea los segundos antes de asignarlos
//     segundos = Math.round(segundos);

//     vid.currentTime += segundos;
//     console.log("vid.currentTime", vid.currentTime);
// }
