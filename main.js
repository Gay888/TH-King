document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const openLoginBtn = document.getElementById('openLoginBtn');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const authContainer = document.getElementById('authContainer');

    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            loginForm.reset();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            loginForm.reset();
        }
    });

    function updateAuthUI() {
        const savedUser = localStorage.getItem('isLoggedInUser');

        if (savedUser) {
            // ถ้าเข้าสู่ระบบแล้ว ให้ redirect ไป home.html ทันที
            window.location.href = 'home.html';
        } else {
            authContainer.innerHTML = `
                <button class="btn btn-login" id="openLoginBtn">Login</button>
                <button class="btn btn-signin" id="openSigninBtn">Sign in</button>
            `;

            document.getElementById('openLoginBtn').addEventListener('click', () => {
                loginModal.classList.add('active');
            });

            document.getElementById('openSigninBtn').addEventListener('click', () => {
                loginModal.classList.add('active');
            });
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameValue = document.getElementById('username').value.trim();

        if (usernameValue) {
            localStorage.setItem('isLoggedInUser', usernameValue);
            loginModal.classList.remove('active');
            loginForm.reset();
            // Redirect ไปหน้า home.html ทันที
            window.location.href = 'home.html';
        }
    });

    updateAuthUI();

    const initialSigninBtn = document.querySelector('.btn-signin');
    if (initialSigninBtn) {
        initialSigninBtn.setAttribute('id', 'openSigninBtn');
        initialSigninBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
});