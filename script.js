// --- DATA ---
const products = [
    { id: 1, name: "Classic Cola", desc: "Signature cola with a perfect fizz.", price: "$2.99", category: "cola", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop", nutrition: { cal: 140, sugar: "35g", carbs: "35g" } },
    { id: 2, name: "Lime Splash", desc: "Zesty lime with a mint finish.", price: "$2.99", category: "fruit", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", nutrition: { cal: 120, sugar: "30g", carbs: "32g" } },
    { id: 3, name: "Berry Burst", desc: "Summer berries blend.", price: "$3.49", category: "fruit", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600&auto=format&fit=crop", nutrition: { cal: 130, sugar: "28g", carbs: "30g" } },
    { id: 4, name: "Ginger Fizz", desc: "Spicy ginger, zero sugar.", price: "$2.99", category: "zero", image: "https://images.unsplash.com/photo-1588612509166-51ee6df325df?q=80&w=600&auto=format&fit=crop", nutrition: { cal: 5, sugar: "0g", carbs: "2g" } },
    { id: 5, name: "Peach Paradise", desc: "Juicy peach sparkling water.", price: "$2.99", category: "fruit", image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600&auto=format&fit=crop", nutrition: { cal: 110, sugar: "25g", carbs: "26g" } },
    { id: 6, name: "Mint Mojito", desc: "Zero sugar mint refreshment.", price: "$2.99", category: "zero", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop", nutrition: { cal: 0, sugar: "0g", carbs: "0g" } }
];

const galleryImages = [
    "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1543093956-62ce9d0e74f4?q=80&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=400&auto=format&fit=crop"
];

// --- APP STATE ---
let cartCount = 0;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    renderProducts('all');
    renderGallery();
    loadCart();
    updateCartDisplay();
    setupEventListeners();
    setupMobileMenu();
    setupSmoothScroll();
});

// --- PARALLAX LOGIC ---
function initParallax() {
    const icons = document.querySelectorAll('.parallax-icon');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        icons.forEach((icon, index) => {
            const speed = (index + 1) * 0.1;
            icon.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// --- RENDER PRODUCTS ---
function renderProducts(filter) {
    const grid = document.querySelector('.products-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <div class="price">${product.price}</div>
                <button class="buy-btn" onclick="openModal(${product.id})">Learn More & Buy</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- RENDER GALLERY ---
function renderGallery() {
    const grid = document.querySelector('.gallery-grid');
    if(!grid) return;
    
    galleryImages.forEach(src => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${src}" loading="lazy" onclick="openLightbox('${src}')" alt="Gallery Image">`;
        grid.appendChild(div);
    });
}

// --- MODAL LOGIC ---
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Fill Data
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-price').innerText = product.price;
    
    // Fill Nutrition
    const facts = document.querySelectorAll('.fact strong');
    if(facts.length >= 3) {
        facts[0].innerText = product.nutrition.cal;
        facts[1].innerText = product.nutrition.sugar;
        facts[2].innerText = product.nutrition.carbs;
    }

    // Setup Add to Cart Button
    const btn = document.getElementById('add-to-cart-btn');
    btn.onclick = () => addToCart(product);
    btn.innerHTML = '<span>Add to Cart</span>';
    btn.style.background = "var(--text-main)";
    btn.style.color = "var(--dark-bg)";

    // Show Modal
    document.getElementById('product-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// --- CART LOGIC ---
function loadCart() {
    const saved = localStorage.getItem('refreshaCart');
    if (saved) {
        cartCount = parseInt(saved);
    }
}

function saveCart() {
    localStorage.setItem('refreshaCart', cartCount);
}

function addToCart(product) {
    cartCount++;
    saveCart();
    updateCartDisplay();
    
    // Button Feedback
    const btn = document.getElementById('add-to-cart-btn');
    btn.innerHTML = '<span>✓ Added!</span>';
    btn.style.background = "var(--secondary)";
    btn.style.color = "white";
    
    // Create floating animation
    createFloatingIcon(product.image);
    
    setTimeout(() => {
        closeModal();
    }, 800);
}

function createFloatingIcon(imageSrc) {
    const icon = document.createElement('div');
    icon.style.position = 'fixed';
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.borderRadius = '50%';
    icon.style.overflow = 'hidden';
    icon.style.zIndex = '10000';
    icon.style.pointerEvents = 'none';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    icon.appendChild(img);
    
    const modalImg = document.getElementById('modal-img');
    const rect = modalImg.getBoundingClientRect();
    icon.style.left = rect.left + rect.width / 2 - 25 + 'px';
    icon.style.top = rect.top + rect.height / 2 - 25 + 'px';
    
    document.body.appendChild(icon);
    
    const cartBtn = document.getElementById('cart-btn');
    const cartRect = cartBtn.getBoundingClientRect();
    
    setTimeout(() => {
        icon.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        icon.style.left = cartRect.left + cartRect.width / 2 - 25 + 'px';
        icon.style.top = cartRect.top + cartRect.height / 2 - 25 + 'px';
        icon.style.transform = 'scale(0.2)';
        icon.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        document.body.removeChild(icon);
    }, 900);
}

function updateCartDisplay() {
    const el = document.getElementById('cart-count');
    if(el) {
        el.innerText = cartCount;
        el.classList.add('cart-bump');
        setTimeout(() => el.classList.remove('cart-bump'), 300);
    }
}

// --- LIGHTBOX LOGIC ---
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if(lb && img) {
        img.src = src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if(lb) {
        lb.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// --- MOBILE MENU ---
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    if(menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// --- SMOOTH SCROLL ---
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Close Modal
    const closeMod = document.querySelector('.close-modal');
    if(closeMod) closeMod.onclick = closeModal;
    
    const pModal = document.getElementById('product-modal');
    if(pModal) {
        pModal.onclick = (e) => {
            if(e.target.id === 'product-modal') closeModal();
        };
    }

    // Close Lightbox
    const closeLb = document.querySelector('.close-lightbox');
    if(closeLb) {
        closeLb.onclick = closeLightbox;
    }
    
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        lightbox.onclick = (e) => {
            if(e.target.id === 'lightbox') closeLightbox();
        };
    }

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.dataset.filter);
        });
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeLightbox();
        }
    });
}

function closeModal() {
    const pModal = document.getElementById('product-modal');
    if(pModal) {
        pModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}