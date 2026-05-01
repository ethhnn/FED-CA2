// ====================================================================
// ECOFUTURE CLIMATE ACTION WEBSITE - MAIN JAVASCRIPT FILE
// ====================================================================
// This file contains all interactive functionality for the website
// including popups, animations, form handling, and navigation features
// ====================================================================

// ====================================================================
// 1. POPUP ADVERTISEMENT LOGIC
// ====================================================================
// Shows a popup advertisement after 5 seconds of page load
window.onload = function () {
  setTimeout(function () {
    const popup = document.getElementById('popup-ad');
    if (popup) {
      popup.style.display = 'flex';
    }
  }, 5000);
};

// Closes the popup when called
function closePopup() {
  const popup = document.getElementById('popup-ad');
  if (popup) {
    popup.style.display = 'none';
  }
}

// ====================================================================
// 2. COUNT-UP ANIMATION LOGIC
// ====================================================================
// Animates numbers counting up from 0 to their target value
// Used for statistics display on the informational page

/**
 * Animates a number counting up to a target value
 * @param {Element} el - The DOM element to animate
 * @param {number} end - The target number to count up to
 */
function countUp(el, end) {
  let current = 0;
  const duration = 1500; // Animation duration in milliseconds
  const stepTime = Math.max(Math.floor(duration / (end * 10)), 10);
  const increment = end / (duration / stepTime);

  const counter = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(counter);
    }
    // Display whole numbers or decimals based on the target value
    el.innerText = (end % 1 === 0) ? Math.floor(current) : current.toFixed(1);
  }, stepTime);
}

// Intersection Observer to trigger count-up animation when stats section is visible
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll(".count");
      numbers.forEach(el => {
        const endValue = parseFloat(el.innerText);
        countUp(el, endValue);
      });
      observer.unobserve(entry.target); // Stop observing after animation
    }
  });
}, { threshold: 0.5 }); // Trigger when 50% of element is visible

// Initialize the observer for stats section
const statsSection = document.querySelector(".statstwo");
if (statsSection) {
  observer.observe(statsSection);
}

// ====================================================================
// 3. DYNAMIC COUNTRY DATA AND SUCCESS STORIES
// ====================================================================
// Country success stories data array for dynamic DOM rendering
const countryData = {
  'costa-rica': {
    title: 'Costa Rica',
    achievements: [
      '<strong>99% Renewable Electricity:</strong> Powered by hydro, wind, and solar for over 300 days in 2023.',
      'Forest cover increased from 24% to 54% since 1985.',
      'Ranked as one of the happiest and greenest countries globally due to its environmental policies.',
      'Heavy focus on eco-tourism, boosting both economy and conservation efforts.',
      'Uses advanced technologies to monitor and protect biodiversity.'
    ]
  },
  'denmark': {
    title: 'Denmark',
    achievements: [
      '<strong>Wind Power Leader:</strong> Generates 80% of electricity from wind.',
      'Plans to be carbon neutral by 2030 and has reduced emissions by 38% since 1990.',
      'Leads in electric vehicle adoption with widespread charging infrastructure.',
      'Committed to phasing out coal by 2030 and expanding solar capacity.',
      'Strong policies on circular economy and waste reduction.'
    ]
  },
  'copenhagen': {
    title: 'Copenhagen, Denmark',
    achievements: [
      'First carbon-neutral capital by 2025.',
      '62% of residents bike to work daily.',
      'Invested $2 billion in green infrastructure.',
      'Extensive network of bike lanes making cycling safe and popular.',
      'Pioneering "Climate Resilient Neighborhoods" to adapt to future climate risks.',
      'Invests in green spaces and urban biodiversity to improve air quality.'
    ]
  },
  'ethiopia': {
    title: 'Ethiopia',
    achievements: [
      '<strong>Green Legacy:</strong> Planted over 25 billion trees since 2019.',
      'The country aims to plant 50 billion trees to combat deforestation and climate change.',
      'One of Africa\'s largest producers of renewable energy, mainly hydroelectric.',
      'National policies focused on climate-smart agriculture and forest conservation.',
      'Large-scale community involvement in reforestation programs.'
    ]
  },
  'morocco': {
    title: 'Morocco',
    achievements: [
      'Ouarzazate Solar Complex is world\'s largest concentrated solar power plant.',
      'Provides clean energy to 1.3 million people.',
      'Developing innovative water desalination plants powered by solar energy.',
      'Encourages sustainable tourism with eco-friendly resorts and initiatives.',
      'Active in regional partnerships to promote renewable energy across North Africa.'
    ]
  }
};

