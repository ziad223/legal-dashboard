/* Forgot Password Page Logic */

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        if (email) {
            // Mock success
            const btn = forgotForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإرسال...';
                btn.disabled = true;
            }
            
            setTimeout(() => {
                alert('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
                window.location.href = 'login.html';
            }, 1500);
        }
    });
}
