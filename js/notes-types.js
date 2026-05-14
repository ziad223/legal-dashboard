/* Notes Types Page Logic */

let notesTypes = [
  { id: 1, ar: 'مذكرة دفاع', en: 'Defense Note', notes: '' },
  { id: 2, ar: 'مذكرة ادعاء', en: 'Claim Note', notes: '' },
  { id: 3, ar: 'مذكرة جوابية', en: 'Response Note', notes: '' },
  { id: 4, ar: 'مذكرة ختامية', en: 'Closing Note', notes: '' },
  { id: 5, ar: 'مذكرة استئناف', en: 'Appeal Note', notes: '' }
];

let editingId = null;
let deletingId = null;

const notesCards = document.getElementById('notesCards');
const rowsCount = document.getElementById('rowsCount');
const tableSearch = document.getElementById('tableSearch');
const topSearch = document.getElementById('topSearch');

function renderRows() {
  if (!notesCards) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();

  const filtered = notesTypes.filter(item => {
    const text = `${item.id} ${item.ar} ${item.en}`.toLowerCase();
    return !term || text.includes(term);
  });

  notesCards.innerHTML = filtered.map(item => `
    <article class="notes-row px-6 py-4 transition hover:bg-slate-50" data-id="${item.id}">
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${notesTypes.length} أنواع`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openNotesModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const notesModal = document.getElementById('notesModal');
const notesModalTitle = document.getElementById('notesModalTitle');
const closeNotesModal = document.getElementById('closeNotesModal');
const cancelNotesModal = document.getElementById('cancelNotesModal');
const saveNotesBtn = document.getElementById('saveNotesBtn');

const formAr = document.getElementById('formAr');
const formEn = document.getElementById('formEn');
const formNotes = document.getElementById('formNotes');

function openNotesModal(id = null) {
  if (!notesModal) return;
  editingId = id;
  const item = notesTypes.find(s => s.id === id);

  if (notesModalTitle) notesModalTitle.textContent = id ? 'تعديل نوع المذكرة' : 'إضافة نوع مذكرة';

  if (formAr) formAr.value = item?.ar || '';
  if (formEn) formEn.value = item?.en || '';
  if (formNotes) formNotes.value = item?.notes || '';

  notesModal.classList.remove('hidden');
  notesModal.classList.add('flex');
}

function closeNotesModalFn() {
  if (!notesModal) return;
  notesModal.classList.add('hidden');
  notesModal.classList.remove('flex');
  editingId = null;
}

if (saveNotesBtn) {
    saveNotesBtn.addEventListener('click', () => {
      const payload = {
        ar: formAr.value.trim() || 'نوع جديد',
        en: formEn.value.trim() || 'New Type',
        notes: formNotes.value.trim()
      };

      if (editingId) {
        const index = notesTypes.findIndex(s => s.id === editingId);
        notesTypes[index] = { ...notesTypes[index], ...payload };
      } else {
        notesTypes.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closeNotesModalFn();
      renderRows();
    });
}

if (closeNotesModal) closeNotesModal.addEventListener('click', closeNotesModalFn);
if (cancelNotesModal) cancelNotesModal.addEventListener('click', closeNotesModalFn);
if (notesModal) {
    notesModal.addEventListener('click', e => { if (e.target === notesModal) closeNotesModalFn(); });
}

const openNotesModalBtn = document.getElementById('openNotesModalBtn');
if (openNotesModalBtn) openNotesModalBtn.addEventListener('click', () => openNotesModal());

const openNotesModalBtn2 = document.getElementById('openNotesModalBtn2');
if (openNotesModalBtn2) openNotesModalBtn2.addEventListener('click', () => openNotesModal());

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
      notesTypes = notesTypes.filter(s => s.id !== deletingId);
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