/**
 * Dynamically renders country information content
 * @param {string} countryKey - The key for the country data
 * @returns {string} HTML string for the country information
 */
function renderCountryInfo(countryKey) {
  const country = countryData[countryKey];
  if (!country) {
    return '<h4>Information not available</h4><p>Sorry, no information is available for this location.</p>';
  }

  const achievementsList = country.achievements
    .map(achievement => `<li>${achievement}</li>`)
    .join('');

  return `
    <h4>${country.title}</h4>
    <ul>
      ${achievementsList}
    </ul>
  `;
}

/**
 * Updates the details panel with country-specific information
 * @param {string} countryKey - The country identifier
 */
function updateCountryDetails(countryKey) {
  const detailsElement = document.getElementById('details');
  if (detailsElement) {
    detailsElement.innerHTML = renderCountryInfo(countryKey);
    detailsElement.focus(); // Focus for accessibility
  }
}

// ====================================================================
// 4. COUNTRY SUCCESS STORIES HOTSPOT LOGIC
// ====================================================================
// Interactive map functionality for displaying climate success stories
// Users can click hotspots on a world map to see country-specific information

// Add click event listeners to all hotspot buttons
document.querySelectorAll('.hotspot').forEach(button => {
  button.addEventListener('click', () => {
    const country = button.getAttribute('data-country');
    updateCountryDetails(country);
  });
});

// ====================================================================
// 5. BACK TO TOP BUTTON FUNCTIONALITY
// ====================================================================
// Smooth scroll to top button with dynamic opacity and hover effects

const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ====================================================================
// 6. BOOTSTRAP FORM VALIDATION
// ====================================================================
// Simple Bootstrap 5 form validation using built-in classes

const form = document.getElementById("climateForm");
const offcanvasEl = document.getElementById("confirmationOffcanvas");

if (form && offcanvasEl) {
  let isFormDirty = false;     // Track if form has been modified
  let formSubmitted = false;   // Track if form has been submitted
  let pendingLeaveUrl = null;  // Store URL user is trying to navigate to

  // Mark form as dirty when user starts typing/selecting
  form.addEventListener("input", () => {
    isFormDirty = true;
  });

  // Handle form submission with Bootstrap validation
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Check if form is valid using Bootstrap's validation
    if (form.checkValidity()) {
      // Form is valid - show success message
      formSubmitted = true;
      
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.show();
      
      // Reset form
      form.reset();
      form.classList.remove('was-validated');
      isFormDirty = false;
      
    } else {
      // Form is invalid - show validation feedback
      form.classList.add('was-validated');
      
      // Scroll to first invalid field
      const firstInvalidField = form.querySelector(':invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        firstInvalidField.focus();
      }
    }
  });

  // ====================================================================
  // 7. FORM LEAVE WARNING SYSTEM
  // ====================================================================
  // Prevents users from accidentally leaving the form page with unsaved changes

  // Show browser warning for tab close, reload, or external navigation
  window.addEventListener("beforeunload", function (e) {
    if (isFormDirty && !formSubmitted) {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome compatibility
    }
  });

  // Intercept internal link clicks to show custom warning modal
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
      const targetHref = this.getAttribute("href");
      const isInternal = targetHref === "#" || targetHref.startsWith("#");

      // Show warning for external links when form has unsaved changes
      if (isFormDirty && !formSubmitted && !isInternal) {
        e.preventDefault();
        pendingLeaveUrl = targetHref;

        // Show custom Bootstrap modal
        const modal = new bootstrap.Modal(document.getElementById("leaveWarningModal"));
        modal.show();
      }
    });
  });

  // Handle "Leave Anyway" button in warning modal
  const confirmLeaveBtn = document.getElementById("confirmLeaveBtn");
  if (confirmLeaveBtn) {
    confirmLeaveBtn.addEventListener("click", function (e) {
      if (pendingLeaveUrl) {
        window.location.href = pendingLeaveUrl;
      }
    });
  }
}