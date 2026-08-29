/**
 * Contact Card Modal Component
 * A modular and reusable modal for displaying contact information
 * Features: keyboard accessibility, focus trap, smooth animations
 */

class ContactModal {
  constructor(options = {}) {
    this.overlay = null;
    this.card = null;
    this.closeBtn = null;
    this.triggerBtn = null;
    this.lastFocusedElement = null;
    this.focusableElements = [];
    this.isOpen = false;
    
    // Configuration with defaults
    this.config = {
      overlayId: options.overlayId || 'contact-modal-overlay',
      triggerSelector: options.triggerSelector || '.btn.my-contact',
      closeOnOverlay: options.closeOnOverlay !== false,
      closeOnEsc: options.closeOnEsc !== false,
      animationDuration: options.animationDuration || 400,
    };
    
    this.init();
  }
  
  init() {
    this.overlay = document.getElementById(this.config.overlayId);
    if (!this.overlay) {
      console.warn('Contact modal overlay not found');
      return;
    }
    
    this.card = this.overlay.querySelector('.contact-card');
    this.closeBtn = this.overlay.querySelector('.contact-card-close');
    this.triggerBtn = document.querySelector(this.config.triggerSelector);
    
    this.bindEvents();
    this.updateFocusableElements();
  }
  
  bindEvents() {
    // Trigger button click
    if (this.triggerBtn) {
      this.triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }
    
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
    if (!this.card) return;
    
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.focusableElements = Array.from(
      this.card.querySelectorAll(focusableSelectors)
    ).filter(el => {
      return el.offsetParent !== null; // Element is visible
    });
  }
  
  open() {
    if (this.isOpen || !this.overlay) return;
    
    // Store the element that triggered the modal
    this.lastFocusedElement = document.activeElement;
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    // Show overlay
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    
    // Set focus to close button after animation
    setTimeout(() => {
      this.updateFocusableElements();
      if (this.closeBtn) {
        this.closeBtn.focus();
      } else if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      }
    }, 100);
    
    this.isOpen = true;
    
    // Dispatch custom event
    this.overlay.dispatchEvent(new CustomEvent('modalOpen'));
  }
  
  close() {
    if (!this.isOpen || !this.overlay) return;
    
    // Add closing animation class
    this.overlay.classList.add('closing');
    
    // Remove classes after animation completes
    setTimeout(() => {
      this.overlay.classList.remove('active', 'closing');
      this.overlay.setAttribute('aria-hidden', 'true');
      
      // Restore body scroll
      document.body.classList.remove('modal-open');
      
      // Return focus to trigger element
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
      
      this.isOpen = false;
      
      // Dispatch custom event
      this.overlay.dispatchEvent(new CustomEvent('modalClose'));
    }, this.config.animationDuration * 0.75); // Slightly shorter for smooth transition
  }
  
  // Public method to update contact information
  updateContactInfo(info) {
    if (info.name) {
      const nameEl = this.card?.querySelector('.contact-card-name');
      if (nameEl) nameEl.textContent = info.name;
    }
    
    if (info.title) {
      const titleEl = this.card?.querySelector('.contact-card-title');
      if (titleEl) titleEl.textContent = info.title;
    }
    
    if (info.avatar) {
      const avatarEl = this.card?.querySelector('.contact-card-avatar');
      if (avatarEl) avatarEl.style.backgroundImage = `url('${info.avatar}')`;
    }
    
    if (info.phone) {
      const phoneEl = this.card?.querySelector('[data-contact="phone"] .contact-info-value');
      if (phoneEl) phoneEl.textContent = info.phone;
    }
    
    if (info.email) {
      const emailEl = this.card?.querySelector('[data-contact="email"] .contact-info-value a');
      if (emailEl) {
        emailEl.textContent = info.email;
        emailEl.href = `mailto:${info.email}`;
      }
    }
    
    if (info.location) {
      const locationEl = this.card?.querySelector('[data-contact="location"] .contact-info-value');
      if (locationEl) locationEl.textContent = info.location;
    }
  }
  
  // Destroy the modal instance
  destroy() {
    if (this.isOpen) this.close();
    
    // Remove event listeners would go here if needed
    // For simplicity, we're not tracking individual listeners
  }
}

// Initialize contact modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create global instance for potential external access
  window.contactModal = new ContactModal();
});
