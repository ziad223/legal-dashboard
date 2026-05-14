/* Sub-Classification Page Logic */

let subCategories = [
  { id: 1, ar: 'تعويض', en: 'Compensation', notes: '' },
  { id: 2, ar: 'فسخ عقد', en: 'Contract Termination', notes: '' },
  { id: 3, ar: 'مطالبة مالية', en: 'Financial Claim', notes: '' },
  { id: 4, ar: 'نزاع عمالي', en: 'Labor Dispute', notes: '' },
  { id: 5, ar: 'قضية جنائية', en: 'Criminal Case', notes: '' },
  { id: 6, ar: 'تصفية تركة', en: 'Estate Liquidation', notes: '' },
  { id: 7, ar: 'إفلاس', en: 'Bankruptcy', notes: '' }
];

let editingId = null;
let deletingId = null;

const subCards = document.getElementById('subCards');
const rowsCount = document.getElementById('rowsCount');
const tableSearch = document.getElementById('tableSearch');
const topSearch = document.getElementById('topSearch');

function renderRows() {
  if (!subCards) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();

  const filtered = subCategories.filter(item => {
    const text = `${item.id} ${item.ar} ${item.en}`.toLowerCase();
    return !term || text.includes(term);
  });

  subCards.innerHTML = filtered.map(item => `
    <article class="sub-row px-6 py-4 transition hover:bg-slate-50" data-id="${item.id}">
      <div class="grid grid-cols-12 items-center gap-4 text-center">
        <div class="col-span-1 text-lg font-black text-slate-900">${item.id}</div>

        <div class="col-span-4">
          <p class="font-black text-slate-900">${item.ar}</p>
        </div>

        <div class="col-span-4">
          <p class="font-black text-slate-900" dir="ltr">${item.en}</p>
        </div>

        <div class="col-span-3">
          <div class="flex items-center justify-center gap-2">
            <button class="delete-btn icon-btn text-red-600 hover:bg-red-600 hover:text-white" data-id="${item.id}">
              <i class="fa-solid fa-trash"></i>
            </button>

            <button class="edit-btn icon-btn text-legalGold hover:bg-legalGold hover:text-white" data-id="${item.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${subCategories.length} تصنيفات فرعية`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openSubModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const subModal = document.getElementById('subModal');
const subModalTitle = document.getElementById('subModalTitle');
const closeSubModal = document.getElementById('closeSubModal');
const cancelSubModal = document.getElementById('cancelSubModal');
const saveSubBtn = document.getElementById('saveSubBtn');

const formAr = document.getElementById('formAr');
const formEn = document.getElementById('formEn');
const formNotes = document.getElementById('formNotes');

function openSubModal(id = null) {
  if (!subModal) return;
  editingId = id;
  const item = subCategories.find(s => s.id === id);

  if (subModalTitle) subModalTitle.textContent = id ? 'تعديل التصنيف الفرعي' : 'إضافة تصنيف فرعي';

  if (formAr) formAr.value = item?.ar || '';
  if (formEn) formEn.value = item?.en || '';
  if (formNotes) formNotes.value = item?.notes || '';

  subModal.classList.remove('hidden');
  subModal.classList.add('flex');
}

function closeSubModalFn() {
  if (!subModal) return;
  subModal.classList.add('hidden');
  subModal.classList.remove('flex');
  editingId = null;
}

if (saveSubBtn) {
    saveSubBtn.addEventListener('click', () => {
      const payload = {
        ar: formAr.value.trim() || 'تصنيف فرعي جديد',
        en: formEn.value.trim() || 'New Sub-Category',
        notes: formNotes.value.trim()
      };

      if (editingId) {
        const index = subCategories.findIndex(s => s.id === editingId);
        subCategories[index] = { ...subCategories[index], ...payload };
      } else {
        subCategories.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closeSubModalFn();
      renderRows();
    });
}

if (closeSubModal) closeSubModal.addEventListener('click', closeSubModalFn);
if (cancelSubModal) cancelSubModal.addEventListener('click', closeSubModalFn);
if (subModal) {
    subModal.addEventListener('click', e => { if (e.target === subModal) closeSubModalFn(); });
}

const openSubModalBtn = document.getElementById('openSubModalBtn');
if (openSubModalBtn) openSubModalBtn.addEventListener('click', () => openSubModal());

const openSubModalBtn2 = document.getElementById('openSubModalBtn2');
if (openSubModalBtn2) openSubModalBtn2.addEventListener('click', () => openSubModal());

const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

function openDeleteModal(id) {
  if (!deleteModal) return;
  deletingId = id;
  deleteModal.classList.remove('hidden');
  deleteModal.classList.add('flex');
}

function closeDeleteModal() {
  if (!deleteModal) return;
  deleteModal.classList.add('hidden');
  deleteModal.classList.remove('flex');
  deletingId = null;
}

if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
if (deleteModal) {
    deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      subCategories = subCategories.filter(s => s.id !== deletingId);
      closeDeleteModal();
      renderRows();
    });
}

[tableSearch, topSearch].forEach(el => {
  if (el) el.addEventListener('input', renderRows);
});

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) exportBtn.addEventListener('click', () => alert('تم تجهيز ملف Excel بنجاح'));

document.addEventListener('DOMContentLoaded', () => {
    renderRows();
});
