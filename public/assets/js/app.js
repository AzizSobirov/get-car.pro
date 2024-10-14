// header
const header = document.querySelector(".header");
if (header) {
  const header = document.querySelector(".header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  const menu = header.querySelector(".header__menu");
  const services = header.querySelector(".menu-item-has-children");
  const servicesSubMenu = services.querySelector(".sub-menu");

  const div = document.createElement("div");
  div.classList.add("icon-plus");
  div.innerHTML =
    '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5H9.5" stroke="currentColor" stroke-linecap="round"/><path d="M1 5H9.5" stroke="currentColor" stroke-linecap="round"/><path d="M1 5H9.5" stroke="currentColor" stroke-linecap="round"/><path d="M5.25 0.75L5.25 9.25" stroke="currentColor" stroke-linecap="round"/><path d="M5.25 0.75L5.25 9.25" stroke="currentColor" stroke-linecap="round"/><path d="M5.25 0.75L5.25 9.25" stroke="currentColor" stroke-linecap="round"/></svg>';

  services.appendChild(div);

  services.addEventListener("mouseenter", () => {
    servicesSubMenu.style.display = "flex";
    setTimeout(() => {
      servicesSubMenu.style.opacity = 1;
      servicesSubMenu.style.transform = "translateY(0px)";
    }, 300);
  });
  services.addEventListener("mouseleave", () => {
    servicesSubMenu.style.opacity = 0;
    servicesSubMenu.style.transform = "translateY(10px)";
    setTimeout(() => {
      servicesSubMenu.style.display = "none";
    }, 300);
  });

  const tabs = header.querySelectorAll("#tab");
  const tabLinks = header.querySelectorAll("#tab-link");
  const tabsBody = header.querySelector(".mobile__menu-content");
  const tabsContent = tabsBody.querySelector("#content");
  const tabsContentClose = tabsBody.querySelector("#close");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabsBody.style.display = "flex";

      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");

      if (tab.dataset.toggle == "menu") {
        tabsBody.classList.remove("bg-primary");
        tabsContent.innerHTML = menu.innerHTML;
      } else {
        tabsBody.classList.add("bg-primary");
        tabsContent.innerHTML = servicesSubMenu.outerHTML;
      }
    });
  });

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });

      tabsContent.innerHTML = "";
      tabsBody.style.display = "none";
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
    });
  });

  tabsContentClose.addEventListener("click", () => {
    tabsContent.innerHTML = "";
    tabsBody.style.display = "none";
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
  });
}

// modal
const modal = {
  el: document.querySelector(".modal"),
  blocks: document.querySelectorAll(".modal__content"),
  open: function (name, animation = true) {
    const target = this.el.querySelector(`[data-root=${name}]`);

    this.el.classList.add("active");
    this.el.style.display = "flex";
    target.style.display = "flex";

    if (animation) {
      setTimeout(() => {
        target.style.opacity = 1;
        target.style.transform = "translateX(0)";
      }, 50);
    } else {
      target.style.opacity = 1;
      target.style.transform = "translateX(0)";
    }
  },
  close: function (name, parent = true) {
    if (!name) {
      this.blocks.forEach((block) => {
        block.style.opacity = 0;
        block.style.transform = "translateX(20%)";

        setTimeout(() => {
          block.style.display = "none";
        }, 350);
      });
    } else {
      const target = this.el.querySelector(`[data-root=${name}]`);
      target.style.opacity = 0;
      target.style.transform = "translateX(20%)";

      if (!parent) {
        target.style.display = "none";
      } else {
        setTimeout(() => {
          target.style.display = "none";
        }, 350);
      }
    }

    if (parent) {
      setTimeout(() => {
        this.el.classList.remove("active");
        this.el.style.display = "none";
      }, 350);
    }
  },
};

const modalTriggers = document.querySelectorAll("[data-modal]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const name = trigger.dataset.modal;
    if (name !== "close") {
      modal.open(name);
    } else {
      modal.close(null, true);
    }
  });
});

// form
[].forEach.call(
  document.querySelectorAll("input[name='phone']"),
  function (input) {
    let keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      let pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      let matrix = "+7 (___) ___-__-__",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        newValue = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = newValue.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        newValue = newValue.slice(0, i);
      }
      let reg = matrix
        .substr(0, this.value.length)
        .replace(/_+/g, function (a) {
          return "\\d{1," + a.length + "}";
        })
        .replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (
        !reg.test(this.value) ||
        this.value.length < 5 ||
        (keyCode > 47 && keyCode < 58)
      )
        this.value = newValue;
      if (event.type == "blur" && this.value.length < 5) this.value = "";

      if (this.value.length == 18 || this.value.length == 0) {
        input.dataset.numbervalid = "true";
      } else {
        input.dataset.numbervalid = "false";
      }
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  }
);

function successSend() {
  const modalEl = document.querySelector(".modal");
  if (modalEl.classList.contains("active")) {
    modal.close("form", false);
    modal.open("success", false);
  } else {
    modal.open("success");
  }

  setTimeout(() => {
    modal.close("success");
  }, 3000);
}

const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successSend();
  });
});

//  What we check
const checkEl = document.querySelector(".check");
if (checkEl) {
  const tooltips = document.querySelectorAll(".tooltip");
  tooltips.forEach((tooltip, index) => {
    const trigger = tooltip.querySelector(".tooltip__trigger");
    const content = tooltip.querySelector(".tooltip__content");

    if (window.innerWidth > 769) {
      if (index === 0) {
        content.style.display = "block";
        setTimeout(() => {
          content.style.opacity = 1;
          content.style.transform = "translate(-50%, 0px)";
        }, 20);
      }

      trigger.addEventListener("mouseenter", () => {
        content.style.display = "block";
        setTimeout(() => {
          content.style.opacity = 1;
          content.style.transform = "translate(-50%, 0px)";
        }, 20);
      });
      trigger.addEventListener("mouseleave", () => {
        content.style.opacity = 0;
        content.style.transform = "translate(-50%, 10px)";
        setTimeout(() => {
          content.style.display = "none";
        }, 300);
      });
    }
  });
}

// swiper
var reviewsSwiper = new Swiper(".reviews .swiper", {
  slidesPerView: "auto",
  spaceBetween: 15,
  navigation: {
    nextEl: ".reviews .swiper-button-next",
    prevEl: ".reviews .swiper-button-prev",
  },
  breakpoints: {
    769: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1025: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

var mistakeBeforeSwiper = new Swiper(".mistake .swiper-before", {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".mistake .swiper-before .swiper-button-next",
    prevEl: ".mistake .swiper-before .swiper-button-prev",
  },
});

var mistakeAfterSwiper = new Swiper(".mistake .swiper-after", {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".mistake .swiper-after .swiper-button-next",
    prevEl: ".mistake .swiper-after .swiper-button-prev",
  },
});

var recommendSwiper = new Swiper(".recommend .swiper", {
  slidesPerView: "auto",
  spaceBetween: 15,
  navigation: {
    nextEl: ".recommend .swiper-button-next",
    prevEl: ".recommend .swiper-button-prev",
  },
  breakpoints: {
    1025: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

// fancybox
let dataFancybox = ["gallery", "recommend", "about", "points", "faq", "videos"];
dataFancybox.forEach((name) => {
  Fancybox.bind(`[data-fancybox="${name}"]`, {
    Images: { Panzoom: { maxScale: 3 } },
  });
});
