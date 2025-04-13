/**
 * ArtifyAI - Image to Oil Painting Converter
 * Main JavaScript File
 */

// ===== DOM ELEMENTS =====
const app = {
    // Navigation
    sidebar: document.querySelector('.sidebar'),
    mainNav: document.querySelector('.main-nav'),
    navItems: document.querySelectorAll('.nav-item'),
    
    // Sections
    sections: document.querySelectorAll('.section'),
    
    // Creator
    uploadArea: document.querySelector('.upload-area'),
    fileInput: document.querySelector('#fileInput'),
    originalPreview: document.querySelector('#originalPreview'),
    transformedPreview: document.querySelector('#transformedPreview'),
    convertBtn: document.querySelector('#convertBtn'),
    downloadBtn: document.querySelector('#downloadBtn'),
    
    // FAQ
    faqItems: document.querySelectorAll('.faq-item'),
    
    // Error Message
    errorMessage: document.querySelector('.error-message')
};

// ===== STATE =====
const state = {
    currentFile: null,
    transformedImage: null,
    isConverting: false
};

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeUploadArea();
    initializeFAQ();
    initializeMobileMenu();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    app.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            switchSection(target);
            
            // Update active state
            app.navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                app.sidebar.classList.remove('active');
            }
        });
    });
}

function switchSection(sectionId) {
    app.sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    // Create mobile menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '<span class="menu-icon">☰</span>';
    document.body.appendChild(menuButton);
    
    // Add event listener
    menuButton.addEventListener('click', () => {
        app.sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!app.sidebar.contains(e.target) && !menuButton.contains(e.target)) {
            app.sidebar.classList.remove('active');
        }
    });
}

// ===== UPLOAD AREA =====
function initializeUploadArea() {
    // Click to upload
    app.uploadArea.addEventListener('click', () => {
        app.fileInput.click();
    });
    
    // Drag and drop
    app.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        app.uploadArea.classList.add('drag-over');
    });
    
    app.uploadArea.addEventListener('dragleave', () => {
        app.uploadArea.classList.remove('drag-over');
    });
    
    app.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        app.uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    });
    
    // File input change
    app.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });
    
    // Convert button
    app.convertBtn.addEventListener('click', convertImage);
    
    // Download button
    app.downloadBtn.addEventListener('click', downloadImage);
}

function handleFileUpload(file) {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload an image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
    }
    
    // Update state
    state.currentFile = file;
    
    // Display original image
    const reader = new FileReader();
    reader.onload = (e) => {
        app.originalPreview.src = e.target.result;
        app.originalPreview.style.display = 'block';
        
        // Reset transformed image
        app.transformedPreview.style.display = 'none';
        state.transformedImage = null;
        
        // Enable convert button
        app.convertBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// ===== IMAGE CONVERSION =====
async function convertImage() {
    if (!state.currentFile || state.isConverting) return;
    
    try {
        state.isConverting = true;
        app.convertBtn.disabled = true;
        app.convertBtn.textContent = 'Converting...';
        
        // Create FormData to send the image
        const formData = new FormData();
        formData.append('image', state.currentFile);
        
        // Send the image to the Python backend
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        
        // Get the transformed image as a blob
        const blob = await response.blob();
        
        // Create a URL for the blob
        const imageUrl = URL.createObjectURL(blob);
        
        // Display transformed image
        app.transformedPreview.src = imageUrl;
        app.transformedPreview.style.display = 'block';
        
        // Update state
        state.transformedImage = imageUrl;
        
        // Enable download button
        app.downloadBtn.disabled = false;
        
    } catch (error) {
        showError('Error converting image. Please try again.');
        console.error('Conversion error:', error);
    } finally {
        state.isConverting = false;
        app.convertBtn.disabled = false;
        app.convertBtn.textContent = 'Convert to Oil Painting';
    }
}

// ===== DOWNLOAD =====
function downloadImage() {
    if (!state.transformedImage) return;
    
    const link = document.createElement('a');
    link.href = state.transformedImage;
    link.download = `oil-painting-${state.currentFile.name}`;
    link.click();
}

// ===== FAQ =====
function initializeFAQ() {
    app.faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Toggle active state
            item.classList.toggle('active');
            
            // Close other items
            app.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// ===== ERROR HANDLING =====
function showError(message) {
    app.errorMessage.textContent = message;
    app.errorMessage.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        app.errorMessage.style.display = 'none';
    }, 3000);
}

// ===== UTILITIES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close sidebar on mobile when resizing to desktop
    if (window.innerWidth > 992) {
        app.sidebar.classList.remove('active');
    }
}, 250)); 