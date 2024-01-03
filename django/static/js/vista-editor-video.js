// var videos = []; // arreglo para almacenar los videos

// function allowDrop(event) {
//   event.preventDefault();
// }

// function drag(event) {
//   event.dataTransfer.setData("text", event.target.id);
// }

// function drop(event) {
//   event.preventDefault();
//   var data = event.dataTransfer.getData("text");
//   var element = document.getElementById(data);
//   var clone = element.cloneNode();
//   clone.draggable = true;
//   clone.classList.add("video");
//   element.draggable = false;

//   if (element.tagName === "VIDEO") {
//     videos.push(clone); // agregar el video a la matriz
//     var videoIndex = videos.length - 1; // obtener el índice del video
//     var capturas = []; // arreglo para almacenar las capturas
//     var galeriaCapturas = document.createElement("div");
//     galeriaCapturas.id = "capturas_" + videoIndex;
//     document.querySelector("#capturas").appendChild(galeriaCapturas);
//     // enviar el índice del video y el arreglo de capturas a la función obtenerCapturas
//     obtenerCapturas(videoIndex, capturas);
//   }
// }

// function obtenerCapturas(videoIndex, capturas) {
//   let duracion_total_videos = 0;
//   var duracion = 0
//   videos.forEach(video => {
//     let video_elemento = document.getElementById(`${video['id']}`);
//     duracion = Math.ceil(parseFloat(video_elemento.duration));
//     duracion_total_videos += Math.ceil(parseFloat(video_elemento.duration));
//   });
//   let archivo_video = videos[videoIndex].src;
//   let archivo_id = videos[videoIndex].id.split("video_")[1];
//   let params = new Proxy(new URLSearchParams(window.location.search), {
//     get: (searchParams, prop) => searchParams.get(prop),
//   });
//   let proyecto_id = params.proyecto;
//   let previsualizacion = document.getElementById("video_visualizaciones");
//   previsualizacion.src = "./assets/videos/cargando_1.mp4";
//   previsualizacion.play();
//   previsualizacion.loop = true;

//   let info = new FormData();

//   info.append("action", "obtener_capturas");
//   info.append("ruta_archivo", archivo_video);
//   info.append("archivo_id", archivo_id);
//   info.append("proyecto_id", proyecto_id);
//   info.append("duracion_video", duracion);

//   jQuery.ajax({
//     url: "convertir.php",
//     data: info,
//     cache: false,
//     contentType: false,
//     processData: false,
//     type: "POST",
//     success: function (data) {
//       console.log(data);
//       let obj = JSON.parse(data);
//       console.log(obj)
//       if (obj.status == "success") {
//         capturas = obj.array_capturas;
//         if (capturas.length > 0) {
//           let duracionVideo = videos[videoIndex].duration;
//           previsualizacion.pause();
//           previsualizacion.src = "none";
//           previsualizacion.loop = false;
//           crearDivimagenes(capturas, duracion_total_videos, duracionVideo, videoIndex, "prueba");
//         }
//       } else {
//         console.log("No se ha guardado");
//       }
//     },
//     error: function (XMLHttpRequest, textStatus, errorThrown) {
//       alert("Error: " + errorThrown);
//     },
//   });
// }


// function crearDivimagenes(capturas, duracion_total_videos, duracionVideo, videoIndex, opcion) {
//   const anchoImagen = 70;
//   const altoImagen = 70;
//   const maxAncho = duracionVideo * anchoImagen;
//   console.log('crearDivImagenes duracion_total_videos', duracion_total_videos);

//   const divImagenes = document.createElement("div");
//   divImagenes.style.display = "flex";
//   divImagenes.style.flexWrap = "nowrap";
//   divImagenes.style.justifyContent = "flex-start";
//   divImagenes.style.alignItems = "center";
//   //divImagenes.style.width = `${maxAncho}px`;
//   divImagenes.style.width = (capturas.length * 70);
//   divImagenes.style.borderRadius = "10px";

//   const divZonaMuerta = document.createElement('div');
//   divZonaMuerta.style.width = '10px';
//   divZonaMuerta.style.height = `${altoImagen}px`;
//   divZonaMuerta.className = 'zona-muerta';
//   let cantidad_total_capturas = capturas.length;

