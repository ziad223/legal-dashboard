/* Shared Sidebar and Mobile Menu Logic - Improved */

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('overlay');

    if (sidebar && menuBtn && overlay) {
        // Toggle Sidebar
        const toggleSidebar = (forceClose = false) => {
            const isOpen = !sidebar.classList.contains('translate-x-full');

            if (isOpen || forceClose) {
                // Close
                sidebar.classList.add('translate-x-full');
                sidebar.classList.remove('translate-x-0');
                overlay.classList.add('hidden');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            } else {
                // Open
                sidebar.classList.remove('translate-x-full');
                sidebar.classList.add('translate-x-0');
                overlay.classList.remove('hidden');
                menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        overlay.addEventListener('click', () => toggleSidebar(true));

        // Prevent clicks inside sidebar from closing it via overlay
        sidebar.addEventListener('click', (e) => e.stopPropagation());
    }

    // Accordion Logic
    document.querySelectorAll('.accordion-btn').forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.nextElementSibling;
            const chevron = this.querySelector('.chevron');
            
            // Toggle current
            const isHidden = content.classList.contains('hidden');
            
            // Close others
            document.querySelectorAll('.accordion-content').forEach((item) => item.classList.add('hidden'));
            document.querySelectorAll('.chevron').forEach((item) => item.classList.remove('-rotate-90'));

            if (isHidden) {
                content.classList.remove('hidden');
                if (chevron) chevron.classList.add('-rotate-90');
            }
        });
    });
});
