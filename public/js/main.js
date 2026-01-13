// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe feature cards and other sections
  document.querySelectorAll('.feature-card, .code-block, .endpoint-item').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  logWelcomeMessage();
  loadReadme();
});

/**
 * Fetches README.md from GitHub and renders it as HTML
 */
async function loadReadme() {
  const readmeContainer = document.getElementById('readme-container');
  if (!readmeContainer) return;

  const repoOwner = 'demirtasdurmus';
  const repoName = 'express-starter';
  const branch = 'main';
  const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/README.md`;

  try {
    const response = await fetch(rawUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.status}`);
    }

    const markdown = await response.text();

    // Check if Showdown and DOMPurify are available
    if (typeof showdown === 'undefined' || typeof DOMPurify === 'undefined') {
      throw new Error('Markdown parser libraries not loaded');
    }

    // Convert markdown to HTML
    const converter = new showdown.Converter({
      tables: true,
      tasklists: true,
      strikethrough: true,
      emoji: true,
      openLinksInNewWindow: true,
    });

    const htmlContent = converter.makeHtml(markdown);

    // Sanitize HTML to prevent XSS attacks
    const cleanHtml = DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['details', 'summary'],
      ADD_ATTR: ['target', 'rel'],
    });

    // Update container with rendered content
    readmeContainer.innerHTML = cleanHtml;
    readmeContainer.classList.add('loaded');
  } catch (error) {
    console.error('Error loading README:', error);
    readmeContainer.innerHTML = `
      <div class="readme-error">
        <p>⚠️ Unable to load README from GitHub</p>
        <p class="error-details">${error.message}</p>
        <p>
          <a href="https://github.com/${repoOwner}/${repoName}/blob/${branch}/README.md" 
             target="_blank" 
             rel="noopener noreferrer">
            View README on GitHub →
          </a>
        </p>
      </div>
    `;
  }
}

/**
 * Logs a welcome message to the console
 */
function logWelcomeMessage() {
  console.log(
    '%c🚀 Express TypeScript Starter',
    'font-size: 16px; font-weight: bold; color: #6366f1;',
  );
  console.log('%cUI Loaded successfully!', 'color: #10b981;');
  console.log(
    '%c💡 Diving deep into the code? Consider contributing:',
    'color: #8b5cf6; font-weight: bold;',
  );
  console.log(
    '%chttps://github.com/demirtasdurmus/express-starter/blob/main/DEVELOPMENT_PATH.md',
    'color: #3b82f6; text-decoration: underline;',
  );
}
