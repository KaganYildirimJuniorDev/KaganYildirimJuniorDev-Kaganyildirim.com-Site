let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

const btn = document.getElementById("showMoreBtn");
const hiddenBoxes = document.querySelectorAll(".box.hidden");
let isShown = false;

function moveButton() {
  const visibleBoxes = document.querySelectorAll(".box:not(.hidden)");
  const lastVisibleBox = visibleBoxes[visibleBoxes.length - 1];
  lastVisibleBox.after(btn);
}

btn.addEventListener("click", () => {
  hiddenBoxes.forEach(box => {
    box.classList.toggle("hidden");
  });

  isShown = !isShown;
  btn.textContent = isShown ? "Daha Az Göster" : "Daha Fazlasını Gör";

  moveButton();
});

// Sayfa ilk açıldığında da butonu doğru konuma taşı
document.addEventListener("DOMContentLoaded", moveButton);
