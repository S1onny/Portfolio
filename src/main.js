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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ====================== LENIS ======================
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ====================== ТОЧНЫЙ SNAP НА 100DVH ======================
const sections = gsap.utils.toArray("section");
let currentIndex = 0;
let isAnimating = false;

function goToSection(index) {
  if (
    index < 0 ||
    index >= sections.length ||
    isAnimating ||
    index === currentIndex
  )
    return;

  isAnimating = true;
  currentIndex = index;

  // Прокрутка ровно на 100dvh * индекс
  const targetPosition = index * window.innerHeight;

  lenis.scrollTo(targetPosition, {
    duration: 1.65,
    lock: true,
    onComplete: () => (isAnimating = false),
  });
}

// Directional snapping
lenis.on("scroll", ({ velocity }) => {
  if (isAnimating || Math.abs(velocity) < 0.85) return;

  const direction = velocity > 0 ? 1 : -1;
  goToSection(currentIndex + direction);
});

// Автокорректировка при остановке скролла
let timeout;
lenis.on("scroll", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (isAnimating) return;

    // Самый точный расчёт текущей секции
    const exactIndex = Math.round(lenis.scroll / window.innerHeight);
    if (exactIndex !== currentIndex) {
      goToSection(exactIndex);
    }
  }, 80);
});

// ====================== АНИМАЦИЯ ВЫЕЗЖАНИЯ ======================
function initSectionAnimations() {
  sections.forEach((section) => {
    if (section.id === "hero") return;

    gsap.fromTo(
      section,
      { y: 80 },
      {
        y: 0,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

// ====================== НАВИГАЦИЯ ИЗ ХЕДЕРА ======================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.getAttribute("href").slice(1);
    const targetSection = document.getElementById(id);
    if (!targetSection) return;

    const index = sections.findIndex((s) => s.id === id);
    if (index !== -1) goToSection(index);
  });
});

function animateSkills() {
  const cards = gsap.utils.toArray(".skill-card");

  gsap.fromTo(
    cards,
    { opacity: 0, y: 70, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: "power3.out",
      stagger: {
        amount: 0.75, // общая продолжительность разброса
        from: "random", // случайный порядок
      },
      scrollTrigger: {
        trigger: "#skills",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    },
  );
}

// Запуск (в window.addEventListener('load', ...))
animateSkills();

// Запуск всего
window.addEventListener("load", () => {
  initSectionAnimations();
  ScrollTrigger.refresh();
});

const cursor = document.getElementById("custom-cursor");
const cursorMain = document.getElementById("cursor-main");
const trailContainer = document.getElementById("cursor-trail");

let trailDots = [];
const maxTrail = 12; // количество точек в следе

document.addEventListener("mousemove", (e) => {
  // Двигаем основной курсор
  cursor.style.left = `${e.clientX - 16}px`;
  cursor.style.top = `${e.clientY - 16}px`;
  cursor.classList.remove("hidden");

  // Создаём точку следа
  const dot = document.createElement("div");
  dot.className = "trail-dot";
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
  trailContainer.appendChild(dot);
  trailDots.push(dot);

  // Удаляем старые точки
  if (trailDots.length > maxTrail) {
    const oldDot = trailDots.shift();
    oldDot.style.opacity = "0";
    setTimeout(() => oldDot.remove(), 600);
  }

  // Плавно уменьшаем и убираем след
  setTimeout(() => {
    if (dot.parentNode) {
      dot.style.opacity = "0";
      dot.style.transform = "scale(0.3)";
    }
  }, 50);
});

// Плавное увеличение при наведении
const interactive = document.querySelectorAll(
  'a, button, .hoverable, [role="button"], input, textarea',
);

interactive.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorMain.style.transform = "scale(1.85)";
  });

  el.addEventListener("mouseleave", () => {
    cursorMain.style.transform = "scale(1)";
  });
});

// партиклы

import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

async function initParticles() {
  await loadSlim(tsParticles);

  await tsParticles.load({
    id: "tsparticles",
    options: {
      background: {
        color: "transparent",
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 200,
          density: {
            enable: true,
            area: 900,
          },
        },
        color: {
          value: ["#a855f7", "#c026d3", "#7e22ce", "#e0bbff"],
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.35,
          random: true,
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
          },
        },
        size: {
          value: { min: 1, max: 2.5 },
          random: true,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
      detectRetina: true,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse", // частицы слегка отталкиваются от курсора
          },
        },
        modes: {
          repulse: {
            distance: 80,
            duration: 0.8,
          },
        },
      },
    },
  });
}

// Запускаем
initParticles();
