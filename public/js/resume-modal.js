/**
 * Resume Modal Component
 * A modular and reusable modal for displaying resume content
 * Features: keyboard accessibility, focus trap, smooth animations
 * Consistent with existing contact-modal patterns
 */

class ResumeModal {
  constructor(options = {}) {
    this.overlay = null;
    this.modal = null;
    this.closeBtn = null;
    this.triggerBtns = [];
    this.lastFocusedElement = null;
    this.focusableElements = [];
    this.isOpen = false;
    this.closeTimer = null;
    
    // Configuration with defaults
    this.config = {
      overlayId: options.overlayId || 'resume-modal-overlay',
      triggerSelector: options.triggerSelector || '.btn-view-resume, .contact-btn.resume',
      closeOnOverlay: options.closeOnOverlay !== false,
      closeOnEsc: options.closeOnEsc !== false,
      animationDuration: options.animationDuration || 400,
      // Resume file configuration - easily updatable
      resumePdfUrl: options.resumePdfUrl || 'assets/documents/resume.pdf',
      resumeType: options.resumeType || 'html', // 'pdf', 'image', or 'html'
    };
    
    this.init();
  }
  
  init() {
    this.overlay = document.getElementById(this.config.overlayId);
    if (!this.overlay) {
      console.warn('Resume modal overlay not found');
      return;
    }
    
    this.modal = this.overlay.querySelector('.resume-modal');
    this.closeBtn = this.overlay.querySelector('.resume-modal-close');
    this.triggerBtns = document.querySelectorAll(this.config.triggerSelector);
    
    this.bindEvents();
    this.updateFocusableElements();
  }
  
  bindEvents() {
    // Trigger button clicks (support multiple trigger buttons)
    this.triggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.lastFocusedElement = btn;
        this.open();
      });
    });
    
    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Overlay click (close on background click)
    if (this.config.closeOnOverlay && this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }
  
  handleKeyDown(e) {
    if (!this.isOpen) return;
    
    // Close on Escape
    if (this.config.closeOnEsc && e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    
    // Focus trap with Tab
    if (e.key === 'Tab') {
      this.handleTabKey(e);
    }
  }
  
  handleTabKey(e) {
    this.updateFocusableElements();
    
    if (this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab: if on first element, go to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, go to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  updateFocusableElements() {
    if (!this.modal) return;
    
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.focusableElements = Array.from(
      this.modal.querySelectorAll(focusableSelectors)
    ).filter(el => {
      return el.offsetParent !== null; // Element is visible
    });
  }
  
  open() {
    if (this.isOpen || !this.overlay) return;
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.overlay.classList.remove('closing');
    
    // Store the element that triggered the modal
    this.lastFocusedElement = document.activeElement;
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    // Show overlay
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    
    this.isOpen = true;

    // Move focus as soon as the surface becomes interactive so keyboard input
    // remains live throughout the materialization transition.
    setTimeout(() => {
      this.updateFocusableElements();
      if (this.closeBtn) {
        this.closeBtn.focus();
      } else if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      }
    }, 100);
    
    // Dispatch custom event
    this.overlay.dispatchEvent(new CustomEvent('resumeModalOpen'));
  }
  
  close() {
    if (!this.isOpen || !this.overlay) return;
    
    // Add closing animation class
    this.overlay.classList.add('closing');
    this.isOpen = false;
    
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : this.config.animationDuration * 0.75;

    this.closeTimer = setTimeout(() => {
      if (!this.overlay.classList.contains('closing')) return;
      this.overlay.classList.remove('active', 'closing');
      this.overlay.setAttribute('aria-hidden', 'true');
      
      // Restore body scroll
      document.body.classList.remove('modal-open');
      
      // Return focus to trigger element
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
      
      this.closeTimer = null;
      // Dispatch custom event
      this.overlay.dispatchEvent(new CustomEvent('resumeModalClose'));
    }, duration);
  }
  
  // Public method to update resume PDF URL
  updateResumePdf(url) {
    this.config.resumePdfUrl = url;
    const pdfEmbed = this.modal?.querySelector('.resume-pdf-container embed, .resume-pdf-container iframe');
    if (pdfEmbed) {
      pdfEmbed.src = url;
    }
    const downloadBtn = this.modal?.querySelector('.btn-download-resume');
    if (downloadBtn) {
      downloadBtn.href = url;
    }
  }
  
  // Public method to check if modal is open
  getIsOpen() {
    return this.isOpen;
  }
  
  // Public method to programmatically toggle modal
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Initialize resume modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if resume modal elements exist on the page
  if (document.getElementById('resume-modal-overlay')) {
    window.resumeModal = new ResumeModal({
      // Configuration can be customized here
      // resumePdfUrl: 'path/to/your/resume.pdf',
      // resumeType: 'html', // or 'pdf' or 'image'
    });
  }
});
