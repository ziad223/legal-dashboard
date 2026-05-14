/* Login Page Logic */

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();
        
        if (email && password) {
            // Check credentials (admin@admin.com / 123456)
            if (email === 'admin@admin.com' && password === '123456') {
                // Mock success
                localStorage.setItem('legal_dashboard_logged_in', 'true');
                localStorage.setItem('currentUser', JSON.stringify({ name: 'Super Admin', email }));
                
                // Change button state
                const btn = loginForm.querySelector('button[type="submit"]');
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحقق...';
                    btn.disabled = true;
                }

                // Show Swal Success
                Swal.fire({
                    title: 'تم تسجيل الدخول بنجاح',
                    text: 'مرحباً بك في لوحة التحكم القانونية',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-[30px]',
                        confirmButton: 'rounded-xl'
                    }
                }).then(() => {
                    window.location.href = '../index.html';
                });

            } else {
                // Show Swal Error
                Swal.fire({
                    title: 'خطأ في الدخول',
                    text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
                    icon: 'error',
                    confirmButtonText: 'حاول مرة أخرى',
                    confirmButtonColor: '#41684e',
                    customClass: {
                        popup: 'rounded-[30px]',
                        confirmButton: 'rounded-xl font-bold'
                    }
                });
            }
        }
    });
}
