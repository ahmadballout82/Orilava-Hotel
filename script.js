
/* ========================================
   ORILAVA HOTEL
   JavaScript - script.js
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================
     CURRENT YEAR
  ===================================== */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* =====================================
     MOBILE MENU
  ===================================== */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.remove("active");
    mainNav.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        mainNav.classList.add("open");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "إغلاق القائمة");

        document.body.classList.add("menu-open");
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 950) {
        closeMenu();
      }
    });
  }

  /* =====================================
     STICKY HEADER & BACK TO TOP
  ===================================== */

  const header = document.getElementById("header");
  const backToTop = document.getElementById("backToTop");

  function updateScrollUI() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle("is-sticky", scrollY > 60);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollY > 350);
    }
  }

  window.addEventListener("scroll", updateScrollUI, {
    passive: true
  });

  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* =====================================
     ACTIVE NAVIGATION LINK
  ===================================== */

  const sections = document.querySelectorAll("main section[id]");

  function updateActiveNavigation() {
    let activeId = "home";
    const position = window.scrollY + 160;

    sections.forEach((section) => {
      if (section.offsetTop <= position) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === "#" + activeId
      );
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
  });

  updateActiveNavigation();

  /* =====================================
     BOOKING FORM - DEMO ONLY
  ===================================== */

  const bookingForm = document.getElementById("bookingForm");
  const checkIn = document.getElementById("checkIn");
  const checkOut = document.getElementById("checkOut");
  const guests = document.getElementById("guests");

  function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function addDays(dateString, days) {
    const parts = dateString.split("-").map(Number);

    const date = new Date(
      parts[0],
      parts[1] - 1,
      parts[2]
    );

    date.setDate(date.getDate() + days);

    return formatLocalDate(date);
  }

  function setBookingDateLimits() {
    if (!checkIn || !checkOut) return;

    const today = formatLocalDate(new Date());

    checkIn.min = today;

    if (checkIn.value && checkIn.value < today) {
      checkIn.value = "";
    }

    const earliestCheckout = checkIn.value
      ? addDays(checkIn.value, 1)
      : addDays(today, 1);

    checkOut.min = earliestCheckout;

    if (
      checkOut.value &&
      checkOut.value < earliestCheckout
    ) {
      checkOut.value = "";
    }
  }

  if (checkIn && checkOut) {
    setBookingDateLimits();

    checkIn.addEventListener("change", () => {
      setBookingDateLimits();
    });

    checkOut.addEventListener("focus", () => {
      setBookingDateLimits();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      setBookingDateLimits();

      if (!bookingForm.reportValidity()) {
        return;
      }

      const arrival = checkIn.value;
      const departure = checkOut.value;
      const guestCount = Number(guests.value);

      if (!arrival || !departure) {
        alert("يرجى اختيار تاريخ الوصول والمغادرة");
        return;
      }

      if (departure <= arrival) {
        alert("يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول");
        return;
      }

      const arrivalDate = new Date(arrival + "T12:00:00");
      const departureDate = new Date(departure + "T12:00:00");

      const nights = Math.round(
        (departureDate - arrivalDate) / 86400000
      );

      const guestLabel =
        guestCount === 1 ? "ضيف واحد" :
        guestCount === 2 ? "ضيفان" :
        `${guestCount} ضيوف`;

      alert(
        "أوريلافا | تجربة نموذج الحجز\n\n" +
        `تاريخ الوصول: ${arrival}\n` +
        `تاريخ المغادرة: ${departure}\n` +
        `عدد الليالي: ${nights}\n` +
        `عدد الضيوف: ${guestLabel}\n\n` +
        "هذا نموذج تجريبي فقط، " +
        "ولم يتم تنفيذ أي حجز فعلي"
      );
    });
  }

  /* =====================================
     CONTACT FORM - DEMO ONLY
  ===================================== */

  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      contactFeedback.textContent = "";
      contactFeedback.className = "form-feedback";

      if (!contactForm.reportValidity()) {
        return;
      }

      const fullName = document
        .getElementById("fullName")
        .value.trim();

      const email = document
        .getElementById("email")
        .value.trim();

      const subject = document
        .getElementById("subject")
        .value.trim();

      const message = document
        .getElementById("message")
        .value.trim();

      if (
        !fullName ||
        !email ||
        !subject ||
        !message
      ) {
        contactFeedback.textContent =
          "يرجى تعبئة جميع الحقول";

        contactFeedback.classList.add("error");
        return;
      }

      contactFeedback.textContent =
        "تم التحقق من البيانات بنجاح، " +
        "هذا نموذج تجريبي ولم يتم إرسال الرسالة فعليًا";

      contactFeedback.classList.add("success");

      contactForm.reset();
    });
  }

  /* =====================================
     GALLERY LIGHTBOX
  ===================================== */

  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  let previousFocus = null;

  function openLightbox(image) {
    if (!lightbox || !lightboxImage || !image) return;

    previousFocus = document.activeElement;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "صورة من معرض أوريلافا";

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    lightboxImage.removeAttribute("src");

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");

      if (image) {
        openLightbox(image);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  /* =====================================
     ESC KEY
  ===================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (lightbox && lightbox.classList.contains("active")) {
      closeLightbox();
    }

    if (mainNav && mainNav.classList.contains("open")) {
      closeMenu();
    }
  });

  /* =====================================
     INTERNAL LINKS
  ===================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      closeMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", targetId);
      }
    });
  });

  /* =====================================
     IMAGE FALLBACK
  ===================================== */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";

      image.style.backgroundColor = "#292622";
      image.alt = image.alt || "صورة غير متاحة";
    });
  });

});
