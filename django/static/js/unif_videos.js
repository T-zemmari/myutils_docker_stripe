function unir_videos() {

    $(`#contenedor_spinner`).show();
    $(`#btn_unir_videos`).prop('disabled', true);

    let videosAgregados = $("#videos_agregados");
    let formData = new FormData();

    // Verificar si hay videos agregados
    if (videosAgregados.find(".video-container").length === 0) {
        console.log("No hay videos para unir.");
        return;
    }

    if (videosAgregados.find(".video-container").length === 1) {
        alert("Hay que seleccionar al menos 2 videos.");
        $(`#contenedor_spinner`).hide();
        $(`#btn_unir_videos`).prop('disabled', false);
        return;
    }

    // Crear una lista de promesas para cargar cada video
    let promises = [];

    videosAgregados.find(".video-container video").each(function (index) {
        let videoElement = $(this)[0];
        let videoSrc = videoElement.src;

        // Crear una promesa para cargar cada video
        let promise = fetch(videoSrc)
            .then(response => response.blob())
            .then(blob => {
                let videoFile = new File([blob], `video_${index}.webm`, { type: "video/webm" });
                formData.append("videos[]", videoFile);
            });

        promises.push(promise);
    });

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises)
        .then(() => {
            // Agregar otros datos al FormData si es necesario
            let csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
            formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);

            // Realizar la petición AJAX
            let url = MY_DOMAIN + "/servicios/videos/accion_unir_videos/";
            $.ajax({
                url: url,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Solicitud enviada correctamente:", response);
                    $(`#container_iniciar_operacion`).hide();
                    $(`#container_video_final`).show();
                    $(`#contenedor_spinner`).hide();
                    $(`#btn_unir_videos`).prop('disabled', false);
                    // Establecer el src del video final y mostrarlo
                    let url_video = url + response.video_name;

                    let videoFinal = $("#video_final");
                    videoFinal.attr("src", url_video);
                    videoFinal[0].load();

                    // Establecer el href del enlace de descarga
                    let aDescargarVideo = $("#a_descargar_video");
                    aDescargarVideo.attr("href", url_video);
                    aDescargarVideo.attr("filename", response.video_name);
                },
                error: function (error) {
                    console.error("Error en la solicitud:", error);
                    $(`#contenedor_spinner`).hide();
                    $(`#btn_unir_videos`).prop('disabled', false);
                    // Puedes manejar errores o mostrar mensajes al usuario si es necesario
                },
            });
        }
        )
}

$(document).ready(function () {

    $('#a_descargar_video').on('click', function () {
        setTimeout(() => {
            archivo_descargado()
        }, 1000)

    });

    let dropArea = $("#drop_area");
    let inputVideos = $("#input_videos");
    let videosAgregados = $("#videos_agregados");

    dropArea.on("dragover", function (e) {
        e.preventDefault();
        $(this).addClass("highlight");
    });

    dropArea.on("dragleave", function (e) {
        e.preventDefault();
        $(this).removeClass("highlight");
    });

    dropArea.on("drop", function (e) {
        e.preventDefault();
        $(this).removeClass("highlight");

        let files = e.originalEvent.dataTransfer.files;
        handleVideoFiles(files);
    });

    // Escuchar el cambio en el input file
    inputVideos.on("change", function () {
        let files = this.files;
        handleVideoFiles(files);
    });

    // Utilizar solo el input file para el clic
    inputVideos.on("click", function (e) {
        e.stopPropagation();
    });

    // Escuchar el clic en el área y actilet el clic en el input file
    dropArea.on("click", function () {
        inputVideos.trigger("click");
    });

    function handleVideoFiles(files) {
        // Verifica si se han seleccionado más de 5 videos


        if (files.length > 5) {
            alert("No puedes cargar más de 5 videos");
            return;
        }

        // Verifica la cantidad total de videos ya agregados
        let totalVideosAgregados = videosAgregados.find(".video-container").length;

        // Agrega videos al input y muestra miniaturas si no se excede el límite total
        if (totalVideosAgregados + files.length <= 5) {

            for (let i = 0; i < files.length; i++) {
                let video = files[i];
                if (video.type.match("video.*")) {

                    if (inputVideos[0].files.length < 5) {
                        let formData = new FormData();
                        formData.append("videos[]", video);
                        let videoContainer = $("<div class='video-container'></div>");
                        let miniaturaContainer = $("<div class='miniatura-container'></div>");
                        let videoPreview = $("<video controls class='miniatura' style='width:100%'></video>");
                        let deleteIcon = $("<span class='delete-icon'>&times;</span>");

                        videoPreview[0].src = URL.createObjectURL(video);

                        deleteIcon.on("click", function () {
                            // Elimina el video y la miniatura al hacer clic en el icono de eliminar
                            $(this).parent().remove();
                        });

                        videoContainer.append(videoPreview);
                        videoContainer.append(deleteIcon);
                        miniaturaContainer.append(videoContainer);
                        videosAgregados.append(miniaturaContainer);
                    } else {
                        alert("No puedes cargar más de 5 videos");
                        return;
                    }
                } else {
                    alert("El archivo seleccionado no es un video");
                    return;
                }
            }
        } else {
            alert("No puedes agregar más videos. Ya has alcanzado el límite de 5 videos.");
        }

        // Limpia el input para permitir la carga del mismo archivo nuevamente
        inputVideos.val("");
    }
});

function archivo_descargado() {
    console.log('archivo_descargado');
    $('#a_descargar_video')
        .off('click')
        .removeAttr('href')
        .css({ 'pointer-events': 'none' })
        .addClass('disabled')
        .text('Archivo descargado')
        ;
    let file_name = $('#a_descargar_video').attr('filename');
    console.log('file_name', file_name)
    setTimeout(() => {
        eliminar_video_unificado(file_name)
    }, 1000);

}

function eliminar_video_unificado(file_name) {
    console.log('Eliminar archivo:', file_name)
    let url_eliminar = MY_DOMAIN + '/servicios/videos/eliminar_video_unificado/' + file_name + '/'

    $.ajax({
        url: url_eliminar,
        method: 'POST',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val()
        },
        success: function (resultado) {
            console.log('Resultado de eliminación:', resultado)
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error en la eliminación:', textStatus, errorThrown)
            // Muestra un mensaje de error al usuario o realiza otras acciones según sea necesario
        }
    })
}

function funcion_nueva_operacion() {
    let file_name = $('#a_descargar_video').attr('filename');
    console.log('file_name', file_name)
    eliminar_video_unificado(file_name);
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}