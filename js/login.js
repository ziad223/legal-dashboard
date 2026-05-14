/* Login Page Logic */

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMe = document.getElementById('rememberMe');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput?.value;
        const password = passwordInput?.value;
        
        if (email && password) {
            // Check if user exists in localStorage (mock auth)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user || (email === 'admin@legal.com' && password === 'admin123')) {
                // Mock success
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user || { name: 'Super Admin', email }));
                
                // Show success animation or toast
                const btn = loginForm.querySelector('button[type="submit"]');
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحميل...';
                    btn.disabled = true;
                }
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
        }
    });
}

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
}