//   capturas.forEach((captura) => {
//     let guardar = true;

//     var comprobacion_imagen = new Image();
//     comprobacion_imagen.onload = function () {
//       guardar = true;
//       console.log("guardar", guardar);
//     };
//     comprobacion_imagen.onerror = function () {
//       guardar = false;
//       console.log("guardar", guardar);
//     };
//     comprobacion_imagen.src = captura;
//     if (guardar == true) {
//       const img = document.createElement("img");
//       img.src = captura;
//       img.className = "captura-imagen";
//       img.style.width = `${anchoImagen}px`;
//       img.style.height = `${altoImagen}px`;
//       if (capturas.indexOf(captura) == 0) {
//         img.style.borderTopLeftRadius = '10px';
//         img.style.borderBottomLeftRadius = '10px';
//       }
//       console.log('cantidad_total_capturas', cantidad_total_capturas);
//       if (capturas.indexOf(captura) == parseInt(cantidad_total_capturas) - 1) {
//         img.style.borderTopRightRadius = '10px';
//         img.style.borderBottomRightRadius = '10px';
//       }
//       img.addEventListener("click", () => {
//         const previsualizacion = document.getElementById(
//           "video_visualizaciones"
//         );
//         const boton_play = document.getElementById("elemento_play");
//         const boton_pause = document.getElementById("elemento_pause");
//         if (opcion == "prueba") previsualizacion.src = videos[videoIndex].src;
//         if (opcion == "concat") previsualizacion.src = videoIndex;
//         previsualizacion.currentTime = 0;
//         boton_play.style.display = "flex";
//         boton_pause.style.display = "none";

//         if (opcion == "prueba") {
//           createVideoBar(duracion_total_videos, videos[videoIndex].duration, videos[videoIndex]);
//         }
//         if (opcion == "concat") {
//           //createVideoBar(duracionVideo,videoIndex);
//         }
//       });
//       divImagenes.appendChild(img);
//     }
//   });
//   if (opcion == "concat") {
//     document.querySelector("#capturas").innerHTML = "";
//   }

//   document.querySelector("#capturas").appendChild(divImagenes);
//   document.querySelector("#capturas").appendChild(divZonaMuerta);
// }

// function createVideoBar(duracion_total, duracion_video, video) {

//   const videoBar = document.getElementById("video-bar");
//   const videoProgress = document.getElementById("video-progress");
//   const videoHandle = document.getElementById("video-handle");
//   const videoTime = document.getElementById("video-time");
//   let previsualizacion = document.getElementById("video_visualizaciones");
//   console.log('createVideoBar duracion_total_videos', duracion_total);
//   const anchoVideoBar = videoBar.offsetWidth;
//   const anchoProgreso = (duracion_total / anchoVideoBar) * 100;
//   videoProgress.style.width = `${anchoProgreso}%`;

//   let isMouseDown = false;
//   videoHandle.addEventListener("mousedown", handleMouseDown);
//   document.addEventListener("mouseup", handleMouseUp);
//   previsualizacion.addEventListener("loadedmetadata", handleVideoLoaded);
//   previsualizacion.addEventListener("timeupdate", handleTimeUpdate);

//   function handleMouseDown(event) {
//     isMouseDown = true;
//     document.addEventListener("mousemove", handleMouseMove);
//   }

//   function handleMouseMove(event) {
//     if (isMouseDown) {
//       const nuevaPosicion = event.pageX - videoBar.offsetLeft;
//       if (nuevaPosicion >= 0 && nuevaPosicion <= anchoVideoBar) {
//         const nuevoAnchoProgreso = (nuevaPosicion / anchoVideoBar) * 100;
//         videoProgress.style.width = `${nuevoAnchoProgreso}%`;
//         videoHandle.style.left = `${nuevaPosicion}px`;

//         const tiempoActual = Math.round(
//           (nuevaPosicion / anchoVideoBar) * duracion_total
//         );
//         videoTime.innerText = `${formatTime(tiempoActual)} / ${formatTime(
//           duracion_total
//         )}`;
//       }
//     }
//   }

