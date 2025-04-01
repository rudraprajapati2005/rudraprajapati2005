


document.addEventListener('DOMContentLoaded', function() {
    // Form elements animation
    const formElements = document.querySelectorAll('input, textarea, select');
    
    formElements.forEach(element => {
        // Add focus effects
        element.addEventListener('focus', function() {
            this.parentElement.querySelector('.focus-border').style.width = '100%';
            this.parentElement.querySelector('.focus-border').style.left = '0';
        });

        element.addEventListener('blur', function() {
            this.parentElement.querySelector('.focus-border').style.width = '0';
            this.parentElement.querySelector('.focus-border').style.left = '50%';
        });

        // Add validation
        element.addEventListener('invalid', function(e) {
            e.preventDefault();
            showError(this);
        });
    });
    
    // Add date validation
    const deadlineInput = document.querySelector('input[type="date"]');
    if (deadlineInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        deadlineInput.setAttribute('min', today);
        
        // Validate date on change
        deadlineInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const currentDate = new Date();
            
            // Reset time part for accurate date comparison
            currentDate.setHours(0, 0, 0, 0);
            
            if (selectedDate < currentDate) {
                alert('Please select a future date for the project deadline.');
                this.value = '';
            }
        });
    }

    // Form submission handling
    const form = document.getElementById('projectForm');
    form.addEventListener('submit', function(e) {
        // Remove the preventDefault() to allow form submission
        if (validateForm()) {
            showLoadingState();
            form.submit(); // Actually submit the form
        } else {
            e.preventDefault(); // Only prevent if validation fails
        }
    });
});

// Form validation
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field);
            isValid = false;
        } else {
            clearError(field);
        }
    });

    return isValid;
}

// Error handling
function showError(element) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Please fill in ${element.getAttribute('placeholder') || 'this field'}`;
    
    if (!element.parentElement.querySelector('.error-message')) {
        element.parentElement.appendChild(errorDiv);
    }
    element.style.borderColor = 'var(--error-color)';
}

function clearError(element) {
    const errorMessage = element.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    element.style.borderColor = 'var(--border-color)';
}

// Loading state
function showLoadingState() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
}

function resetLoadingState() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Create Project';
}

// Success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    // Optionally redirect or reset form
    document.getElementById('projectForm').reset();
}

// Form reset
function resetForm() {
    document.getElementById('projectForm').reset();
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    formElements.forEach(element => {
        element.style.borderColor = 'var(--border-color)';
    });
}

// Prevent form submission on enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.nodeName !== 'TEXTAREA') {
        e.preventDefault();
    }
});
