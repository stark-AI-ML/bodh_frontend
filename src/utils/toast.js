export const showToast = (message, type = 'error') => {
  // Create toast container if it doesn't exist
  let container = document.getElementById('bodh-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bodh-toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `bodh-toast bodh-toast-${type}`;
  
  // Icon based on type
  const icon = type === 'error' ? '⚠️' : '✅';
  
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;

  // Append toast
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300); // match fade out transition
  }, 4000);
};
