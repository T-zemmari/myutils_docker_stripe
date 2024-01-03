function previsualizar_pdf_generado(url) {
    console.log("url", url);
    const pdfPreview = document.getElementById("contenedor_previsualizacion_documento");
    if (url.length > 0) {
        // Crear un Blob a partir de la URL del PDF
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const pdfURL = URL.createObjectURL(blob);
                pdfPreview.innerHTML = `<embed src="${pdfURL}" type="application/pdf" style="width:100%;min-height:430px">`;
                $(`#enviar_peticion`).prop('disabled', true);
            })
            .catch((error) => {
                console.error("Error al cargar el PDF:", error);
                $(`#enviar_peticion`).prop('disabled', false);
            });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const documentoInput = document.getElementById('documento')
    const enviarPeticionButton = document.getElementById('enviar_peticion')
    const previsualizacionDocumento = document.getElementById('contenedor_previsualizacion_documento')
    const contenedorIcono = document.querySelector('.contenedor-icono-cargar')

    documentoInput.addEventListener('change', function () {
        // Habilitar el botón si se selecciona un archivo .doc, .docx o .txt, de lo contrario, deshabilitarlo
        const allowedExtensions = ['.txt']
        const selectedFile = documentoInput.files[0]

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
            const isExtensionAllowed = allowedExtensions.includes('.' + fileExtension)

            if (isExtensionAllowed) {
                enviarPeticionButton.removeAttribute('disabled')

                // Mostrar el contenido del archivo de texto en la previsualización
                if (fileExtension === 'txt') {
                    const reader = new FileReader()
                    reader.onload = function (e) {
                        previsualizacionDocumento.innerHTML = createPagesFromText(e.target.result)
                        previsualizacionDocumento.classList.add('scrollable') // Agregar clase para hacer scroll
                    }
                    reader.readAsText(selectedFile)
                } else {
                    previsualizacionDocumento.innerHTML = '' // Limpiar el contenido si no es un archivo de texto
                    previsualizacionDocumento.classList.remove('scrollable') // Quitar clase para hacer scroll
                }
            } else {
                enviarPeticionButton.setAttribute('disabled', 'true')
                alert('Solo se permiten archivos .txt')
            }
        }
    })

    enviarPeticionButton.addEventListener('click', function (event) {
        event.preventDefault()
        if (!enviarPeticionButton.hasAttribute('disabled')) {
            $(`#enviar_peticion`).prop('disabled', true);
            const formData = new FormData()
            formData.append('documento', documentoInput.files[0])
            let csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val()
            formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken)

            let url = MY_DOMAIN+'/servicios/documentos/convertir_documentos_a_pdf/'

            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.file_name) {
                        console.log('txt_to_pdf', data)
                        let download_url = url + data.file_name;
                        previsualizar_pdf_generado(download_url)
                    } else {
                        alert('Hubo un error al procesar el archivo.')
                    }
                })
                .catch((error) => {
                    console.error('Error en la solicitud: ' + error)
                })
        }
    })

    // Función para dividir el texto en páginas A4
    function createPagesFromText(text) {
        const words = text.split(' ')
        const pageSize = 30000
        let currentPage = 1
        let currentPageText = ''
        let pagesHTML = ''

        for (const word of words) {
            if ((currentPageText + ' ' + word).length < pageSize) {
                currentPageText += ' ' + word
            } else {
                pagesHTML += `<div class="page">${currentPageText}</div>`
                currentPageText = word
                currentPage += 1
            }
        }

        // Agregar la última página si hay contenido restante
        if (currentPageText.length > 0) {
            pagesHTML += `<div class="page">${currentPageText}</div>`
        }

        // Mostrar el contenedor del icono
        contenedorIcono.style.display = 'flex'

        return pagesHTML
    }
})