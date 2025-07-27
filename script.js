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
});

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

// HTMX RSVP form event handlers
document.body.addEventListener('htmx:responseError', function(evt) {
    if (evt.detail.target.classList.contains('rsvp-form')) {
        console.log('HTMX Response Error:', evt.detail);
        document.getElementById('rsvp-response').innerHTML = 
            '<div class="response-message error">提交失敗，請稍後再試或聯繫我們。</div>';
    }
});

document.body.addEventListener('htmx:sendError', function(evt) {
    if (evt.detail.target.classList.contains('rsvp-form')) {
        console.log('HTMX Send Error (likely CORS):', evt.detail);
        document.getElementById('rsvp-response').innerHTML = 
            '<div class="response-message error">網路連線錯誤，請檢查網路連線後再試。</div>';
    }
});

document.body.addEventListener('htmx:afterRequest', function(evt) {
    if (evt.detail.target.classList.contains('rsvp-form')) {
        console.log('HTMX After Request:', evt.detail);
        const xhr = evt.detail.xhr;
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    document.getElementById('rsvp-response').innerHTML = 
                        '<div class="response-message success">感謝您的回覆！我們已收到您的RSVP確認。</div>';
                    evt.detail.target.reset();
                } else {
                    document.getElementById('rsvp-response').innerHTML = 
                        '<div class="response-message error">提交失敗：' + (response.message || '未知錯誤') + '</div>';
                }
            } catch (e) {
                console.error('JSON Parse Error:', e);
                document.getElementById('rsvp-response').innerHTML = 
                    '<div class="response-message error">回應格式錯誤，請稍後再試。</div>';
            }
        } else if (xhr.status === 0) {
            // This usually indicates a CORS error
            document.getElementById('rsvp-response').innerHTML = 
                '<div class="response-message error">連線被阻擋，可能是CORS政策問題。請稍後再試或聯繫我們。</div>';
        }
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});