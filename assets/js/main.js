// ========================================
// Happy Memories Rentals - Main JavaScript
// ========================================

console.log('🔥 main.js is loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔥 DOMContentLoaded event fired');
    initMobileMenu();
    setActiveNavLink();
    initQuantityButtons();

    if (document.getElementById('bookingForm')) {
        console.log('🔥 bookingForm found, initializing...');
        initRentalTotals();
        initDeliveryToggle();
        initCityDistanceEstimate();
        // Separate Formspree endpoint for booking requests
        handleFormSubmission('bookingForm', 'https://formspree.io/f/xjggwkja');
    } else {
        console.log('❌ bookingForm NOT found');
    }

    if (document.getElementById('contactForm')) {
        initContactDeliveryToggle();
        // Separate Formspree endpoint for contact form (use your second form endpoint here)
        handleFormSubmission('contactForm', 'https://formspree.io/f/xjggwkja');
    }

    if (document.querySelector('[data-animate]')) {
        initStatsAnimation();
    }

    initSmoothScroll();
    initHeroScrollAnimation();
});


// ========================================
// VIEW SWITCHING (Rentals Page)
// ========================================
function showSelectionScreen() {
    document.getElementById('selectionScreen').style.display = 'block';
    document.getElementById('individualItemsSection').style.display = 'none';
    document.getElementById('packagesSection').style.display = 'none';
    document.querySelector('.booking-form-section').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showIndividualItems() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('individualItemsSection').style.display = 'block';
    document.getElementById('packagesSection').style.display = 'none';
    document.querySelector('.booking-form-section').style.display = 'block';
    
    // Reset package selections
    resetPackageSelections();
    
    // Recalculate individual items total
    if (typeof calculateTotal !== 'undefined') {
        setTimeout(() => {
            const inputs = document.querySelectorAll('#individualItemsSection input[type="number"]');
            if (inputs.length > 0) {
                inputs[0].dispatchEvent(new Event('input'));
            }
        }, 100);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPackages() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('individualItemsSection').style.display = 'none';
    document.getElementById('packagesSection').style.display = 'block';
    document.querySelector('.booking-form-section').style.display = 'block';
    
    // Reset individual item quantities
    resetIndividualItems();
    
    // Calculate package total
    calculatePackageTotal();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetPackageSelections() {
    const superheroCheckbox = document.getElementById('superhero-package');
    const princessCheckbox = document.getElementById('princess-package');
    if (superheroCheckbox) superheroCheckbox.checked = false;
    if (princessCheckbox) princessCheckbox.checked = false;
    
    const packageTotal = document.getElementById('packageTotalPrice');
    if (packageTotal) packageTotal.textContent = '$0.00';
}

function resetIndividualItems() {
    const quantityInputs = document.querySelectorAll('#individualItemsSection input[type="number"]');
    quantityInputs.forEach(input => {
        input.value = 0;
    });
    
    const totalPrice = document.getElementById('totalPrice');
    const finalTotal = document.getElementById('finalTotal');
    if (totalPrice) totalPrice.textContent = '$0.00';
    if (finalTotal) finalTotal.textContent = '$0.00';
    
    const summaryDiv = document.getElementById('selectedItemsSummary');
    if (summaryDiv) summaryDiv.style.display = 'none';
}

// ========================================
// PACKAGE TOTAL CALCULATION
// ========================================
function calculatePackageTotal() {
    const superheroCheckbox = document.getElementById('superhero-package');
    const princessCheckbox = document.getElementById('princess-package');
    
    let total = 0;
    const selectedPackages = [];
    
    if (superheroCheckbox && superheroCheckbox.checked) {
        total += parseFloat(superheroCheckbox.value);
        selectedPackages.push({
            name: 'Superhero Party Package',
            price: parseFloat(superheroCheckbox.value)
        });
    }
    
    if (princessCheckbox && princessCheckbox.checked) {
        total += parseFloat(princessCheckbox.value);
        selectedPackages.push({
            name: 'Princess Party Package',
            price: parseFloat(princessCheckbox.value)
        });
    }
    
    // Update package total display
    const packageTotalPrice = document.getElementById('packageTotalPrice');
    const finalTotal = document.getElementById('finalTotal');
    
    if (packageTotalPrice) {
        packageTotalPrice.textContent = `$${total.toFixed(2)}`;
    }
    
    if (finalTotal) {
        finalTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update selected packages summary
    updatePackageSummary(selectedPackages, total);
}

function updatePackageSummary(packages, total) {
    const summaryDiv = document.getElementById('selectedItemsSummary');
    const listEl = document.getElementById('selectedItemsList');
    const summaryTotalEl = document.getElementById('summaryTotal');
    const summaryTitle = summaryDiv?.querySelector('h3');
    
    if (!summaryDiv || !listEl || !summaryTotalEl) return;
    
    if (packages.length === 0) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    summaryDiv.style.display = 'block';
    
    // Update title for packages
    if (summaryTitle) {
        summaryTitle.textContent = 'Your Selected Package(s):';
    }
    
    listEl.innerHTML = packages.map(pkg => `
        <li style="padding:0.5rem 0;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
            <span><strong>${pkg.name}</strong></span>
            <span style="font-weight:bold;">$${pkg.price.toFixed(2)}</span>
        </li>
    `).join('');
    
    summaryTotalEl.textContent = `$${total.toFixed(2)}`;
}

// ========================================
// QUANTITY BUTTONS
// ========================================
function initQuantityButtons() {
    const plusButtons = document.querySelectorAll('.qty-btn.plus');
    const minusButtons = document.querySelectorAll('.qty-btn.minus');
    const quantityInputs = document.querySelectorAll('.quantity-selector input[type="number"]');
    
    plusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.getAttribute('data-input');
            const input = document.getElementById(inputId);
            if (!input) return;
            
            const max = parseInt(input.getAttribute('max'));
            const current = parseInt(input.value) || 0;
            
            if (current < max) {
                input.value = current + 1;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });
    
    minusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.getAttribute('data-input');
            const input = document.getElementById(inputId);
            if (!input) return;
            
            const min = parseInt(input.getAttribute('min'));
            const current = parseInt(input.value) || 0;
            
            if (current > min) {
                input.value = current - 1;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });
    
    // Validate manual input
    quantityInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const min = parseInt(input.getAttribute('min'));
            const max = parseInt(input.getAttribute('max'));
            let value = parseInt(input.value);
            
            // Handle empty or invalid input
            if (isNaN(value) || input.value === '') {
                return; // Let user type
            }
            
            // Enforce min/max constraints
            if (value < min) {
                input.value = min;
            } else if (value > max) {
                input.value = max;
            }
        });
        
        // Final validation on blur (when user leaves the field)
        input.addEventListener('blur', (e) => {
            const min = parseInt(input.getAttribute('min'));
            let value = parseInt(input.value);
            
            if (isNaN(value) || input.value === '') {
                input.value = min;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// ACTIVE NAV LINK
// ========================================
function setActiveNavLink() {
    const currentPage =
        window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========================================
// RENTAL TOTAL CALCULATION
// ========================================
function initRentalTotals() {
    const prices = {
        'white-chairs': 1.5,
        'adult-tables': 10,
        'kids-chairs': 3,
        'kids-tables': 10,
        'wooden-stools': 2,
        'white-resin-chairs': 2.5,
        'cherry-backdrop': 60
    };

    const itemNames = {
        'white-chairs': 'White Plastic Chairs',
        'adult-tables': 'Plastic Tables (Adult)',
        'kids-chairs': 'Kids Pink Chiavari Chairs',
        'kids-tables': 'Kids Tables',
        'wooden-stools': 'Wooden Kids Stools',
        'white-resin-chairs': 'Kids White Resin Chairs',
        'cherry-backdrop': 'Cherry Backdrop'
    };

    function calculateTotal() {
        let subtotal = 0;
        const selectedItems = [];

        Object.keys(prices).forEach(id => {
            const qty = parseInt(document.getElementById(id)?.value || 0);
            const itemTotal = qty * prices[id];
            subtotal += itemTotal;

            if (qty > 0) {
                selectedItems.push({
                    name: itemNames[id],
                    qty: qty,
                    price: prices[id],
                    total: itemTotal
                });
            }
        });

        // Update totals
        document.getElementById('totalPrice').textContent =
            `$${subtotal.toFixed(2)}`;
        document.getElementById('finalTotal').textContent =
            `$${subtotal.toFixed(2)}`;
        
        // Update selected items summary
        updateSelectedItemsList(selectedItems, subtotal);
    }

    function updateSelectedItemsList(items, total) {
        const summaryDiv = document.getElementById('selectedItemsSummary');
        const listEl = document.getElementById('selectedItemsList');
        const summaryTotalEl = document.getElementById('summaryTotal');

        if (!summaryDiv || !listEl || !summaryTotalEl) return;

        if (items.length === 0) {
            summaryDiv.style.display = 'none';
            return;
        }

        summaryDiv.style.display = 'block';
        
        listEl.innerHTML = items.map(item => `
            <li style="padding:0.5rem 0;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
                <span><strong>${item.name}</strong> × ${item.qty} @ $${item.price.toFixed(2)}</span>
                <span style="font-weight:bold;">$${item.total.toFixed(2)}</span>
            </li>
        `).join('');

        summaryTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    Object.keys(prices).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateTotal);
            input.addEventListener('input', () => enforceMaxQuantity(input));
            
            // Clear 0 when user focuses and starts typing
            input.addEventListener('focus', function() {
                if (this.value === '0') {
                    this.value = '';
                }
            });
            
            // Restore 0 if left empty
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.value = '0';
                    calculateTotal();
                }
            });
        }
    });

    calculateTotal();
}