//   function handleMouseUp(event) {
//     isMouseDown = false;
//     document.removeEventListener("mousemove", handleMouseMove);
//     const nuevaPosicion = event.pageX - videoBar.offsetLeft;
//     if (nuevaPosicion >= 0 && nuevaPosicion <= anchoVideoBar) {
//       const nuevoTiempo = (nuevaPosicion / anchoVideoBar) * duracion_total;
//       video.currentTime = nuevoTiempo;
//       previsualizacion.currentTime = video.currentTime;
//       previsualizacion.play(); // Reproducir el video desde la nueva posición
//     }
//   }

//   function handleVideoLoaded() {
//     videoTime.innerText = `0:00 / ${formatTime(duracion_total)}`;
//   }

//   function handleTimeUpdate() {
//     const tiempoActual = Math.round(previsualizacion.currentTime);
//     videoTime.innerText = `${formatTime(tiempoActual)} / ${formatTime(
//       duracion_total
//     )}`;

//     // Actualizar la barra de progreso y el control deslizante
//     const porcentajeProgreso = (tiempoActual / duracion_total) * 100;
//     videoProgress.style.width = `${porcentajeProgreso}%`;
//     const posicionHandle = (porcentajeProgreso / 100) * anchoVideoBar;
//     videoHandle.style.left = `${posicionHandle}px`;
//   }

//   function formatTime(timeInSeconds) {
//     const hours = Math.floor(timeInSeconds / 3600);
//     const minutes = Math.floor((timeInSeconds % 3600) / 60);
//     const seconds = Math.floor(timeInSeconds % 60);

//     const hoursDisplay =
//       hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
//     const minutesDisplay = `${minutes.toString().padStart(2, "0")}:`;
//     const secondsDisplay = `${seconds.toString().padStart(2, "0")}`;

//     return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`;
//   }
// }

// function unir_videos() {
//   let array_url_videos = [];
//   videos.forEach((video) => {
//     if (video.src) {
//       array_url_videos.push(video.src.split("/uploads/videos/")[1]);
//     }
//   });

//   if (array_url_videos.length < 2) {
//     return Swal.fire({
//       html: `<h5>Debes de tener al menos 2 archivos para unir</h5>`,
//     });
//   }
//   let params = new Proxy(new URLSearchParams(window.location.search), {
//     get: (searchParams, prop) => searchParams.get(prop),
//   });
//   let proyecto_id = params.proyecto;
//   let previsualizacion = document.getElementById("video_visualizaciones");
//   previsualizacion.src = "./assets/videos/cargando_1.mp4";
//   previsualizacion.play();
//   previsualizacion.loop = true;

//   let info = new FormData();
//   info.append("action", "unir_videos");
//   info.append("array_videos", array_url_videos);
//   info.append("proyecto_id", proyecto_id);

//   jQuery.ajax({
//     url: "convertir.php",
//     data: info,
//     cache: false,
//     contentType: false,
//     processData: false,
//     type: "POST",
//     success: function (data) {
//       console.log(data);
//       let obj = JSON.parse(data);
//       if (obj.status == "success") {
//         console.log("resultado", obj);
//         let src_video_concatenado = obj.archivo_concat;
//         if (src_video_concatenado != undefined && src_video_concatenado != "") {
//           previsualizacion.pause();
//           previsualizacion.src = "none";
//           previsualizacion.loop = false;
//           let path = "./uploads/convertir/concat/" + src_video_concatenado;
//           console.log("path video concatenado", path);
//           previsualizacion.src = path;
//           let capturas_archivo_concatenado = obj.array_capturas_archivo_concatenado;
//           let duracion_video = previsualizacion.duration;
//           if (capturas_archivo_concatenado.length > 0) {

//           }
//         }
//       } else {
//         console.log("No se ha guardado");
//       }
//     },
//     error: function (XMLHttpRequest, textStatus, errorThrown) {
//       alert("Error: " + errorThrown);
//     },
//   });

// }

// function cortar_video(videos) { }