/* Settings Page Logic */

const logoInput = document.getElementById('logoInput');
const logoName = document.getElementById('logoName');
const deptEmails = document.getElementById('deptEmails');
const addresses = document.getElementById('addresses');
const phones = document.getElementById('phones');
const whats = document.getElementById('whats');
const socials = document.getElementById('socials');
const settingsForm = document.getElementById('settingsForm');
const successModal = document.getElementById('successModal');
const closeSuccess = document.getElementById('closeSuccess');

if (logoInput && logoName) {
    logoInput.addEventListener('change', e => {
        logoName.textContent = e.target.files[0]?.name || 'PNG / JPG / WEBP';
    });
}

function bindRemove() {
    document.querySelectorAll('.remove-row').forEach(btn => {
        btn.onclick = () => btn.closest('.grid').remove();
    });
}

function addRow(containerId, html) {
    const container = document.getElementById(containerId);
    if (container) {
        container.insertAdjacentHTML('beforeend', html);
        bindRemove();
    }
}

const addDeptEmail = document.getElementById('addDeptEmail');
if (addDeptEmail) {
    addDeptEmail.onclick = () => addRow('deptEmails', `
        <div class="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input class="input-field" placeholder="البريد الإلكتروني">
            <input class="input-field" placeholder="القسم">
            <button type="button" class="remove-row rounded-2xl bg-red-100 px-4 text-red-600 hover:bg-red-600 hover:text-white">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `);
}

const addAddress = document.getElementById('addAddress');
if (addAddress) {
    addAddress.onclick = () => addRow('addresses', `
        <div class="grid gap-4 md:grid-cols-[1fr_auto]">
            <input class="input-field" placeholder="العنوان">
            <button type="button" class="remove-row rounded-2xl bg-red-100 px-4 text-red-600 hover:bg-red-600 hover:text-white">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `);
}

const addPhone = document.getElementById('addPhone');
if (addPhone) {
    addPhone.onclick = () => addRow('phones', `
        <div class="grid gap-4 md:grid-cols-[1fr_auto]">
            <input class="input-field" placeholder="رقم الجوال">
            <button type="button" class="remove-row rounded-2xl bg-red-100 px-4 text-red-600 hover:bg-red-600 hover:text-white">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `);
}

const addWhats = document.getElementById('addWhats');
if (addWhats) {
    addWhats.onclick = () => addRow('whats', `
        <div class="grid gap-4 md:grid-cols-[1fr_auto]">
            <input class="input-field" placeholder="واتساب">
            <button type="button" class="remove-row rounded-2xl bg-red-100 px-4 text-red-600 hover:bg-red-600 hover:text-white">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `);
}

const addSocial = document.getElementById('addSocial');
if (addSocial) {
    addSocial.onclick = () => addRow('socials', `
        <div class="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_220px_auto]">
            <input class="input-field" placeholder="الإسم بالعربية">
            <input class="input-field" placeholder="الإسم بالإنجليزية">
            <input class="input-field" placeholder="الموقع">
            <label class="upload-box flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-slate-600">
                <input type="file" class="hidden" accept="image/*">
                <i class="fa-solid fa-cloud-arrow-up text-legalGold"></i>
                <span>اختيار أيقونة</span>
            </label>
            <button type="button" class="remove-row rounded-2xl bg-red-100 px-4 text-red-600 hover:bg-red-600 hover:text-white">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `);
}

if (settingsForm) {
    settingsForm.addEventListener('submit', e => {
        e.preventDefault();
        if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
        }
    });
}

if (closeSuccess) {
    closeSuccess.onclick = () => {
        if (successModal) {
            successModal.classList.add('hidden');
            successModal.classList.remove('flex');
        }
    };
}

bindRemove();
