/* Forgot Password Page Logic */

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        
        if (email) {
            // Mock success
            const btn = forgotForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإرسال...';
                btn.disabled = true;
            }
            
            setTimeout(() => {
                Swal.fire({
                    title: 'تم الإرسال',
                    text: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
                    icon: 'success',
                    confirmButtonText: 'حسناً',
                    confirmButtonColor: '#41684e',
                    customClass: {
                        popup: 'rounded-[30px]',
                        confirmButton: 'rounded-xl font-bold'
                    }
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }, 1500);
        }
    });
}
