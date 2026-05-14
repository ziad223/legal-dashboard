/* Case Classification Page Logic */

let categories = [
  { id: 1, ar: 'التنفيذ', en: 'Implementation', notes: '' },
  { id: 2, ar: 'دعاوى المحاكم العامة', en: 'Public court cases', notes: '' },
  { id: 3, ar: 'دعوة المحاكم العامة', en: 'دعوة المحاكم العامة', notes: '' },
  { id: 4, ar: 'دعاوى المحاكم العامة', en: 'General Court Cases', notes: '' },
  { id: 5, ar: 'دعاوى الأحوال الشخصية', en: 'Personal Status Cases', notes: '' },
  { id: 6, ar: 'دعاوى المحاكم التجارية', en: 'Commercial Court Cases', notes: '' },
  { id: 7, ar: 'دعاوى المحاكم العمالية', en: 'Labor Court Cases', notes: '' }
];

let editingId = null;
let deletingId = null;

const categoryCards = document.getElementById('categoryCards');
const rowsCount = document.getElementById('rowsCount');
const tableSearch = document.getElementById('tableSearch');
const topSearch = document.getElementById('topSearch');

function renderRows() {
  if (!categoryCards) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();

  const filtered = categories.filter(item => {
    const text = `${item.id} ${item.ar} ${item.en}`.toLowerCase();
    return !term || text.includes(term);
  });

  categoryCards.innerHTML = filtered.map(item => `
    <article class="category-row px-6 py-4 transition hover:bg-slate-50" data-id="${item.id}">
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${categories.length} تصنيفات`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openCategoryModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const categoryModal = document.getElementById('categoryModal');
const categoryModalTitle = document.getElementById('categoryModalTitle');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const cancelCategoryModal = document.getElementById('cancelCategoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');

const formAr = document.getElementById('formAr');
const formEn = document.getElementById('formEn');
const formNotes = document.getElementById('formNotes');

function openCategoryModal(id = null) {
  if (!categoryModal) return;
  editingId = id;
  const item = categories.find(c => c.id === id);

  if (categoryModalTitle) categoryModalTitle.textContent = id ? 'تعديل تصنيف القضية' : 'إضافة تصنيف قضية';

  if (formAr) formAr.value = item?.ar || '';
  if (formEn) formEn.value = item?.en || '';
  if (formNotes) formNotes.value = item?.notes || '';

  categoryModal.classList.remove('hidden');
  categoryModal.classList.add('flex');
}

function closeCategoryModalFn() {
  if (!categoryModal) return;
  categoryModal.classList.add('hidden');
  categoryModal.classList.remove('flex');
  editingId = null;
}

if (saveCategoryBtn) {
    saveCategoryBtn.addEventListener('click', () => {
      const payload = {
        ar: formAr.value.trim() || 'تصنيف جديد',
        en: formEn.value.trim() || 'New Category',
        notes: formNotes.value.trim()
      };

      if (editingId) {
        const index = categories.findIndex(c => c.id === editingId);
        categories[index] = { ...categories[index], ...payload };
      } else {
        categories.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closeCategoryModalFn();
      renderRows();
    });
}

if (closeCategoryModal) closeCategoryModal.addEventListener('click', closeCategoryModalFn);
if (cancelCategoryModal) cancelCategoryModal.addEventListener('click', closeCategoryModalFn);
if (categoryModal) {
    categoryModal.addEventListener('click', e => { if (e.target === categoryModal) closeCategoryModalFn(); });
}

const openCategoryModalBtn = document.getElementById('openCategoryModalBtn');
if (openCategoryModalBtn) openCategoryModalBtn.addEventListener('click', () => openCategoryModal());

const openCategoryModalBtn2 = document.getElementById('openCategoryModalBtn2');
if (openCategoryModalBtn2) openCategoryModalBtn2.addEventListener('click', () => openCategoryModal());

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
      categories = categories.filter(c => c.id !== deletingId);
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
