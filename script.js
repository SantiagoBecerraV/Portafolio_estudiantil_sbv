/* =========================================================
   SANTIAGO BECERRA — PORTAFOLIO
   script.js — interactividad, animaciones y envío a n8n
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. AÑO ACTUAL EN EL FOOTER
  ------------------------------------------------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------
     2. MENÚ MÓVIL (TOGGLE)
  ------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------
     3. HEADER: SOMBRA/FONDO AL HACER SCROLL
  ------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const updateHeaderState = () => {
      if (window.scrollY > 12) {
        siteHeader.style.background = 'rgba(7, 9, 14, 0.82)';
        siteHeader.style.borderBottomColor = 'rgba(56, 189, 248, 0.18)';
      } else {
        siteHeader.style.background = 'rgba(7, 9, 14, 0.55)';
        siteHeader.style.borderBottomColor = 'rgba(148, 163, 184, 0.1)';
      }
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  /* -------------------------------------------------------
     4. EFECTO TYPING EN EL HERO
  ------------------------------------------------------- */
  const typingRoleEl = document.getElementById('typingRole');
  const roles = [
    'Desarrollador Backend',
    'Especialista en Automatización',
    'BPO Specialist'
  ];

  if (typingRoleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = false;

    const TYPING_SPEED = 65;
    const DELETING_SPEED = 35;
    const PAUSE_AFTER_TYPE = 1800;
    const PAUSE_AFTER_DELETE = 400;

    const typeLoop = () => {
      const currentRole = roles[roleIndex];
      let delay;

      if (!isDeleting) {
        charIndex++;
        typingRoleEl.textContent = currentRole.slice(0, charIndex);

        if (charIndex >= currentRole.length) {
          isDeleting = true;
          delay = PAUSE_AFTER_TYPE;
        } else {
          delay = TYPING_SPEED;
        }
      } else {
        charIndex--;
        typingRoleEl.textContent = currentRole.slice(0, charIndex);

        if (charIndex <= 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = PAUSE_AFTER_DELETE;
        } else {
          delay = DELETING_SPEED;
        }
      }

      window.setTimeout(typeLoop, delay);
    };

    window.setTimeout(typeLoop, PAUSE_AFTER_TYPE);
  } else if (typingRoleEl) {
    typingRoleEl.textContent = roles[0];
  }

  /* -------------------------------------------------------
     5. SCROLL REVEAL CON INTERSECTIONOBSERVER
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------------
     6. FORMULARIO DE CONTACTO — VALIDACIÓN Y ENVÍO A N8N
  ------------------------------------------------------- */

  const N8N_WEBHOOK_URL = "https://shining-marathon-pessimism.ngrok-free.dev/webhook-test/portafolio-contacto";

  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      row: document.getElementById('fullName')?.closest('.form-row'),
      error: document.getElementById('fullNameError'),
      validate: (value) => value.trim().length >= 3,
      message: 'Ingresa tu nombre completo (mínimo 3 caracteres).'
    },
    phone: {
      input: document.getElementById('phone'),
      row: document.getElementById('phone')?.closest('.form-row'),
      error: document.getElementById('phoneError'),
      validate: (value) => /^[0-9+()\s-]{7,20}$/.test(value.trim()),
      message: 'Ingresa un número de contacto válido.'
    },
    email: {
      input: document.getElementById('email'),
      row: document.getElementById('email')?.closest('.form-row'),
      error: document.getElementById('emailError'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: 'Ingresa un correo electrónico válido.'
    },
    message: {
      input: document.getElementById('message'),
      row: document.getElementById('message')?.closest('.form-row'),
      error: document.getElementById('messageError'),
      validate: (value) => value.trim().length >= 10,
      message: 'Cuéntame un poco más (mínimo 10 caracteres).'
    }
  };

  const setFieldError = (field, message) => {
    if (!field.row || !field.error) return;
    if (message) {
      field.row.classList.add('has-error');
      field.error.textContent = message;
    } else {
      field.row.classList.remove('has-error');
      field.error.textContent = '';
    }
  };

  const validateField = (key) => {
    const field = fields[key];
    if (!field.input) return true;
    const isValid = field.validate(field.input.value);
    setFieldError(field, isValid ? '' : field.message);
    return isValid;
  };

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (field.input) {
      field.input.addEventListener('blur', () => validateField(key));
      field.input.addEventListener('input', () => {
        if (field.row?.classList.contains('has-error')) {
          validateField(key);
        }
      });
    }
  });

  const setFormFeedback = (message, type) => {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.classList.remove('success', 'error');
    if (type) formFeedback.classList.add(type);
  };

  const setLoadingState = (isLoading) => {
    if (!submitBtn) return;
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.disabled = isLoading;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setFormFeedback('', null);

      const allValid = Object.keys(fields).every((key) => validateField(key));
      if (!allValid) {
        setFormFeedback('Por favor corrige los campos marcados en rojo.', 'error');
        return;
      }

      const payload = {
        fullName: fields.fullName.input.value.trim(),
        phone: fields.phone.input.value.trim(),
        email: fields.email.input.value.trim(),
        message: fields.message.input.value.trim(),
        source: 'portafolio-web',
        sentAt: new Date().toISOString()
      };

      setLoadingState(true);

      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Respuesta del servidor: ${response.status}`);
        }

        setFormFeedback('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
        contactForm.reset();
      } catch (error) {
        console.error('Error al enviar el formulario a n8n:', error);
        setFormFeedback('No se pudo enviar el mensaje. Intenta de nuevo o escríbeme directamente.', 'error');
      } finally {
        setLoadingState(false);
      }
    });
  }

});