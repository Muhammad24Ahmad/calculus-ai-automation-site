// Form handling and validation
// document.addEventListener('DOMContentLoaded', function() {
//     // Job Application Form
//     const jobForm = document.getElementById('jobApplicationForm');
//     if (jobForm) jobForm.addEventListener('submit', handleJobApplication);
//
//     // Contact Form
//     const contactForm = document.getElementById('contactForm');
//     if (contactForm) contactForm.addEventListener('submit', handleContactForm);
//
//     // File upload validation
//     const cvInput = document.getElementById('cv');
//     if (cvInput) {
//         cvInput.addEventListener('change', function() {
//             validateFileUpload(this);
//         });
//     }
//
//     // Real-time validation
//     const formInputs = document.querySelectorAll('.form-input, .form-textarea');
//     formInputs.forEach(input => {
//         input.addEventListener('blur', function() {
//             validateField(this);
//         });
//         input.addEventListener('input', function() {
//             if (this.style.borderColor === 'rgb(220, 38, 38)') {
//                 this.style.borderColor = '';
//             }
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("jobApplicationForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("submit_form.php", {
                method: "POST",
                body: formData
            });

            const result = await response.text();
            alert(result);
            form.reset();

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});


// Handle Job Application
function handleJobApplication(event) {
    event.preventDefault();
    const form = event.target;

    if (!validateForm(form)) {
        showAlert('Please fill in all required fields correctly.', 'error');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('../submit_form.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                showAlert("Application submitted successfully! We'll review your application and get back to you soon.", 'success');
                form.reset();
            } else {
                showAlert("Failed to send your application. Please try again later.", 'error');
            }
        })
        .catch(error => showAlert("Error: " + error.message, 'error'))
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Handle Contact Form
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;

    if (!validateForm(form)) {
        showAlert('Please fill in all required fields correctly.', 'error');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('../submit_form.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                showAlert("Message sent successfully! We'll get back to you within 24 hours.", 'success');
                form.reset();
            } else {
                showAlert("Failed to send message. Please try again later.", 'error');
            }
        })
        .catch(error => showAlert("Error: " + error.message, 'error'))
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Validate File Upload
function validateFileUpload(fileInput) {
    const file = fileInput.files[0];
    if (!file) return true;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        showAlert('Please upload a PDF or Word document.', 'error');
        fileInput.value = '';
        return false;
    }

    if (file.size > maxSize) {
        showAlert('File size must be less than 5MB.', 'error');
        fileInput.value = '';
        return false;
    }

    return true;
}

// Validation helpers
function validateField(field) {
    let isValid = true;

    if (field.hasAttribute('required') && !field.value.trim()) isValid = false;
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) isValid = false;
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(field.value.replace(/\s/g, ''))) isValid = false;
    }

    field.style.borderColor = isValid ? '' : '#dc2626';
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    for (let input of inputs) {
        if (!validateField(input)) return false;
    }
    return true;
}

// Alert display
function showAlert(message, type) {
    const box = document.getElementById('alert-box');
    box.textContent = message;
    box.style.color = type === 'success' ? 'green' : 'red';
    box.style.fontWeight = 'bold';
}
