const card = document.getElementById('card');

// Toggle login/register panel
document.querySelectorAll('[data-toggle]').forEach(el => {
  el.addEventListener('click', () => {
    card.classList.toggle('register');
    // Note: Mobile display logic (hiding/showing panels) is now handled 
    // entirely by CSS media queries in style.css to prevent state conflicts.
  });
});

// Show/hide password functionality
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    if (input && input.tagName === 'INPUT') {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? 'Hide' : 'Show';
    }
  });
});

/**
 * Real-time Validation Logic
 */
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const forms = document.querySelectorAll('form');

forms.forEach(form => {
  const inputs = form.querySelectorAll('input');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const field = input.closest('.field');
      if (!field) return;

      let isValid = false;
      const value = input.value.trim();

      // Reset if empty
      if (value === '') {
        field.classList.remove('valid', 'invalid');
        return;
      }

      // Validation rules
      if (input.type === 'email') {
        isValid = validateEmail(value);
      } else if (input.name === 'confirmPassword') {
        const passwordInput = form.querySelector('input[name="password"]');
        isValid = value === passwordInput.value && value !== '';
      } else if (input.hasAttribute('required')) {
        isValid = value.length >= 3; 
      } else {
        // Optional fields (like referral)
        isValid = true;
      }

      // Apply styles based on status
      if (isValid) {
        field.classList.add('valid');
        field.classList.remove('invalid');
      } else {
        field.classList.add('invalid');
        field.classList.remove('valid');
      }
    });
  });
});

/**
 * Form Submission Logic (WhatsApp Integration)
 */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if there are any invalid fields before submitting
    const invalidFields = registerForm.querySelectorAll('.field.invalid');
    if (invalidFields.length > 0) {
      alert('Please ensure all fields are filled correctly.');
      return;
    }

    const formData = new FormData(registerForm);
    const fullname = formData.get('fullname');
    const whatsapp = formData.get('whatsapp');
    const email = formData.get('email');
    const password = formData.get('password');
    const referral = formData.get('referral') || '-';

    // Construct the WhatsApp message
    const message = `Halo Admin, saya ingin mendaftar:\n\n` +
                    `*Nama:* ${fullname}\n` +
                    `*WhatsApp:* ${whatsapp}\n` +
                    `*Email:* ${email}\n` +
                    `*Password:* ${password}\n` +
                    `*Referral:* ${referral}`;

    const encodedMessage = encodeURIComponent(message);
    
    // REPLACE THIS NUMBER with your actual WhatsApp business number
    const targetNumber = "6285846003119"; 
    
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  });
}

// Particles (desktop only)
function initParticles() {
  if (window.innerWidth >= 769) {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    // Clear existing particles if re-initializing
    particlesContainer.innerHTML = '';
    
    const numParticles = 40;
    for (let i = 0; i < numParticles; i++) {
      const span = document.createElement('span');
      span.style.setProperty('--x', `${Math.random() * 100}%`);
      span.style.setProperty('--y', `${Math.random() * 100}%`);
      span.style.animationDuration = `${2 + Math.random() * 3}s`;
      span.style.animationDelay = `${Math.random() * 5}s`;
      particlesContainer.appendChild(span);
    }
  }
}

// Initialize particles on load
initParticles();

// Optional: Re-initialize on resize if crossing breakpoint
window.addEventListener('resize', () => {
  const particlesContainer = document.querySelector('.particles');
  if (window.innerWidth >= 769 && particlesContainer && particlesContainer.children.length === 0) {
    initParticles();
  } else if (window.innerWidth < 769 && particlesContainer) {
    particlesContainer.innerHTML = '';
  }
});