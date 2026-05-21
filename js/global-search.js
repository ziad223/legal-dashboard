document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;

    // Detect if we are in a subdirectory
    const isSubDir = window.location.pathname.includes('/dropdownListsPages/');
    const pathPrefix = isSubDir ? '../' : '';
    const dropdownPrefix = isSubDir ? '' : 'dropdownListsPages/';

    const searchData = [
        { title: 'الرئيسية', link: pathPrefix + 'index.html', icon: 'fa-house', category: 'عام' },
        { title: 'طلبات الإستشارة', link: pathPrefix + 'consultation-requests.html', icon: 'fa-cube', category: 'خدمات' },
        { title: 'التقارير والإحصائيات', link: pathPrefix + 'reports-and-statistics.html', icon: 'fa-chart-line', category: 'بيانات' },
        { title: 'إدارة القضايا', link: pathPrefix + 'case-management.html', icon: 'fa-scale-balanced', category: 'قضايا' },
        { title: 'العملاء والعقود', link: pathPrefix + 'customers-and-contracts.html', icon: 'fa-handshake', category: 'عملاء' },
        { title: 'المهام والتنظيم', link: pathPrefix + 'tasks-and-organization.html', icon: 'fa-rectangle-list', category: 'إدارة' },
        { title: 'مكتبة الجودة', link: pathPrefix + 'forms-and-documents.html', icon: 'fa-layer-group', category: 'مستندات' },
        { title: 'الصلاحيات', link: pathPrefix + 'permissions.html', icon: 'fa-shield-halved', category: 'موظفين' },
        { title: 'الموظفين', link: pathPrefix + 'employees.html', icon: 'fa-users', category: 'موظفين' },
        { title: 'الإعدادات العامة', link: pathPrefix + 'settings.html', icon: 'fa-gear', category: 'إعدادات' },
        { title: 'حالة القضية', link: pathPrefix + dropdownPrefix + 'case-status.html', icon: 'fa-circle-info', category: 'قوائم' },
        { title: 'تصنيف القضية', link: pathPrefix + dropdownPrefix + 'case-classification.html', icon: 'fa-tags', category: 'قوائم' },
        { title: 'التصنيف الفرعي', link: pathPrefix + dropdownPrefix + 'sub-classification.html', icon: 'fa-tag', category: 'قوائم' },
        { title: 'مراحل القضية', link: pathPrefix + dropdownPrefix + 'case-stages.html', icon: 'fa-timeline', category: 'قوائم' },
        { title: 'أنواع المذكرات', link: pathPrefix + dropdownPrefix + 'notes-types.html', icon: 'fa-file-lines', category: 'قوائم' },
        { title: 'التكاليف القضائية', link: pathPrefix + dropdownPrefix + 'court-fees.html', icon: 'fa-coins', category: 'قوائم' }
    ];

    // Create Results Container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'absolute top-full left-0 right-0 z-[100] mt-2 hidden max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 transform origin-top scale-95 opacity-0 scroll-hide';
    resultsContainer.id = 'searchResults';
    
    // Add custom style for appearance
    const style = document.createElement('style');
    style.textContent = `
        #searchResults.active {
            display: block;
            transform: scale(1);
            opacity: 1;
        }
        .search-item-active {
            background-color: rgba(208, 173, 98, 0.1) !important;
            border-color: rgba(208, 173, 98, 0.3) !important;
        }
    `;
    document.head.appendChild(style);

    // Wrap input's parent to ensure it's relative
    const parent = searchInput.parentElement;
    parent.classList.add('relative');
    parent.appendChild(resultsContainer);

    function showResults(filtered) {
        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div class="p-8 text-center">
                    <div class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-50 text-slate-300">
                        <i class="fa-solid fa-magnifying-glass text-xl"></i>
                    </div>
                    <p class="text-sm font-black text-slate-400">لا توجد نتائج مطابقة لبحثك</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="mb-2 px-3 pt-2">
                    <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">نتائج البحث (${filtered.length})</p>
                </div>
            ` + filtered.map((item, index) => `
                <a href="${item.link}" class="flex items-center gap-4 rounded-xl border border-transparent p-3 transition-all duration-200 hover:bg-slate-50 group">
                    <div class="grid h-10 w-10 place-items-center rounded-xl bg-legalGold/10 text-legalGold transition-all duration-300 group-hover:scale-110 group-hover:bg-legalGold group-hover:text-white group-hover:shadow-lg group-hover:shadow-legalGold/20">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="flex-1 text-right">
                        <p class="text-sm font-black text-slate-900 transition-colors group-hover:text-legalGoldDark">${item.title}</p>
                        <p class="text-[10px] font-bold text-slate-400">${item.category}</p>
                    </div>
                    <div class="grid h-6 w-6 place-items-center rounded-lg bg-slate-50 text-[10px] text-slate-300 transition-all duration-300 group-hover:bg-legalGold/10 group-hover:text-legalGold">
                        <i class="fa-solid fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
                    </div>
                </a>
            `).join('');
        }
        resultsContainer.classList.remove('hidden');
        setTimeout(() => resultsContainer.classList.add('active'), 10);
    }

    function hideResults() {
        resultsContainer.classList.remove('active');
        setTimeout(() => {
            if (!resultsContainer.classList.contains('active')) {
                resultsContainer.classList.add('hidden');
            }
        }, 300);
    }

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();
        if (value.length < 1) {
            hideResults();
            return;
        }

        const filtered = searchData.filter(item => 
            item.title.toLowerCase().includes(value) || 
            item.category.toLowerCase().includes(value)
        );
        showResults(filtered);
    });

    searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim().length > 0) {
            const value = e.target.value.trim().toLowerCase();
            const filtered = searchData.filter(item => 
                item.title.toLowerCase().includes(value) || 
                item.category.toLowerCase().includes(value)
            );
            showResults(filtered);
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!parent.contains(e.target)) {
            hideResults();
        }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = resultsContainer.querySelectorAll('a');
        if (items.length === 0) return;

        let activeIndex = -1;
        items.forEach((item, i) => {
            if (item.classList.contains('bg-slate-100')) activeIndex = i;
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            updateActiveItem(items, activeIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            updateActiveItem(items, activeIndex);
        } else if (e.key === 'Enter' && activeIndex > -1) {
            e.preventDefault();
            items[activeIndex].click();
        }
    });

    function updateActiveItem(items, index) {
        items.forEach(item => item.classList.remove('bg-slate-100'));
        items[index].classList.add('bg-slate-100');
        items[index].scrollIntoView({ block: 'nearest' });
    }
});
