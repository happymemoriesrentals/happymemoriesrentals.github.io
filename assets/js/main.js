// ========================================
// Happy Memories Rentals - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setActiveNavLink();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'rentals.html') {
        initRentalTotals();
        initDeliveryToggle();
        initCityDistanceEstimate();
        handleFormSubmission('bookingForm', 'https://formspree.io/f/xjggwkja');
    }

    if (currentPage === 'contact.html') {
        initContactDeliveryToggle();
        handleFormSubmission('contactForm', 'https://formspree.io/f/xjggwkja');
    }

    if (currentPage === 'index.html') {
        initStatsAnimation();
    }

    initSmoothScroll();
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
        'input[name="deliveryOption"]'
    );
    const section = document.getElementById('deliverySection');
    const addressInput = document.getElementById('eventAddress');
    const deliveryFeeNotice = document.getElementById('deliveryFeeNotice');

    if (!radios.length || !section) return;

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isDelivery = radio.value === 'yes' && radio.checked;
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
// HELPER: EXTRACT SELECTED INDIVIDUAL ITEMS
// ========================================
function getSelectedIndividualItems() {
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

    const selectedItems = [];
    let total = 0;

    Object.keys(prices).forEach(id => {
        const input = document.getElementById(id);
        const qty = parseInt(input?.value || 0);
        if (qty > 0) {
            const itemTotal = qty * prices[id];
            total += itemTotal;
            selectedItems.push({
                name: itemNames[id],
                qty: qty,
                price: prices[id],
                total: itemTotal
            });
        }
    });

    return { items: selectedItems, total: total };
}

// ========================================
// HELPER: EXTRACT SELECTED PACKAGES
// ========================================
function getSelectedPackages() {
    const superheroCheckbox = document.getElementById('superhero-package');
    const princessCheckbox = document.getElementById('princess-package');
    
    const selectedPackages = [];
    let total = 0;
    
    if (superheroCheckbox && superheroCheckbox.checked) {
        const price = parseFloat(superheroCheckbox.value);
        total += price;
        selectedPackages.push({
            name: 'Superhero Party Package',
            price: price
        });
    }
    
    if (princessCheckbox && princessCheckbox.checked) {
        const price = parseFloat(princessCheckbox.value);
        total += price;
        selectedPackages.push({
            name: 'Princess Party Package',
            price: price
        });
    }
    
    return { packages: selectedPackages, total: total };
}

// ========================================
// HELPER: FORMAT SELECTIONS FOR EMAIL
// ========================================
function formatSelectionsForEmail() {
    const individualItemsSection = document.getElementById('individualItemsSection');
    const packagesSection = document.getElementById('packagesSection');
    
    let itemsText = '';
    let packagesText = '';
    let orderTotal = 0;
    
    // Check if individual items section is visible
    if (individualItemsSection && individualItemsSection.style.display !== 'none') {
        const { items, total } = getSelectedIndividualItems();
        orderTotal = total;
        
        if (items.length > 0) {
            itemsText = items.map(item => 
                `${item.name} - Qty: ${item.qty} @ $${item.price.toFixed(2)} each = $${item.total.toFixed(2)}`
            ).join('\n');
        } else {
            itemsText = 'No individual items selected';
        }
    }
    
    // Check if packages section is visible
    if (packagesSection && packagesSection.style.display !== 'none') {
        const { packages, total } = getSelectedPackages();
        orderTotal = total;
        
        if (packages.length > 0) {
            packagesText = packages.map(pkg => 
                `${pkg.name} - $${pkg.price.toFixed(2)}`
            ).join('\n');
        } else {
            packagesText = 'No packages selected';
        }
    }
    
    return {
        itemsText: itemsText || 'N/A',
        packagesText: packagesText || 'N/A',
        orderTotal: orderTotal
    };
}

// ========================================
// HELPER: POPULATE HIDDEN FORM FIELDS
// ========================================
function populateHiddenBookingFields(form) {
    const { itemsText, packagesText, orderTotal } = formatSelectionsForEmail();
    
    // Remove any existing hidden booking fields to avoid duplicates
    const existingFields = form.querySelectorAll('[data-booking-field]');
    existingFields.forEach(field => field.remove());
    
    // Create and append hidden fields with booking data
    const fieldsToAdd = [
        { name: 'Selected_Individual_Items', value: itemsText },
        { name: 'Selected_Packages', value: packagesText },
        { name: 'Order_Total', value: `$${orderTotal.toFixed(2)}` }
    ];
    
    fieldsToAdd.forEach(fieldData => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = fieldData.name;
        input.value = fieldData.value;
        input.setAttribute('data-booking-field', 'true');
        form.appendChild(input);
    });
}

// ========================================
// FORMSPREE HANDLER
// ========================================
function handleFormSubmission(formId, formspreeUrl) {
    const form = document.getElementById(formId);
    if (!form) return;

    const messageDiv = document.getElementById('formMessage');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Populate hidden fields with current booking selections
        if (formId === 'bookingForm') {
            populateHiddenBookingFields(form);
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error();

            messageDiv.textContent =
                "✅ Thank you! Your booking request was sent.";
            messageDiv.className = "form-message success show";
            
            // Scroll message into view
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            form.reset();
        } catch {
            messageDiv.textContent =
                "❌ Something went wrong. Please try again.";
            messageDiv.className = "form-message error show";
            
            // Scroll message into view
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Booking Request';
        }
    });
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
                }, index * 150); // Stagger animation by 150ms
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statBoxes.forEach(box => observer.observe(box));
}
