/* Court Fees Page Logic */

let fees = [
  { id: 1, type: 'رسوم قضائية', ar: 'رسوم دعوى عامة', en: 'General Case Fees', value: '500', notes: '' },
  { id: 2, type: 'أتعاب خبير', ar: 'أتعاب معاينة عقار', en: 'Property Inspection Fees', value: '1500', notes: '' },
  { id: 3, type: 'مصاريف إدارية', ar: 'تصديق مستندات', en: 'Document Attestation', value: '100', notes: '' }
];

let editingId = null;
let deletingId = null;

const feeCards = document.getElementById('feeCards');
const rowsCount = document.getElementById('rowsCount');
const tableSearch = document.getElementById('tableSearch');
const topSearch = document.getElementById('topSearch');

function renderRows() {
  if (!feeCards) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();

  const filtered = fees.filter(item => {
    const text = `${item.id} ${item.ar} ${item.en} ${item.type}`.toLowerCase();
    return !term || text.includes(term);
  });

  feeCards.innerHTML = filtered.map(item => `
    <article class="cost-row px-6 py-4 transition hover:bg-slate-50" data-id="${item.id}">
      <div class="grid grid-cols-12 items-center gap-4 text-center">
        <div class="col-span-1 text-lg font-black text-slate-900">${item.id}</div>

        <div class="col-span-3">
          <span class="type-chip">${item.type}</span>
        </div>

        <div class="col-span-3">
          <p class="font-black text-slate-900">${item.ar}</p>
        </div>

        <div class="col-span-2">
          <p class="font-black text-emerald-600">${item.value} ر.س</p>
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${fees.length} تكاليف`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openFeeModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const feeModal = document.getElementById('feeModal');
const feeModalTitle = document.getElementById('feeModalTitle');
const closeFeeModal = document.getElementById('closeFeeModal');
const cancelFeeModal = document.getElementById('cancelFeeModal');
const saveFeeBtn = document.getElementById('saveFeeBtn');

const formType = document.getElementById('formType');
const formAr = document.getElementById('formAr');
const formEn = document.getElementById('formEn');
const formValue = document.getElementById('formValue');
const formNotes = document.getElementById('formNotes');

function openFeeModal(id = null) {
  if (!feeModal) return;
  editingId = id;
  const item = fees.find(f => f.id === id);

  if (feeModalTitle) feeModalTitle.textContent = id ? 'تعديل التكلفة القضائية' : 'إضافة تكلفة قضائية';

  if (formType) formType.value = item?.type || 'رسوم قضائية';
  if (formAr) formAr.value = item?.ar || '';
  if (formEn) formEn.value = item?.en || '';
  if (formValue) formValue.value = item?.value || '';
  if (formNotes) formNotes.value = item?.notes || '';

  feeModal.classList.remove('hidden');
  feeModal.classList.add('flex');
}

function closeFeeModalFn() {
  if (!feeModal) return;
  feeModal.classList.add('hidden');
  feeModal.classList.remove('flex');
  editingId = null;
}

if (saveFeeBtn) {
    saveFeeBtn.addEventListener('click', () => {
      const payload = {
        type: formType.value,
        ar: formAr.value.trim() || 'تكلفة جديدة',
        en: formEn.value.trim() || 'New Fee',
        value: formValue.value.trim() || '0',
        notes: formNotes.value.trim()
      };

      if (editingId) {
        const index = fees.findIndex(f => f.id === editingId);
        fees[index] = { ...fees[index], ...payload };
      } else {
        fees.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closeFeeModalFn();
      renderRows();
    });
}

if (closeFeeModal) closeFeeModal.addEventListener('click', closeFeeModalFn);
if (cancelFeeModal) cancelFeeModal.addEventListener('click', closeFeeModalFn);
if (feeModal) {
    feeModal.addEventListener('click', e => { if (e.target === feeModal) closeFeeModalFn(); });
}

const openFeeModalBtn = document.getElementById('openFeeModalBtn');
if (openFeeModalBtn) openFeeModalBtn.addEventListener('click', () => openFeeModal());

const openFeeModalBtn2 = document.getElementById('openFeeModalBtn2');
if (openFeeModalBtn2) openFeeModalBtn2.addEventListener('click', () => openFeeModal());

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
      fees = fees.filter(f => f.id !== deletingId);
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
