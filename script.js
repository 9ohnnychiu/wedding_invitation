// Wedding Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.nav-bar');
    
    // Hide/Show Navigation on Scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only start hiding after scrolling past the hero section (about 100px)
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide navbar
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling up - show navbar
                navbar.classList.remove('nav-hidden');
            }
        } else {
            // At the top of the page - always show navbar
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // Active navigation highlighting (existing code)
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and enhancement
    const rsvpForm = document.querySelector('.rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRSVP(this);
        });

        // Dynamic form behavior
        const attendanceSelect = document.getElementById('attendance');
        const guestsInput = document.getElementById('guests');
        
        if (attendanceSelect && guestsInput) {
            attendanceSelect.addEventListener('change', function() {
                if (this.value === 'no') {
                    guestsInput.value = '0';
                    guestsInput.disabled = true;
                } else {
                    guestsInput.disabled = false;
                    if (guestsInput.value === '0') {
                        guestsInput.value = '1';
                    }
                }
            });
        }
    }
});

// Google Sheets Integration
async function submitRSVP(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    try {
        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = '提交中...';
        submitButton.disabled = true;
        
        // Submit to Google Sheets (you'll need to replace this with your actual endpoint)
        const response = await submitToGoogleSheets(data);
        
        if (response.success) {
            showResponse('感謝您的回覆！我們已收到您的RSVP確認。', 'success');
            form.reset();
        } else {
            throw new Error(response.message || '提交失敗');
        }
        
    } catch (error) {
        console.error('RSVP submission error:', error);
        showResponse('提交失敗，請稍後再試或聯繫我們。', 'error');
    } finally {
        // Reset button
        const submitButton = form.querySelector('.submit-button');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Function to submit to Google Sheets
async function submitToGoogleSheets(data) {
    // Google Apps Script Web App URL (you'll need to create this)
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    // For static deployment, we'll use a different approach
    // This is a placeholder - you'll need to implement this based on your Google Sheets setup
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        // Fallback: Save to localStorage for development/testing
        console.log('Saving RSVP data to localStorage (development mode):', data);
        const existingData = JSON.parse(localStorage.getItem('rsvpData') || '[]');
        existingData.push(data);
        localStorage.setItem('rsvpData', JSON.stringify(existingData));
        
        return { success: true, message: 'Data saved locally (development mode)' };
    }
}

// Show response message
function showResponse(message, type) {
    const responseDiv = document.getElementById('rsvp-response');
    if (responseDiv) {
        responseDiv.innerHTML = `<div class="response-message ${type}">${message}</div>`;
        responseDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            responseDiv.innerHTML = '';
        }, 5000);
    }
}

// Gallery functionality (enhanced with HTMX)
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
}

// Lightbox functionality
function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close" onclick="closeLightbox(this)">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox(lightbox.querySelector('.lightbox-close'));
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox.querySelector('.lightbox-close'));
        }
    });
}

function closeLightbox(closeButton) {
    const lightbox = closeButton.closest('.lightbox');
    if (lightbox) {
        document.body.removeChild(lightbox);
        document.body.style.overflow = 'auto';
    }
}

// HTMX event handlers
document.body.addEventListener('htmx:afterSwap', function(evt) {
    // Re-initialize gallery after HTMX swaps
    if (evt.detail.target.id === 'gallery') {
        initializeGallery();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

// Utility functions for development
function downloadRSVPData() {
    const data = JSON.parse(localStorage.getItem('rsvpData') || '[]');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function clearRSVPData() {
    localStorage.removeItem('rsvpData');
    console.log('RSVP data cleared from localStorage');
}

// Add these functions to window for development access
if (typeof window !== 'undefined') {
    window.downloadRSVPData = downloadRSVPData;
    window.clearRSVPData = clearRSVPData;
}