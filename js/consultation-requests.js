/* Consultation Requests Page Logic */

let requests = [
  { id: 1001, client: 'أحمد محمود', email: 'ahmed@example.com', type: 'commercial', typeText: 'استشارة تجارية', date: '2026-05-09', status: 'new', details: 'طلب مراجعة عقد تجاري قبل التوقيع.' },
  { id: 1002, client: 'سارة عبدالله', email: 'sara@example.com', type: 'family', typeText: 'أحوال شخصية', date: '2026-05-08', status: 'review', details: 'استشارة بخصوص إجراءات أحوال شخصية.' },
  { id: 1003, client: 'محمد سالم', email: 'mohamed@example.com', type: 'labor', typeText: 'قضية عمالية', date: '2026-05-07', status: 'done', details: 'استشارة عن مستحقات نهاية الخدمة.' },
  { id: 1004, client: 'نورة خالد', email: 'noura@example.com', type: 'realestate', typeText: 'استشارة عقارية', date: '2026-05-05', status: 'late', details: 'نزاع عقاري بخصوص عقد إيجار.' }
];

let editingId = null;
let deletingId = null;

const statusMap = {
  new: { text: 'جديد', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  review: { text: 'قيد المراجعة', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  done: { text: 'تم الرد', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  late: { text: 'متأخر', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

const typeTextMap = {
  commercial: 'استشارة تجارية',
  family: 'أحوال شخصية',
  labor: 'قضية عمالية',
  realestate: 'استشارة عقارية'
};

const tableSearch = document.getElementById('tableSearch');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');
const rowsCount = document.getElementById('rowsCount');
const requestsTable = document.getElementById('requestsTable');

function renderRows() {
  if (!requestsTable) return;
  const term = ((tableSearch?.value || searchInput?.value || '')).toLowerCase().trim();
  const status = statusFilter?.value || 'all';
  const type = typeFilter?.value || 'all';

  const filtered = requests.filter(item => {
    const text = `${item.client} ${item.email} ${item.typeText} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
      (status === 'all' || item.status === status) &&
      (type === 'all' || item.type === type);
  });

  requestsTable.innerHTML = filtered.map(item => {
    const statusData = statusMap[item.status];
    const initial = item.client.trim().charAt(0) || 'ع';

    return `
      <tr class="table-row" data-id="${item.id}">
        <td class="px-4 py-3 font-black text-legalGold">#${item.id}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="grid h-9 w-9 place-items-center rounded-2xl bg-legalGold/15 font-black text-legalGold">${initial}</div>
            <div>
              <p class="font-black text-slate-900">${item.client}</p>
              <p class="text-[10px] font-bold text-slate-400">${item.email}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 font-bold text-slate-600">${item.typeText}</td>
        <td class="px-4 py-3 font-bold text-slate-500">${item.date}</td>
        <td class="px-4 py-3">
          <span class="status-badge ${statusData.cls}">
            <span class="h-2 w-2 rounded-full ${statusData.dot}"></span>
            ${statusData.text}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex justify-center gap-2">
            <button class="view-btn grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white" data-id="${item.id}"><i class="fa-solid fa-eye"></i></button>
            <button class="edit-btn grid h-8 w-8 place-items-center rounded-xl bg-legalGold/15 text-legalGold transition hover:bg-legalGold hover:text-white" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn grid h-8 w-8 place-items-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${requests.length} طلبات`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openRequestModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const requestModal = document.getElementById('requestModal');
const requestModalTitle = document.getElementById('requestModalTitle');
const closeRequestModal = document.getElementById('closeRequestModal');
const cancelRequestModal = document.getElementById('cancelRequestModal');
const saveRequestBtn = document.getElementById('saveRequestBtn');

const formClient = document.getElementById('formClient');
const formEmail = document.getElementById('formEmail');
const formPhone = document.getElementById('formPhone');
const formType = document.getElementById('formType');
const formStatus = document.getElementById('formStatus');
const formDate = document.getElementById('formDate');
const formDetails = document.getElementById('formDetails');

function openRequestModal(id = null) {
  if (!requestModal) return;
  editingId = id;
  const item = requests.find(r => r.id === id);

  if (requestModalTitle) requestModalTitle.textContent = id ? 'تعديل طلب الإستشارة' : 'إضافة طلب إستشارة';

  if (formClient) formClient.value = item?.client || '';
  if (formEmail) formEmail.value = item?.email || '';
  if (formPhone) formPhone.value = item?.phone || '';
  if (formType) formType.value = item?.type || 'commercial';
  if (formStatus) formStatus.value = item?.status || 'new';
  if (formDate) formDate.value = item?.date || new Date().toISOString().slice(0, 10);
  if (formDetails) formDetails.value = item?.details || '';

  requestModal.classList.remove('hidden');
  requestModal.classList.add('flex');
}

function closeRequestModalFn() {
  if (!requestModal) return;
  requestModal.classList.add('hidden');
  requestModal.classList.remove('flex');
  editingId = null;
}

if (saveRequestBtn) {
  saveRequestBtn.addEventListener('click', () => {
    const payload = {
      client: formClient.value.trim() || 'عميل جديد',
      email: formEmail.value.trim() || 'client@example.com',
      type: formType.value,
      typeText: typeTextMap[formType.value],
      status: formStatus.value,
      date: formDate.value || new Date().toISOString().slice(0, 10),
      details: formDetails.value.trim() || 'لا توجد تفاصيل'
    };

    if (editingId) {
      const index = requests.findIndex(r => r.id === editingId);
      requests[index] = { ...requests[index], ...payload };
    } else {
      requests.unshift({ id: Date.now().toString().slice(-4), ...payload });
    }

    closeRequestModalFn();
    renderRows();
  });
}

if (closeRequestModal) closeRequestModal.addEventListener('click', closeRequestModalFn);
if (cancelRequestModal) cancelRequestModal.addEventListener('click', closeRequestModalFn);
if (requestModal) {
  requestModal.addEventListener('click', e => { if (e.target === requestModal) closeRequestModalFn(); });
}

const openModalBtn = document.getElementById('openModalBtn');
if (openModalBtn) openModalBtn.addEventListener('click', () => openRequestModal());

const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  if (!viewModal || !viewModalContent) return;
  const item = requests.find(r => r.id === id);
  if (!item) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم الطلب:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>اسم العميل:</b> ${item.client}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>البريد:</b> ${item.email}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الهاتف:</b> ${item.phone || 'N/A'}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>نوع الطلب:</b> ${item.typeText}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الحالة:</b> ${statusMap[item.status].text}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>التفاصيل:</b> ${item.details}</div>
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
    requests = requests.filter(r => r.id !== deletingId);
    closeDeleteModal();
    renderRows();
  });
}

[tableSearch, searchInput, statusFilter, typeFilter].forEach(el => {
  if (el) {
    el.addEventListener('input', renderRows);
    el.addEventListener('change', renderRows);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderRows();
});
