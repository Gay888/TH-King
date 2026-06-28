document.addEventListener('DOMContentLoaded', () => {
    // ตรวจสอบ login
    const savedUser = localStorage.getItem('isLoggedInUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }

    // แสดงชื่อผู้ใช้
    const userGreet = document.getElementById('userGreet');
    if (userGreet) userGreet.textContent = `สวัสดี, ${savedUser}`;

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('isLoggedInUser');
        window.location.href = 'index.html';
    });

    // Feedback button → ไปหน้า contact.html
    const feedbackBtn = document.getElementById('feedbackNavBtn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            window.location.href = 'contact.html';
        });
    }

    // ===== CART =====
    let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = cart.length;
    }
    updateCartBadge();

    window.addToCart = function(name, price) {
        cart.push({ name, price });
        saveCart();
        updateCartBadge();
        showToast(`เพิ่ม "${name}" ลงตะกร้าแล้ว`);
    };

    function showToast(msg) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position:fixed; bottom:30px; right:30px; background:#2e7d32; color:#fff;
                padding:14px 22px; border-radius:10px; font-size:15px; font-weight:600;
                box-shadow:0 6px 20px rgba(0,0,0,0.2); z-index:9999;
                transition: opacity 0.4s; opacity:0;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
    }

    // Cart modal
    const cartModal = document.getElementById('cartModal');
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });

    function renderCart() {
        const list = document.getElementById('cartItems');
        const totalEl = document.getElementById('cartTotal');
        if (!list) return;

        if (cart.length === 0) {
            list.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart" style="font-size:40px;color:#ddd;display:block;margin-bottom:10px;"></i>ตะกร้าว่างเปล่า</div>';
            totalEl.textContent = '฿ 0';
            return;
        }

        list.innerHTML = cart.map((item, i) => `
            <div class="cart-item">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">฿ ${item.price.toLocaleString()}</span>
                <button class="cart-item-remove" onclick="removeFromCart(${i})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalEl.textContent = `฿ ${total.toLocaleString()}`;
    }

    window.removeFromCart = function(i) {
        cart.splice(i, 1);
        saveCart();
        updateCartBadge();
        renderCart();
    };

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return showToast('กรุณาเพิ่มสินค้าก่อนชำระเงิน');
            cart = [];
            saveCart();
            updateCartBadge();
            if (cartModal) cartModal.classList.remove('active');
            showToast('ขอบคุณสำหรับการสั่งซื้อ! 🎉');
        });
    }

    // ===== STAR RATING (home page feedback section if present) =====
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.dataset.val);
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
        });
        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
        });
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.val);
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
        });
    });

    const submitFb = document.getElementById('submitFeedback');
    if (submitFb) {
        submitFb.addEventListener('click', () => {
            const name = document.getElementById('fb-name')?.value.trim();
            const msg = document.getElementById('fb-message')?.value.trim();
            if (!name || !msg) { showToast('กรุณากรอกชื่อและข้อความ'); return; }
            document.getElementById('fb-name').value = '';
            document.getElementById('fb-email').value = '';
            document.getElementById('fb-topic').value = '';
            document.getElementById('fb-message').value = '';
            selectedRating = 0;
            stars.forEach(s => s.classList.remove('active'));
            const el = document.getElementById('feedbackSuccess');
            if (el) { el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 4000); }
        });
    }
});