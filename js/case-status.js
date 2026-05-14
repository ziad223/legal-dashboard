/* Case Status Page Logic */

let statuses = [
  { id: 1, ar: 'نشطة', en: 'Active', notes: '' },
  { id: 2, ar: 'مغلقة', en: 'Closed', notes: '' },
  { id: 3, ar: 'بانتظار جلسة', en: 'Hearing Pending', notes: '' },
  { id: 4, ar: 'متأخرة', en: 'Late', notes: '' },
  { id: 5, ar: 'منتهية', en: 'Finished', notes: '' },
  { id: 6, ar: 'بانتظار مستندات', en: 'Waiting for Documents', notes: '' }
];

let editingId = null;
let deletingId = null;

const statusCards = document.getElementById('statusCards');
const rowsCount = document.getElementById('rowsCount');
const tableSearch = document.getElementById('tableSearch');
const topSearch = document.getElementById('topSearch');

function renderRows() {
  if (!statusCards) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();

  const filtered = statuses.filter(item => {
    const text = `${item.id} ${item.ar} ${item.en}`.toLowerCase();
    return !term || text.includes(term);
  });

  statusCards.innerHTML = filtered.map(item => `
    <article class="status-row px-6 py-4 transition hover:bg-slate-50" data-id="${item.id}">
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${statuses.length} حالات`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openStatusModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const statusModal = document.getElementById('statusModal');
const statusModalTitle = document.getElementById('statusModalTitle');
const closeStatusModal = document.getElementById('closeStatusModal');
const cancelStatusModal = document.getElementById('cancelStatusModal');
const saveStatusBtn = document.getElementById('saveStatusBtn');

const formAr = document.getElementById('formAr');
const formEn = document.getElementById('formEn');
const formNotes = document.getElementById('formNotes');

function openStatusModal(id = null) {
  if (!statusModal) return;
  editingId = id;
  const item = statuses.find(s => s.id === id);

  if (statusModalTitle) statusModalTitle.textContent = id ? 'تعديل حالة القضية' : 'إضافة حالة قضية';

  if (formAr) formAr.value = item?.ar || '';
  if (formEn) formEn.value = item?.en || '';
  if (formNotes) formNotes.value = item?.notes || '';

  statusModal.classList.remove('hidden');
  statusModal.classList.add('flex');
}

function closeStatusModalFn() {
  if (!statusModal) return;
  statusModal.classList.add('hidden');
  statusModal.classList.remove('flex');
  editingId = null;
}

if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', () => {
      const payload = {
        ar: formAr.value.trim() || 'حالة جديدة',
        en: formEn.value.trim() || 'New Status',
        notes: formNotes.value.trim()
      };

      if (editingId) {
        const index = statuses.findIndex(s => s.id === editingId);
        statuses[index] = { ...statuses[index], ...payload };
      } else {
        statuses.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closeStatusModalFn();
      renderRows();
    });
}

if (closeStatusModal) closeStatusModal.addEventListener('click', closeStatusModalFn);
if (cancelStatusModal) cancelStatusModal.addEventListener('click', closeStatusModalFn);
if (statusModal) {
    statusModal.addEventListener('click', e => { if (e.target === statusModal) closeStatusModalFn(); });
}

const openStatusModalBtn = document.getElementById('openStatusModalBtn');
if (openStatusModalBtn) openStatusModalBtn.addEventListener('click', () => openStatusModal());

const openStatusModalBtn2 = document.getElementById('openStatusModalBtn2');
if (openStatusModalBtn2) openStatusModalBtn2.addEventListener('click', () => openStatusModal());

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
      statuses = statuses.filter(s => s.id !== deletingId);
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
