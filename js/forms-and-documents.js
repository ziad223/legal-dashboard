/* Forms and Documents Page Logic */

const typeText = {
  contract: 'عقد',
  form: 'نموذج',
  letter: 'خطاب',
  case: 'مستند قضية',
  admin: 'إداري'
};

const statusMap = {
  active: { text: 'ظاهر', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  draft: { text: 'مسودة', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  archived: { text: 'مؤرشف', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

let docs = [
  { id: 1, title: 'نموذج عقد استشارة قانونية', type: 'contract', department: 'العقود', version: 'v1.0', date: '2026-05-12', status: 'active', notes: 'نموذج يستخدم لإنشاء عقود الاستشارات القانونية.' },
  { id: 2, title: 'خطاب تفويض محامي', type: 'letter', department: 'القضايا', version: 'v2.1', date: '2026-05-10', status: 'active', notes: 'خطاب تفويض رسمي لاستخدامه داخل ملفات القضايا.' },
  { id: 3, title: 'نموذج بيانات عميل جديد', type: 'form', department: 'العملاء', version: 'v1.3', date: '2026-05-08', status: 'draft', notes: 'نموذج إدخال بيانات العميل قبل إنشاء العقد.' },
  { id: 4, title: 'مستند متابعة قضية', type: 'case', department: 'إدارة القضايا', version: 'v1.0', date: '2026-04-29', status: 'archived', notes: 'مستند قديم لمتابعة مراحل القضية.' }
];

let editingId = null;
let deletingId = null;

const docsTable = document.getElementById('docsTable');

const rowsCount = document.getElementById('rowsCount');
const topSearch = document.getElementById('globalSearchInput');
const tableSearch = document.getElementById('tableSearch');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');

function updateStats() {
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statDraft = document.getElementById('statDraft');
  const statArchived = document.getElementById('statArchived');

  if (statTotal) statTotal.textContent = docs.length;
  if (statActive) statActive.textContent = docs.filter(d => d.status === 'active').length;
  if (statDraft) statDraft.textContent = docs.filter(d => d.status === 'draft').length;
  if (statArchived) statArchived.textContent = docs.filter(d => d.status === 'archived').length;
}

function renderRows() {
  if (!docsTable) return;

  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();
  const status = statusFilter?.value || 'all';
  const type = typeFilter?.value || 'all';

  const filtered = docs.filter(item => {
    const text = `${item.title} ${item.department} ${item.version} ${item.notes} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
      (status === 'all' || item.status === status) &&
      (type === 'all' || item.type === type);
  });

  if (docsTable) {
    docsTable.innerHTML = filtered.map(item => {
      const st = statusMap[item.status];
      return `
        <tr class="doc-row" data-id="${item.id}">
          <td class="px-4 py-3 font-black text-legalGold">#${item.id}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="grid h-9 w-9 place-items-center rounded-2xl bg-legalGold/15 font-black text-legalGold">
                <i class="fa-solid fa-file-lines"></i>
              </div>
              <div>
                <p class="font-black text-slate-900">${item.title}</p>
                <p class="max-w-[260px] truncate text-[10px] font-bold text-slate-400">${item.notes}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 font-bold text-slate-500">${typeText[item.type]}</td>
          <td class="px-4 py-3 font-bold text-slate-600">${item.department}</td>
          <td class="px-4 py-3 font-bold text-slate-500">${item.version}</td>
          <td class="px-4 py-3 font-bold text-slate-500">${item.date}</td>
          <td class="px-4 py-3">
            <span class="status-badge ${st.cls}">
              <span class="h-2 w-2 rounded-full ${st.dot}"></span>
              ${st.text}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-center gap-2">
              <button class="view-btn grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700 transition hover:bg-emerald-600 hover:text-white" data-id="${item.id}"><i class="fa-solid fa-eye"></i></button>
              <button class="edit-btn grid h-8 w-8 place-items-center rounded-xl bg-legalGold/15 text-legalGold transition hover:bg-legalGold hover:text-white" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
              <button class="download-btn grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white" data-id="${item.id}"><i class="fa-solid fa-download"></i></button>
              <button class="delete-btn grid h-8 w-8 place-items-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }



  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${docs.length} مستند`;
  updateStats();
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id))));
  document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openDocModal(Number(btn.dataset.id))));
  document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id))));
  document.querySelectorAll('.download-btn').forEach(btn => btn.addEventListener('click', () => alert('تم تجهيز المستند للتحميل')));
}

const docModal = document.getElementById('docModal');
const docModalTitle = document.getElementById('docModalTitle');
const closeDocModal = document.getElementById('closeDocModal');
const cancelDocModal = document.getElementById('cancelDocModal');
const saveDocBtn = document.getElementById('saveDocBtn');

const formTitle = document.getElementById('formTitle');
const formDepartment = document.getElementById('formDepartment');
const formVersion = document.getElementById('formVersion');
const formDate = document.getElementById('formDate');
const formType = document.getElementById('formType');
const formStatus = document.getElementById('formStatus');
const formNotes = document.getElementById('formNotes');

function openDocModal(id = null) {
  if (!docModal) return;
  editingId = id;
  const item = docs.find(d => d.id === id);

  if (docModalTitle) docModalTitle.textContent = id ? 'تعديل المستند' : 'إضافة مستند';

  if (formTitle) formTitle.value = item?.title || '';
  if (formDepartment) formDepartment.value = item?.department || '';
  if (formVersion) formVersion.value = item?.version || '';
  if (formDate) formDate.value = item?.date || '';
  if (formType) formType.value = item?.type || 'form';
  if (formStatus) formStatus.value = item?.status || 'active';
  if (formNotes) formNotes.value = item?.notes || '';

  docModal.classList.remove('hidden');
  docModal.classList.add('flex');
}

function closeDocModalFn() {
  if (!docModal) return;
  docModal.classList.add('hidden');
  docModal.classList.remove('flex');
  editingId = null;
}

if (saveDocBtn) {
  saveDocBtn.addEventListener('click', () => {
    const payload = {
      title: formTitle.value.trim() || 'مستند جديد',
      type: formType.value,
      department: formDepartment.value.trim() || 'الإدارة',
      version: formVersion.value.trim() || 'v1.0',
      date: formDate.value || '2026-05-12',
      status: formStatus.value,
      notes: formNotes.value.trim() || 'لا توجد ملاحظات'
    };

    if (editingId) {
      const index = docs.findIndex(d => d.id === editingId);
      docs[index] = { ...docs[index], ...payload };
    } else {
      docs.unshift({ id: Date.now().toString().slice(-4), ...payload });
    }

    closeDocModalFn();
    renderRows();
  });
}

if (closeDocModal) closeDocModal.addEventListener('click', closeDocModalFn);
if (cancelDocModal) cancelDocModal.addEventListener('click', closeDocModalFn);
if (docModal) {
  docModal.addEventListener('click', e => { if (e.target === docModal) closeDocModalFn(); });
}

const openDocModalBtn = document.getElementById('openDocModalBtn');
if (openDocModalBtn) openDocModalBtn.addEventListener('click', () => openDocModal());



const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  if (!viewModal || !viewModalContent) return;
  const item = docs.find(d => d.id === id);
  if (!item) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم المستند:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>العنوان:</b> ${item.title}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>النوع:</b> ${typeText[item.type]}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>القسم:</b> ${item.department}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الإصدار:</b> ${item.version}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>تاريخ الإضافة:</b> ${item.date}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الحالة:</b> ${statusMap[item.status].text}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>ملاحظات:</b> ${item.notes}</div>
  `;

  viewModal.classList.remove('hidden');
  viewModal.classList.add('flex');
}

function closeViewModalFn() {
  if (!viewModal) return;
  viewModal.classList.add('hidden');
  viewModal.classList.remove('flex');
}

if (closeViewModal) closeViewModal.addEventListener('click', closeViewModalFn);
if (viewModal) {
  viewModal.addEventListener('click', e => { if (e.target === viewModal) closeViewModalFn(); });
}

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
    docs = docs.filter(d => d.id !== deletingId);
    closeDeleteModal();
    renderRows();
  });
}

[tableSearch, topSearch, statusFilter, typeFilter].forEach(el => {
  if (el) {
    el.addEventListener('input', renderRows);
    el.addEventListener('change', renderRows);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderRows();
});

if (document.getElementById('exportBtn')) {
  document.getElementById('exportBtn').addEventListener('click', () => alert('تم تجهيز ملف Excel بنجاح'));
}
