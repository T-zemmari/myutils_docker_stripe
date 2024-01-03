document.addEventListener("DOMContentLoaded", function() {
    console.log('Página cargada');

    const pdfContainer = document.getElementById('pdfContainer');
    const container = document.getElementById("container");
    const signatureImage = document.getElementById("signatureImage");

    document.getElementById("pdfInput").addEventListener("change", function () {
        const pdfInput = this;

        if (pdfInput.files.length > 0) {
            const pdfFile = pdfInput.files[0];
            const fileReader = new FileReader();

            fileReader.onload = function () {
                const typedarray = new Uint8Array(this.result);

                pdfjsLib.getDocument(typedarray).promise.then(function (pdfDoc) {
                    const numPages = pdfDoc.numPages;

                    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                        pdfDoc.getPage(pageNum).then(function (page) {
                            const viewport = page.getViewport({ scale: 1 });
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport,
                            };

                            page.render(renderContext).promise.then(function () {
                                const dataURL = canvas.toDataURL("image/png");
                                pdfContainer.innerHTML += `<img src="${dataURL}" class="pdf-image" data-page="${pageNum}" style="display: ${pageNum === 1 ? 'block' : 'none'};">`;
                            });
                        });
                    }
                });
            };

            fileReader.readAsArrayBuffer(pdfFile);
        }
    });

    document.getElementById("imageInput").addEventListener("change", function () {
        const imageInput = this;

        if (imageInput.files.length > 0) {
            const imageFile = imageInput.files[0];
            
            if (imageFile.type.startsWith("image/")) {
                const imageURL = URL.createObjectURL(imageFile);
                signatureImage.src = imageURL;
            } else {
                alert("Por favor, seleccione un archivo de imagen válido.");
            }
        }
    });

    // Hacer la imagen draggable
    interact('#signatureImage')
        .draggable({
            onmove: function (event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        });
});
