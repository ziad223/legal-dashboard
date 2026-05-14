/* Customers and Contracts Page Logic */

const typeText = {
  individual: 'فرد',
  company: 'شركة',
  vip: 'عميل مميز'
};

const statusMap = {
  active: { text: 'نشط', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { text: 'قيد المتابعة', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  expired: { text: 'منتهي', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

let clients = [
  { id: 20, name: 'aya aya', email: 'phone.local@0900000001', phone: '+966 55 123 4567', contract: 'CNT-2026-001', type: 'individual', status: 'active', notes: 'عميل نشط ولديه عقد استشارة سنوي.' },
  { id: 22, name: 'nour nour', email: 'phone.local@0900000003', phone: '+966 54 800 2211', contract: 'CNT-2026-003', type: 'vip', status: 'active', notes: 'عميل مميز يحتاج متابعة دورية.' },
  { id: 26, name: 'دخالة خالد', email: 'phone.local@0900010000', phone: '+966 50 444 9988', contract: 'CNT-2026-008', type: 'company', status: 'pending', notes: 'بانتظار توقيع ملحق العقد.' },
  { id: 31, name: 'شركة النور التجارية', email: 'info@alnour.com', phone: '+966 56 202 3030', contract: 'CNT-2025-110', type: 'company', status: 'expired', notes: 'العقد منتهي ويحتاج تجديد.' }
];

let editingId = null;
let deletingId = null;

const clientsTable = document.getElementById('clientsTable');
const rowsCount = document.getElementById('rowsCount');
const topSearch = document.getElementById('globalSearchInput');
const tableSearch = document.getElementById('tableSearch');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');

const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statContracts = document.getElementById('statContracts');
const statPending = document.getElementById('statPending');

function updateStats() {
  if (statTotal) statTotal.textContent = clients.length;
  if (statActive) statActive.textContent = clients.filter(c => c.status === 'active').length;
  if (statContracts) statContracts.textContent = clients.filter(c => c.status !== 'expired').length;
  if (statPending) statPending.textContent = clients.filter(c => c.status === 'pending').length;
}

function renderRows() {
  if (!clientsTable) return;
  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();
  const status = statusFilter?.value || 'all';
  const type = typeFilter?.value || 'all';

  const filtered = clients.filter(item => {
    const text = `${item.name} ${item.email} ${item.phone} ${item.contract} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
      (status === 'all' || item.status === status) &&
      (type === 'all' || item.type === type);
  });

  clientsTable.innerHTML = filtered.map(item => {
    const st = statusMap[item.status];
    const initial = item.name.trim().charAt(0) || 'ع';

    return `
      <tr class="table-row" data-id="${item.id}">
        <td class="px-4 py-3 font-black text-legalGold">#${item.id}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="grid h-9 w-9 place-items-center rounded-2xl bg-legalGold/15 font-black text-legalGold">${initial}</div>
            <div>
              <p class="font-black text-slate-900">${item.name}</p>
              <p class="text-[10px] font-bold text-slate-400">${item.phone}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 font-bold text-slate-500">${item.email}</td>
        <td class="px-4 py-3 font-bold text-slate-600">${item.contract}</td>
        <td class="px-4 py-3 font-bold text-slate-500">${typeText[item.type]}</td>
        <td class="px-4 py-3">
          <span class="status-badge ${st.cls}">
            <span class="h-2 w-2 rounded-full ${st.dot}"></span>
            ${st.text}
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${clients.length} عملاء`;
  updateStats();
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openClientModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const clientModal = document.getElementById('clientModal');
const clientModalTitle = document.getElementById('clientModalTitle');
const closeClientModal = document.getElementById('closeClientModal');
const cancelClientModal = document.getElementById('cancelClientModal');
const saveClientBtn = document.getElementById('saveClientBtn');

const formName = document.getElementById('formName');
const formEmail = document.getElementById('formEmail');
const formPhone = document.getElementById('formPhone');
const formContract = document.getElementById('formContract');
const formType = document.getElementById('formType');
const formStatus = document.getElementById('formStatus');
const formNotes = document.getElementById('formNotes');

function openClientModal(id = null) {
  if (!clientModal) return;
  editingId = id;
  const item = clients.find(c => c.id === id);

  if (clientModalTitle) clientModalTitle.textContent = id ? 'تعديل العميل' : 'إضافة عميل';

  if (formName) formName.value = item?.name || '';
  if (formEmail) formEmail.value = item?.email || '';
  if (formPhone) formPhone.value = item?.phone || '';
  if (formContract) formContract.value = item?.contract || '';
  if (formType) formType.value = item?.type || 'individual';
  if (formStatus) formStatus.value = item?.status || 'active';
  if (formNotes) formNotes.value = item?.notes || '';

  clientModal.classList.remove('hidden');
  clientModal.classList.add('flex');
}

function closeClientModalFn() {
  if (!clientModal) return;
  clientModal.classList.add('hidden');
  clientModal.classList.remove('flex');
  editingId = null;
}

if (saveClientBtn) {
  saveClientBtn.addEventListener('click', () => {
    const payload = {
      name: formName.value.trim() || 'عميل جديد',
      email: formEmail.value.trim() || 'client@example.com',
      phone: formPhone.value.trim() || '+966',
      contract: formContract.value.trim() || 'CNT-NEW',
      type: formType.value,
      status: formStatus.value,
      notes: formNotes.value.trim() || 'لا توجد ملاحظات'
    };

    if (editingId) {
      const index = clients.findIndex(c => c.id === editingId);
      clients[index] = { ...clients[index], ...payload };
    } else {
      clients.unshift({ id: Date.now().toString().slice(-4), ...payload });
    }

    closeClientModalFn();
    renderRows();
  });
}

if (closeClientModal) closeClientModal.addEventListener('click', closeClientModalFn);
if (cancelClientModal) cancelClientModal.addEventListener('click', closeClientModalFn);
if (clientModal) {
  clientModal.addEventListener('click', e => { if (e.target === clientModal) closeClientModalFn(); });
}

const openClientModalBtn = document.getElementById('openClientModalBtn');
if (openClientModalBtn) openClientModalBtn.addEventListener('click', () => openClientModal());

const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  if (!viewModal || !viewModalContent) return;
  const item = clients.find(c => c.id === id);
  if (!item) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم العميل:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الإسم:</b> ${item.name}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>البريد:</b> ${item.email}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الهاتف:</b> ${item.phone}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم العقد:</b> ${item.contract}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>نوع العميل:</b> ${typeText[item.type]}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الحالة:</b> ${statusMap[item.status].text}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الملاحظات:</b> ${item.notes}</div>
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
    clients = clients.filter(c => c.id !== deletingId);
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

if (document.getElementById('printBtn')) {
  document.getElementById('printBtn').addEventListener('click', () => window.print());
}
