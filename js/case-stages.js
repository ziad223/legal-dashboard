/* Case Stages Page Logic */

let stages = [
  { id: 1, ar: 'الابتدائية', en: 'Elementary', notes: '' },
  { id: 2, ar: 'ما قبل الدعوى', en: 'Pre-suit', notes: '' },
  { id: 3, ar: 'قيد الدعوى', en: 'Case pending', notes: '' },
  { id: 4, ar: 'ما قبل الدعوى', en: 'Pre-Litigation', notes: '' },
  { id: 5, ar: 'قيد الدعوى', en: 'Case Filing', notes: '' },
  { id: 6, ar: 'التبليغ', en: 'Service of Process', notes: '' },
  { id: 7, ar: 'المرافعة', en: 'Hearings', notes: '' }
];

let editingId = null;
let deletingId = null;

const stageCards = document.getElementById('stageCards');
const rowsCount = document.getElementById('rowsCount');
const tableSearch = document.getElementById('tableSearch');
const topSearch = document.getElementById('topSearch');

function renderRows() {
  if (!stageCards) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();

  const filtered = stages.filter(item => {
    const text = `${item.id} ${item.ar} ${item.en}`.toLowerCase();
    return !term || text.includes(term);
  });

  stageCards.innerHTML = filtered.map(item => `
    <article class="stage-row px-6 py-4 transition hover:bg-slate-50" data-id="${item.id}">
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${stages.length} مراحل`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openStageModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const stageModal = document.getElementById('stageModal');
const stageModalTitle = document.getElementById('stageModalTitle');
const closeStageModal = document.getElementById('closeStageModal');
const cancelStageModal = document.getElementById('cancelStageModal');
const saveStageBtn = document.getElementById('saveStageBtn');

const formAr = document.getElementById('formAr');
const formEn = document.getElementById('formEn');
const formNotes = document.getElementById('formNotes');

function openStageModal(id = null) {
  if (!stageModal) return;
  editingId = id;
  const item = stages.find(s => s.id === id);

  if (stageModalTitle) stageModalTitle.textContent = id ? 'تعديل مرحلة القضية' : 'إضافة مرحلة قضية';

  if (formAr) formAr.value = item?.ar || '';
  if (formEn) formEn.value = item?.en || '';
  if (formNotes) formNotes.value = item?.notes || '';

  stageModal.classList.remove('hidden');
  stageModal.classList.add('flex');
}

function closeStageModalFn() {
  if (!stageModal) return;
  stageModal.classList.add('hidden');
  stageModal.classList.remove('flex');
  editingId = null;
}

if (saveStageBtn) {
    saveStageBtn.addEventListener('click', () => {
      const payload = {
        ar: formAr.value.trim() || 'مرحلة جديدة',
        en: formEn.value.trim() || 'New Stage',
        notes: formNotes.value.trim()
      };

      if (editingId) {
        const index = stages.findIndex(s => s.id === editingId);
        stages[index] = { ...stages[index], ...payload };
      } else {
        stages.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closeStageModalFn();
      renderRows();
    });
}

if (closeStageModal) closeStageModal.addEventListener('click', closeStageModalFn);
if (cancelStageModal) cancelStageModal.addEventListener('click', closeStageModalFn);
if (stageModal) {
    stageModal.addEventListener('click', e => { if (e.target === stageModal) closeStageModalFn(); });
}

const openStageModalBtn = document.getElementById('openStageModalBtn');
if (openStageModalBtn) openStageModalBtn.addEventListener('click', () => openStageModal());

const openStageModalBtn2 = document.getElementById('openStageModalBtn2');
if (openStageModalBtn2) openStageModalBtn2.addEventListener('click', () => openStageModal());

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
      stages = stages.filter(s => s.id !== deletingId);
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
