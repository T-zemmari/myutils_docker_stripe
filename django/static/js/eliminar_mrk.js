// Función para mostrar la imagen seleccionada
function showSelectedImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#selectedImage').attr('src', e.target.result);
            $('#selectedImage').show();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Escucha el cambio en el input de imagen
$('#inputImage').on('change', function () {
    showSelectedImage(this);
    $('#btnRemoveWatermark').show();
    $('#downloadLink').hide();
});

// Escucha el clic en el botón para eliminar la marca de agua
$('#btnRemoveWatermark').on('click', function () {
    // Muestra el spinner
    $('#spinner').show();

    // Crea un objeto FormData con la imagen seleccionada
    var formData = new FormData();
    formData.append('image', $('#inputImage')[0].files[0]);

    // Realiza una petición AJAX para eliminar la marca de agua
    $.ajax({
        url: 'http://127.0.0.1:8000/watermark_remover/eliminar-marca-agua/',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            // Oculta el spinner
            $('#spinner').hide();

            if (response.success) {
                // Si se eliminó la marca de agua con éxito, muestra el enlace de descarga
                $('#downloadLink').attr('href', response.image_url);
                $('#downloadLink').show();
                $('#btnRemoveWatermark').hide();
            } else {
                alert(response.message);
            }
        },
        error: function (xhr, status, error) {
            // Oculta el spinner en caso de error
            $('#spinner').hide();
            alert('Error al eliminar la marca de agua.');
        }
    });
});
