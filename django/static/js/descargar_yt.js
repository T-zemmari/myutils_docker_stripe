$(document).ready(function () {
  console.log('y MY_DOMAIN',MY_DOMAIN)
  $('#downloadFormat').change(function () {
    let selectedFormat = $(this).val();
    if (selectedFormat === '') {
      $(`#small_selecciona_formato`).show();
    } else {
      $(`#small_selecciona_formato`).hide();
    }
    if (selectedFormat === 'mp4') {
      $('#resolutionField').show();
      $(`#resolutions`).show();
      $(`#resolutions`).parent().show();
      updateResolutions();
      $('#fileSize').show();
    } else {
      $('#resolutionField').hide();
      $('#fileSize').hide();
    }
  });

  $('#youtubeDownloadForm').submit(function (e) {
    e.preventDefault();

    let youtubeUrl = $('#youtubeUrl').val();
    let downloadFormat = $('#downloadFormat').val();
    let selectedResolution = $('#resolutions').val();

    let url = MY_DOMAIN+"/servicios/video/download-yt/";

    $('#spinner_yt_donwload').show();
    $('#btn_enviar_solicitud').prop('disabled', true);



    $.ajax({
      url: url,
      method: 'POST',
      data: {
        'youtube_url': youtubeUrl,
        'download_format': downloadFormat,
        'resolution': selectedResolution,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
      success: function (response) {
        if (response.success) {
          console.log("response: ", response);
          $('#contenedor_btn_descargar').show();
          $('#btn_enviar_solicitud').hide();
          let downloadUrl = url + 'files/' + response.unique_filename;
          $('#contenedor_btn_descargar_hijo').html(`<a href="${downloadUrl}" style="width:100%" class="btn btn-success" id="btn_descarga_yt" download onclick="eliminarArchivo('${response.unique_filename}')">Descargar</a>`);
          $('#btn_enviar_solicitud').prop('disabled', false);
        } else {
          alert('Error al descargar el video de YouTube: ' + response.message);
        }
      },
      error: function () {
        alert('Error en la solicitud AJAX');
      },
      complete: function () {
        // Ocultar el spinner una vez que se complete la solicitud
        $('#spinner_yt_donwload').hide();
      }
    });

  });
});

function isValidUrl(url) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

// Función para actualizar las opciones de resolución
function updateResolutions() {
  let youtubeUrl = $('#youtubeUrl').val();

  if (youtubeUrl.trim() !== '' && isValidUrl(youtubeUrl)) {

    $.ajax({
      url: MY_DOMAIN+'/servicios/video/download-yt/get-resolutions/',
      method: 'POST',
      data: {
        'youtube_url': youtubeUrl,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
      success: function (response) {
        console.log(response);
        if (response.success) {
          $('#resolutions').empty();
          // Filtra las resoluciones para eliminar las entradas nulas
          const resolutions = [...new Set(response.resolutions.filter(resolution => resolution !== null))];
          console.log(resolutions);
          // Crea el contenido HTML para las opciones
          let newOptionsHTML = '';
          for (let i = 0; i < resolutions.length; i++) {
            let resolution = resolutions[i];
            newOptionsHTML += `<option value="${resolution}">${resolution}</option>`;
          }
          // Actualiza el contenido del elemento select
          $('#resolutions').html(newOptionsHTML);
        }
      },
      error: function () {
        console.log('Error al obtener resoluciones.');
      },
    });
  } else {
    alert('Debes introducir una url valida');
    $(`#resolutions`).hide();
    $(`#resolutions`).parent().hide();
  }
}

// Función para eliminar el archivo descargado
function eliminarArchivo(filename) {
  $('#btn_enviar_solicitud').show();
  $(`#btn_descarga_yt`).hide();
  setTimeout(() => {
    $.ajax({
      url: MY_DOMAIN+'/servicios/video/download-yt/delete-file/',
      method: 'POST',
      data: {
        'filename': filename,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
      success: function (response) {
        console.log(response.message);
        $(`#youtubeUrl`).val('');
        $(`#downloadFormat`).val('');
        $(`#resolution`).val('');
        $(`#resolutionField`).hide();

      },
      error: function () {
        console.log('Error al eliminar el archivo.');
      }
    })
  }, 2000);
}