// ========================================
// MAX QUANTITY ENFORCEMENT
// ========================================
function enforceMaxQuantity(input) {
    const max = parseInt(input.getAttribute('max'));
    const min = parseInt(input.getAttribute('min')) || 0;
    let value = parseInt(input.value);
    
    // Remove any existing max message
    const existingMsg = input.parentElement.querySelector('.max-qty-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Enforce max limit - don't allow typing beyond max
    if (value > max) {
        input.value = max;
        value = max;
    }
    
    // Enforce min limit
    if (value < min || isNaN(value)) {
        input.value = min;
        value = min;
    }
    
    // Show message if at max
    if (value >= max && max > 0) {
        const message = document.createElement('div');
        message.className = 'max-qty-message';
        message.textContent = '✓ Max quantity selected';
        message.style.cssText = `
            color: #ff6b9d;
            font-size: 0.85rem;
            font-weight: 600;
            margin-top: 0.5rem;
            padding: 0.4rem 0.8rem;
            background: #fff0f5;
            border-radius: 8px;
            border: 2px solid #ff6b9d;
            display: inline-block;
        `;
        input.parentElement.appendChild(message);
    }
}

// ========================================
// DELIVERY YES / NO TOGGLE
// ========================================
function initDeliveryToggle() {
    const radios = document.querySelectorAll(
        'input[name="Delivery Needed"]'
    );
    const section = document.getElementById('deliverySection');
    const addressInput = document.getElementById('eventAddress');
    const deliveryFeeNotice = document.getElementById('deliveryFeeNotice');

    if (!radios.length || !section) return;

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isDelivery = radio.value.includes('Yes') && radio.checked;
            section.style.display = isDelivery ? 'block' : 'none';
            
            // Toggle delivery fee notice
            if (deliveryFeeNotice) {
                deliveryFeeNotice.style.display = isDelivery ? 'block' : 'none';
            }
            
            // Toggle required attribute on address field
            if (addressInput) {
                addressInput.required = isDelivery;
                if (!isDelivery) {
                    addressInput.value = ''; // Clear address if switching to pickup
                }
            }
        });
    });
}

