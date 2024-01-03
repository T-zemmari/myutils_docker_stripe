const body = document.querySelector("body");
/*const darkLight = document.querySelector("#darkLight");*/
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const open_side_bar = document.querySelector("#open_side_bar");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");
open_side_bar.addEventListener("click", () => sidebar.classList.toggle("close"));

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("close", "hoverable");
});
sidebarExpand.addEventListener("click", () => {
  sidebar.classList.remove("close", "hoverable");
});

// sidebar.addEventListener("mouseenter", () => {
//   if (sidebar.classList.contains("hoverable")) {
//     sidebar.classList.remove("close");
//   }
// });
// sidebar.addEventListener("mouseleave", () => {
//   if (sidebar.classList.contains("hoverable")) {
//     sidebar.classList.add("close");
//   }
// });

/*darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI;
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});*/

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
  });
});


if (window.innerWidth < 768) {
  sidebar.classList.add("close");
} else {
  sidebar.classList.remove("close");
}

