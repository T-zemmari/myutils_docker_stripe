document.getElementById('pdfForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    // Muestra el spinner al enviar el formulario
    $(`#btn_unir_pdf`).hide();
    $('#spinner').show();

    fetch('http://127.0.0.1/unir-pdf/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data);
                let unique_file_name = "";
                if (data.unique_file_name != "") {
                    unique_file_name = data.unique_file_name;
                }

                // Simula una espera de 3 segundos antes de mostrar el botón de descarga
                setTimeout(function () {
                    $('#spinner').hide();
                    $(`#btn_unir_pdf`).hide();
                    $(`#a_descargar_pdf`).show();
                    $('#pdfFiles').val('');
                    let url_descarga = "http://127.0.0.1/descargar-pdf/" + unique_file_name + '/';
                    $(`#a_descargar_pdf`).attr('href', url_descarga);
                }, 3000); // Espera 3000 milisegundos (3 segundos)
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

$(document).ready(function () {
    $(`#a_descargar_pdf`).click(function () {
        $('#pdfFiles').val('');
        $('#modalUnirPDF').modal('hide');
        $(`#btn_unir_pdf`).show();
        $(`#a_descargar_pdf`).hide();
    });
});
