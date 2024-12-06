const overlayDesktop = document.getElementById("desktopOverlay");
const overlayTablet = document.getElementById("tabletOverlay");
const overlayMobile = document.getElementById("mobileOverlay");
const body = document.body;
const sunIcon = document.getElementById("sun");
const moonIcon = document.getElementById("moon");
const movableCirc = document.querySelector(".movable");
const toggleBtn = document.querySelector(".toggler");

export default function themeSwitcher() {
  document.querySelector(".toggler").addEventListener("click", () => {
    movableCirc.classList.toggle("toggle");
    body.classList.toggle("main-light");
    if (body.classList.contains("main-light")) {
      overlayDesktop.src =
        "/frontend/assets/images/pattern-background-desktop-light.svg";
      overlayTablet.src =
        "/frontend/assets/images/pattern-background-tablet-light.svg";
      overlayMobile.src =
        "/frontend/assets/images/pattern-background-mobile-light.svg";
      sunIcon.src = "/frontend/assets/images/icon-sun-dark.svg";
      moonIcon.src = "/frontend/assets/images/icon-moon-dark.svg";
    } else {
      overlayDesktop.src =
        "/frontend/assets/images/pattern-background-desktop-dark.svg";
      overlayTablet.src =
        "/frontend/assets/images/pattern-background-tablet-dark.svg";
      overlayMobile.src =
        "/frontend/assets/images/pattern-background-mobile-dark.svg";
      sunIcon.src = "/frontend/assets/images/icon-sun-light.svg";
      moonIcon.src = "/frontend/assets/images/icon-moon-light.svg";
    }
  });
}
