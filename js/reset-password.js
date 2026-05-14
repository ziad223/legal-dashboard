/* Reset Password Page Logic */

const resetForm = document.getElementById('resetForm');
if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                alert('كلمتا المرور غير متطابقتين');
                return;
            }
            
            // Mock success
            const btn = resetForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الحفظ...';
                btn.disabled = true;
            }
            
            setTimeout(() => {
                alert('تم تغيير كلمة المرور بنجاح');
                window.location.href = 'login.html';
            }, 1500);
        }
    });
}
