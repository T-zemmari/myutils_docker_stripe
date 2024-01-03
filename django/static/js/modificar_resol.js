$(document).ready(function () {
    $('.resolution-select').change(function () {
        $('.resolution-select').not(this).val(''); // Establece otros selects en la opción predeterminada
    });

    const inputImage = $('#inputImage');
    inputImage.change(function () {
        previewImage(this);
    });
});


////////////////////////////////////////////////////////////////////

const selectedResolution = function (selectId) {
    return $(`#${selectId} option:selected`).val();
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imagePreview = $('#previewImage');
            imagePreview.attr('src', e.target.result);
            imagePreview.css('display', 'block');
            // Aplica una transición de opacidad
            imagePreview.animate({ opacity: 1 }, 200); // 500 ms (0.5 segundos) de duración
        };

        reader.readAsDataURL(input.files[0]);
    }
}



// Obtener los datos de resolución y formato cuando se hace clic en el botón "Modificar Imagen"
$('#btnModifyImage').click(function () {
    let format = $('#format').val();
    let inputImage = $('#inputImage')[0];
    let imagen = inputImage.files[0];

    let resolutionWeb = selectedResolution('resolutionWeb');
    let resolutionRedesSociales = selectedResolution('resolutionRedesSociales');
    let resolutionPresentaciones = selectedResolution('resolutionPresentaciones');
    let resolutionVideos = selectedResolution('resolutionVideos');

    if (!resolutionWeb && !resolutionRedesSociales && !resolutionPresentaciones && !resolutionVideos) {
        alert('Por favor, seleccione al menos una resolución.');
        return;
    }

    let modifiedImages = [];

    // Iterar sobre las resoluciones seleccionadas
    const resolutions = [resolutionWeb, resolutionRedesSociales, resolutionPresentaciones, resolutionVideos];
    for (let i = 0; i < resolutions.length; i++) {
        let resolution = resolutions[i];

        if (!resolution) {
            continue; // Salta las resoluciones no seleccionadas
        }

        let formData = new FormData();
        formData.append('resolution', resolution);
        formData.append('format', format);
        formData.append('imagen', imagen);
        formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());

        let url = MY_DOMAIN+"/servicios/imagen/modificar_resolucion/";

        $('#btnModifyImage').hide();
        $('#contenedor_spinner_img_mod').show();

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                if (data.success) {
                    let unique_filename = data.modified_image;
                    let downloadUrl = MY_DOMAIN+"/servicios/imagen/modificar_resolucion" + unique_filename.replace("/media/carp_imgs/", "/");
                    console.log("downloadUrl: ", downloadUrl);
                    setTimeout(() => {
                        //$('#contenedor_btn_descargar_img').html(`<a href="${downloadUrl}" style="width:100%;" class="btn btn-success" download id="a_download_img_res_mod" onclick="eliminarImagenModificada('${unique_filename.replace("/media/carp_imgs/", "").replace('/media/carps_imgs/', '')}')">Descargar</a>`);
                        $('#contenedor_btn_descargar_img').html(`<a href="${downloadUrl}" style="width:100%;" class="btn btn-success" download id="a_download_img_res_mod" onclick="imagen_descargada()">Descargar</a>`);
                        $('#contenedor_spinner_img_mod').hide();
                    }, 2000);
                } else {
                    alert('Error al modificar la imagen: ' + data.error);
                    $('#btnModifyImage').show();
                }
            },
            error: function () {
                alert('Error en la solicitud al servidor.');
                $('#btnModifyImage').show();
            }
        });
    }
});



function imagen_descargada(){
    setTimeout(() => {
        window.location.reload()
    }, 1000);
}
// Función para eliminar el archivo descargado
function eliminarImagenModificada(filename) {

    $('#contenedor_spinner_img_mod').show();
    $('#a_download_img_res_mod').hide();

    setTimeout(() => {
        $.ajax({
            url: MY_DOMAIN+'/imagen/delete-file/',
            method: 'POST',
            data: {
                'filename': filename,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                console.log(response.message);
                $(`#btnModifyImage`).prop('disabled', false);
                $(`#resolutionRedesSociales`).val('');
                $(`#resolutionPresentaciones`).val('');
                $(`#resolutionVideos`).val('');
                $('#btnModifyImage').show();     
                $('#contenedor_spinner_img_mod').hide();
            },
            error: function () {
                console.log('Error al eliminar el archivo.');
                $('#contenedor_spinner_img_mod').hide();
            }
        })
    }, 2000);
}