// ========================================
// CITY DISTANCE ESTIMATE (DISPLAY ONLY)
// ========================================
function initCityDistanceEstimate() {
    const cityInput = document.getElementById('customerCity');
    const output = document.getElementById('distanceEstimate');

    if (!cityInput || !output) return;

    const cityDistances = {
        "imperial beach": 0,
        "chula vista": 7,
        "san diego": 14,
        "national city": 10,
        "coronado": 12,
        "la mesa": 18,
        "spring valley": 15,
        "el cajon": 23,
        "santee": 22,
        "poway": 30
    };

    cityInput.addEventListener('input', () => {
        const city = cityInput.value.trim().toLowerCase();

        if (!city) {
            output.textContent = '📍 Distance estimate will appear here';
            return;
        }

        if (cityDistances[city] !== undefined) {
            output.textContent =
                `📍 Estimated distance from Imperial Beach: ~${cityDistances[city]} miles`;
        } else {
            output.textContent =
                '📍 Distance estimate not available — we will confirm manually';
        }
    });
}

// ========================================
// CONTACT FORM DELIVERY TOGGLE
// ========================================
function initContactDeliveryToggle() {
    const needsDeliverySelect = document.getElementById('needsDelivery');
    const partyAddressGroup = document.getElementById('partyAddressGroup');
    const partyAddressInput = document.getElementById('partyAddress');

    if (!needsDeliverySelect || !partyAddressGroup) return;

    needsDeliverySelect.addEventListener('change', (e) => {
        if (e.target.value === 'yes') {
            partyAddressGroup.style.display = 'block';
            partyAddressInput.setAttribute('required', 'required');
        } else {
            partyAddressGroup.style.display = 'none';
            partyAddressInput.removeAttribute('required');
            partyAddressInput.value = '';
        }
    });
}

