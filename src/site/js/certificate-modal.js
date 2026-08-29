/**
 * Certificate Modal Component
 * Displays award certificates in a lightbox/modal view
 * Features: keyboard accessibility, smooth animations, touch support
 */

class CertificateModal {
  constructor() {
    this.modal = null;
    this.certificateImage = null;
    this.closeBtn = null;
    this.isOpen = false;
    this.lastFocusedElement = null;
    
    this.init();
  }
  
  init() {
    // Create modal if it doesn't exist
    this.createModal();
    this.bindGlobalEvents();
    this.bindCertificateButtons();
  }
  
  createModal() {
    // Check if modal already exists
    if (document.getElementById('certificate-modal')) {
      this.modal = document.getElementById('certificate-modal');
      this.certificateImage = this.modal.querySelector('.certificate-image');
      this.closeBtn = this.modal.querySelector('.certificate-modal-close');
      return;
    }
    
    // Create modal structure
    const modalHTML = `
      <div id="certificate-modal" class="certificate-modal-overlay" role="dialog" aria-modal="true" aria-label="Award Certificate">
        <div class="certificate-container">
          <button class="certificate-modal-close" aria-label="Close certificate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img src="" alt="Award Certificate" class="certificate-image">
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    this.modal = document.getElementById('certificate-modal');
    this.certificateImage = this.modal.querySelector('.certificate-image');
    this.closeBtn = this.modal.querySelector('.certificate-modal-close');
  }
  
  bindGlobalEvents() {
    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Click outside to close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });
  }
  
  bindCertificateButtons() {
    // Find all certificate buttons and attach event listeners
    const certificateButtons = document.querySelectorAll('.btn-certificate');
    
    certificateButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const certificateSrc = button.getAttribute('data-certificate');
        const certificateAlt = button.getAttribute('data-certificate-alt') || 'Award Certificate';
        
        if (certificateSrc) {
          this.open(certificateSrc, certificateAlt);
        }
      });
    });
  }
  
  open(imageSrc, imageAlt = 'Award Certificate') {
    if (this.isOpen) return;
    
    // Store the last focused element
    this.lastFocusedElement = document.activeElement;
    
    // Set certificate image
    this.certificateImage.src = imageSrc;
    this.certificateImage.alt = imageAlt;
    
    // Show modal
    this.modal.classList.add('active');
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus close button for accessibility
    setTimeout(() => {
      this.closeBtn.focus();
    }, 100);
    
    // Announce to screen readers
    this.announce('Certificate modal opened');
  }
  
  close() {
    if (!this.isOpen) return;
    
    // Add closing animation
    this.modal.classList.add('closing');
    
    setTimeout(() => {
      this.modal.classList.remove('active', 'closing');
      this.isOpen = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Return focus to the button that opened the modal
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
      
      // Clear certificate image
      this.certificateImage.src = '';
      
      // Announce to screen readers
      this.announce('Certificate modal closed');
    }, 300);
  }
  
  announce(message) {
    // Create or update live region for screen reader announcements
    let liveRegion = document.getElementById('certificate-modal-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'certificate-modal-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
  }
  
  // Public method to rebind buttons (useful if new buttons are added dynamically)
  rebindButtons() {
    this.bindCertificateButtons();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.certificateModal = new CertificateModal();
  });
} else {
  window.certificateModal = new CertificateModal();
}
