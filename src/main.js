import "./styles/main.css";
console.log("Hello Vite + Tailwind");
import Swiper from "swiper/bundle";

// import styles bundle
import "swiper/css/bundle";

const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,
  slidesPerView: 2.2,
  centeredSlides: true,
  spaceBetween: 48,
  watchSlidesProgress: true,
  effect: "coverflow",
  coverflowEffect: {
    rotate: 0,
    slideShadows: false,
    depth: 0,
  },

  speed: 800,
  grabCursor: true,
  // slideToClickedSlide: true,
  // loopedSlides: 3,
  // breakpoints: {
  //   320: {
  //     slidesPerView: 1.2,
  //     spaceBetween: 16,
  //   },
  //   768: {
  //     slidesPerView: 3,
  //     spaceBetween: 24,
  //   },
  // },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});

import Lenis from "lenis";

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Плавный переход по ссылкам в навбаре
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      lenis.scrollTo(target, {
        offset: -90,
        duration: 1.5,
      });
    }
  });
});

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