// ========================================
// FORMSPREE FORM HANDLER
// ========================================
function handleFormSubmission(formId, formspreeUrl) {
    console.log('Setting up form handler for:', formId);
    const form = document.getElementById(formId);
    
    if (!form) {
        console.error('Form not found:', formId);
        return;
    }
    
    console.log('Form found:', form);

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    
    console.log('Submit button:', submitButton);

    // Add both form submit AND button click handlers
    const handleSubmit = async (e) => {
        console.log('🚀 Form submission triggered!');
        e.preventDefault();
        e.stopPropagation();

        // Remove any existing messages
        const existingMessages = form.querySelectorAll('.thank-you-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        // Show instant optimistic feedback
        const loadingBox = document.createElement('div');
        loadingBox.className = 'loading-message';
        loadingBox.style.cssText = `
            background: #cce5ff;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1rem;
            text-align: center;
            color: #004085;
            font-size: 1.1rem;
            font-weight: 600;
            animation: fadeIn 0.3s ease-in;
        `;
        loadingBox.innerHTML = '⏳ Sending your request...';
        submitButton.insertAdjacentElement('afterend', loadingBox);

        try {
            console.log('Attempting to send to Formspree...');
            const formData = new FormData(form);
            
            // If this is the booking form, add detailed item breakdown
            if (formId === 'bookingForm') {
                const finalTotal = document.getElementById('finalTotal');
                
                // Add a separator for rental items section
                formData.append('═══════════════════', '═══════════════════');
                formData.append('📋 RENTAL ITEMS', '📋 RENTAL ITEMS');
                formData.append('═══════════════════', '═══════════════════');
                
                // Get all quantity inputs for individual items
                const itemInputs = {
                    'white-chairs': 'White Plastic Chairs',
                    'adult-tables': 'Plastic Tables (Adult)',
                    'kids-chairs': 'Kids Pink Chiavari Chairs',
                    'kids-tables': 'Kids Tables',
                    'wooden-stools': 'Wooden Kids Stools',
                    'white-resin-chairs': 'Kids White Resin Chairs',
                    'cherry-backdrop': 'Cherry Backdrop'
                };
                
                // Add each item with quantity to form data
                let itemCount = 0;
                Object.keys(itemInputs).forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        const qty = parseInt(input.value || 0);
                        if (qty > 0) {
                            itemCount++;
                            formData.append(`${itemInputs[id]}`, `Quantity: ${qty}`);
                        }
                    }
                });
                
                // Check for package selections
                const superheroCheckbox = document.getElementById('superhero-package');
                const princessCheckbox = document.getElementById('princess-package');
                
                if (superheroCheckbox && superheroCheckbox.checked) {
                    itemCount++;
                    formData.append('Superhero Party Package', '✓ SELECTED');
                }
                
                if (princessCheckbox && princessCheckbox.checked) {
                    itemCount++;
                    formData.append('Princess Party Package', '✓ SELECTED');
                }
                
                // Add summary section
                formData.append('───────────────────', '───────────────────');
                formData.append('📊 BOOKING SUMMARY', '📊 BOOKING SUMMARY');
                formData.append('───────────────────', '───────────────────');
                formData.append('Total Items/Packages', itemCount > 0 ? `${itemCount}` : 'No items selected');
                
                // Add estimated total
                if (finalTotal) {
                    formData.append('💰 Estimated Total', finalTotal.innerText || '$0.00');
                }
            }
            
            // Log form data
            console.log('Form data entries:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value}`);
            }
            
            // Add timeout to prevent long waits
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('Response received:', response);
            console.log('Response OK:', response.ok);
            console.log('Response status:', response.status);

            // Remove loading message
            loadingBox.remove();

            if (!response.ok) throw new Error('Formspree error');

            // Create and show green thank you box below the submit button
            const thankYouBox = document.createElement('div');
            thankYouBox.className = 'thank-you-message';
            thankYouBox.style.cssText = `
                background: #d4edda;
                border: 2px solid #28a745;
                border-radius: 8px;
                padding: 1.5rem;
                margin-top: 1rem;
                text-align: center;
                color: #155724;
                font-size: 1.1rem;
                font-weight: 600;
                animation: fadeIn 0.5s ease-in;
                box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2);
            `;
            thankYouBox.innerHTML = '✅ Success! Your booking request has been received.<br>Thank you! A member of our team will follow up with you shortly.';
            
            // Insert after submit button
            submitButton.insertAdjacentElement('afterend', thankYouBox);
            
            // Scroll to the thank you message
            thankYouBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

            form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Remove loading message if it exists
            const loadingMsg = form.querySelector('.loading-message');
            if (loadingMsg) loadingMsg.remove();
            
            // Create and show error message
            const errorBox = document.createElement('div');
            errorBox.className = 'error-message';
            errorBox.style.cssText = `
                background: #f8d7da;
                border: 2px solid #dc3545;
                border-radius: 8px;
                padding: 1.5rem;
                margin-top: 1rem;
                text-align: center;
                color: #721c24;
                font-size: 1.1rem;
                font-weight: 600;
                animation: fadeIn 0.5s ease-in;
                box-shadow: 0 4px 6px rgba(220, 53, 69, 0.2);
            `;
            errorBox.innerHTML = '❌ Something went wrong. Please try again or contact us directly.';
            
            // Insert after submit button
            submitButton.insertAdjacentElement('afterend', errorBox);
            
            errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    };

    // Attach to form submit event
    form.addEventListener('submit', handleSubmit);
    
    // ALSO attach directly to button click as backup
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            console.log('🖱️ Button clicked directly!');
            // Check if form is valid
            if (form.checkValidity()) {
                console.log('✅ Form is valid, triggering submit');
                handleSubmit(e);
            } else {
                console.log('❌ Form validation failed');
                form.reportValidity();
            }
        });
    }
    
    console.log('Form handler setup complete for:', formId);
}



// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========================================
// HERO SCROLL ANIMATION
// ========================================
function initHeroScrollAnimation() {
    // Only apply scroll animation on homepage
    const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '/index.html';
    
    if (!isHomepage) return;
    
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const heroAnimateElements = heroSection.querySelectorAll('.hero-animate');
    if (heroAnimateElements.length === 0) return;
    
    // Add scroll-trigger class to prepare for scroll-based animation
    heroAnimateElements.forEach(el => {
        el.classList.add('scroll-trigger');
    });
    
    // Create intersection observer to detect when hero comes into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is in view, trigger animations
                heroAnimateElements.forEach(el => {
                    el.classList.add('in-view');
                });
                // Stop observing once animation is triggered
                observer.unobserve(heroSection);
            }
        });
    }, observerOptions);
    
    observer.observe(heroSection);
}

// ========================================
// STATS ANIMATION
// ========================================
function initStatsAnimation() {
    const statBoxes = document.querySelectorAll('[data-animate]');
    
    if (!statBoxes.length) return;

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger count-up animation for stat numbers
                    const statNumber = entry.target.querySelector('[data-count]');
                    if (statNumber) {
                        const targetCount = parseInt(statNumber.getAttribute('data-count'));
                        animateCount(statNumber, targetCount);
                    }
                    
                    // Trigger star animation
                    const stars = entry.target.querySelectorAll('.animated-star');
                    if (stars.length > 0) {
                        animateStars(stars);
                    }
                }, index * 150); // Stagger animation by 150ms
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statBoxes.forEach(box => observer.observe(box));
}

function animateCount(element, target) {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    
    function updateCount() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = progress * (2 - progress);
        const currentCount = Math.floor(startValue + (target - startValue) * easeOutQuad);
        
        if (target === 50 || target === 100) {
            element.textContent = currentCount + '+';
        } else if (target === 3) {
            element.textContent = currentCount + '+';
        } else if (target === 5) {
            element.textContent = currentCount + ' Star';
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            // Ensure final value is set
            if (target === 50) {
                element.textContent = '50+';
            } else if (target === 100) {
                element.textContent = '100+';
            } else if (target === 3) {
                element.textContent = '3+';
            } else if (target === 5) {
                element.textContent = '5 Star';
            }
        }
    }
    
    requestAnimationFrame(updateCount);
}

function animateStars(stars) {
    const duration = 2000; // 2 seconds total to match count animation
    const delayBetweenStars = duration / stars.length;
    
    stars.forEach((star, index) => {
        setTimeout(() => {
            star.classList.add('show');
        }, index * delayBetweenStars);
    });
}