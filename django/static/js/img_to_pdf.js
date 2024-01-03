$(document).ready(function () {
    // Manejar el cambio en el input de carga de imágenes
    $("#input_image").change(function () {
        previewImages(this);
        if (this.files.length == 0) {
            $(`#convert_to_pdf`).prop("disabled", true);
        } else {
            $(`#convert_to_pdf`).prop("disabled", false);
        }
    });

    // Manejar el clic en el botón "Convertir a PDF"
    $("#convert_to_pdf").click(function () {
        convertImagesToPdf();
    });
});

function previsualizar_pdf_generado(url) {
    console.log("url", url);
    const pdfPreview = document.getElementById("pdf_previsualizacion");
    if (url.length > 0) {
        // Crear un Blob a partir de la URL del PDF
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const pdfURL = URL.createObjectURL(blob);
                pdfPreview.innerHTML = `<embed src="${pdfURL}" type="application/pdf" style="width:100%;min-height:430px">`;
            })
            .catch((error) => {
                console.error("Error al cargar el PDF:", error);
            });
    }
}

function previewImages(input) {
    // Limpiar la sección de previsualización
    $("#image_preview_container").empty();

    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            const reader = new FileReader();

            reader.onload = function (e) {
                // Crear un elemento de imagen y agregarlo a la sección de previsualización
                const imageElement = $("<img>");
                imageElement.attr("src", e.target.result);
                $("#image_preview_container").append(imageElement);
                $(`#convert_to_pdf`).prop("disabled", false);
                $(`#image_preview_container`).css("background-image", "unset");
            };

            reader.readAsDataURL(file);
        }
    } else {
        $(`#convert_to_pdf`).prop("disabled", true);
    }
}

function convertImagesToPdf() {
    // Recopilar las imágenes seleccionadas

    $(`#convert_to_pdf`).prop("disabled", true);
    $("#loading-spinner").show();

    const input_image = document.getElementById("input_image");
    const formData = new FormData();

    for (let i = 0; i < input_image.files.length; i++) {
        const file = input_image.files[i];
        formData.append("images", file, file.name);
    }
    formData.append(
        "csrfmiddlewaretoken",
        $("input[name=csrfmiddlewaretoken]").val()
    );
    // Realizar la solicitud AJAX al servidor para convertir a PDF
    let url =
    MY_DOMAIN+"/servicios/imagenes/convertir_img_to_pdf/";
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            setTimeout(() => {
                $("#loading-spinner").hide();
                // Mostrar el enlace para descargar el PDF generado
                $("#pdf_download_container").show();
                console.log("pdf_url", data.pdf_url);
                let downloadUrl = url + data.pdf_url + "/";
                previsualizar_pdf_generado(downloadUrl);
                let HTML_BOTONES = `
          <div class="row">
            <div class="col-6">
              <a href="${downloadUrl}" style="width:100%;margin-top:10px" class="btn btn-success btn-sm" id="btn_descarga_pdf_generado" download onclick="eliminarArchivo('${data.pdf_url}')">Descargar</a>
            </div>
            <div class="col-6">
              <button style="width:100%; margin-top:10px;" class="btn btn-danger btn-sm" onclick="cancelar_conversion()">Cancelar</button>
            </div>
          </div>
                  `;
                $("#pdf_download_container").html(HTML_BOTONES);
                $(`#convert_to_pdf`).hide();
                $(`#input_image`).hide();
            }, 2000);
        },
        error: function () {
            alert("Error al convertir imágenes a PDF.");
        },
    });
}

function eliminarArchivo(filename) {
    $("#loading-spinner").show();

    setTimeout(function () {
        $.ajax({
            url: MY_DOMAIN+"/servicios/imagenes/eliminar/",
            method: "POST",
            data: {
                filename: filename,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (response) {
                console.log(response.message);
                $(`#pdf_download_container`).hide();

                $(`#convert_to_pdf`).show();
                $("#loading-spinner").hide();
                $("#image_preview_container").empty();
                $("#input_image").val("");
                $(`#convert_to_pdf`).prop("disabled", true);
                $(`#pdf_previsualizacion`).html("");
                $(`#image_preview_container`).css(
                    "background-image",
                    `url('{% static "img/iconos/icono_subir_img_1.png" %}')`
                );
            },
            error: function () {
                console.log("Error al eliminar el archivo.");
                $(`#convert_to_pdf`).prop("disabled", true);
                $(`#convert_to_pdf`).show();
                $(`#pdf_previsualizacion`).html("");
            },
        });
    }, 1000);
}
function cancelar_conversion() {
    // Restablecer la página
    $("#loading-spinner").hide();
    $("#pdf_download_container").hide();
    $("#image_preview_container").empty();
    $("#input_image").val("");
    $("#convert_to_pdf").show();
    $("#pdf_previsualizacion").html("");
    $("#convert_to_pdf").prop("disabled", true);
    $(`#input_image`).show();
    $(`#image_preview_container`).css(
        "background-image",
        `url('{% static "img/iconos/icono_subir_img_1.png" %}')`
    );
}