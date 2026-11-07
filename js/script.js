// ===== HEADER SCROLL =====
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("header--scrolled", window.scrollY > 20);
});

// ===== MOBILE MENU =====
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  burger.classList.toggle("burger--open");
  nav.classList.toggle("nav--open");
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    burger.classList.remove("burger--open");
    nav.classList.remove("nav--open");
  }),
);

// ===== SMOOTH SCROLL BUTTONS =====
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== TO TOP =====
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("to-top--visible", window.scrollY > 600);
});
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ===== ANIMATED COUNTERS =====
const animateCounter = (el) => {
  const target = +el.dataset.count;
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("ru-RU");
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll("[data-count]")
  .forEach((el) => counterObserver.observe(el));

// ===== CALCULATOR =====
const rates = { ltl: 3.5, ftl: 18, fridge: 25 }; // ₽ за км за кг / за км
const distances = {
  "москва-санкт-петербург": 710,
  "москва-екатеринбург": 1800,
  "москва-новосибирск": 3300,
  "москва-казань": 820,
  "москва-нижний-новгород": 420,
  "москва-владивосток": 9200,
  "москва-ростов-на-дону": 1070,
  "москва-краснодар": 1350,
  "москва-сочи": 1600,
  "москва-самара": 1060,
  "москва-минск": 700,
  "москва-алматы": 4000,
};

const calcForm = document.getElementById("calcForm");
const calcResult = document.getElementById("calcResult");
const calcPrice = document.getElementById("calcPrice");
const calcText = document.getElementById("calcText");

calcForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const from = document.getElementById("calcFrom").value.trim().toLowerCase();
  const to = document.getElementById("calcTo").value.trim().toLowerCase();
  const weight = Math.max(1, +document.getElementById("calcWeight").value || 1);
  const type = document.getElementById("calcType").value;

  // ищем известный маршрут в обе стороны, иначе приблизительно 1200 км
  let distance = distances[`${from}-${to}`] || distances[`${to}-${from}`];
  let exact = true;
  if (!distance) {
    distance = 1200;
    exact = false;
  }

  let price;
  if (type === "ltl") {
    // сборный: базовый тариф + вес
    price = Math.max(500, distance * 0.9 + weight * rates.ltl);
  } else {
    // машина целиком
    price = distance * rates[type];
  }

  calcPrice.textContent = price.toLocaleString("ru-RU") + " ₽";
  calcText.textContent =
    `${from.charAt(0).toUpperCase() + from.slice(1)} → ${to.charAt(0).toUpperCase() + to.slice(1)}, ~${distance.toLocaleString("ru-RU")} км` +
    (exact ? "" : " (оценка по среднему маршруту — уточнит менеджер)");

  calcForm.hidden = true;
  calcResult.hidden = false;
});

document.getElementById("calcReset").addEventListener("click", () => {
  calcForm.reset();
  calcForm.hidden = false;
  calcResult.hidden = true;
});

// ===== REVIEWS SLIDER =====
const track = document.getElementById("reviewsTrack");
const reviews = track.children.length;
const dotsWrap = document.getElementById("reviewsDots");
let current = 0;

for (let i = 0; i < reviews; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Отзыв ${i + 1}`);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
}

function goTo(index) {
  current = (index + reviews) % reviews;
  const isMobile = window.innerWidth <= 1024;
  const perView = isMobile ? 1 : 2;
  // на десктопе сдвигаем по 2 карточки (100%), на мобиле по 1 (100%) — страница = ширина вьюпорта
  const page = Math.min(
    Math.floor(current / perView),
    Math.ceil(reviews / perView) - 1,
  );
  track.style.transform = `translateX(-${page * 100}%)`;
  [...dotsWrap.children].forEach((d, i) =>
    d.classList.toggle("active", i === current),
  );
}

document
  .getElementById("prevReview")
  .addEventListener("click", () => goTo(current - 1));
document
  .getElementById("nextReview")
  .addEventListener("click", () => goTo(current + 1));
window.addEventListener("resize", () => goTo(current));
// автопрокрутка
setInterval(() => goTo(current + 1), 6000);

// ===== PHONE MASK =====
document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener("input", () => {
    let digits = input.value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7")) digits = "7" + digits;
    digits = digits.slice(0, 11);
    let res = "+7";
    if (digits.length > 1) res += " (" + digits.slice(1, 4);
    if (digits.length >= 5) res += ") " + digits.slice(4, 7);
    if (digits.length >= 8) res += "-" + digits.slice(7, 9);
    if (digits.length >= 10) res += "-" + digits.slice(9, 11);
    input.value = res;
  });
});

// ===== ORDER FORM =====
const orderForm = document.getElementById("orderForm");
const formSuccess = document.getElementById("formSuccess");
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = orderForm.name.value.trim();
  const phone = orderForm.phone.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 11) {
    alert("Пожалуйста, укажите имя и корректный номер телефона.");
    return;
  }
  orderForm.reset();
  formSuccess.hidden = false;
  setTimeout(() => {
    formSuccess.hidden = true;
  }, 6000);
});
