/* Employees Page Logic */

const roleText = {
  admin: 'المشرف',
  lawyer: 'محامي',
  none: '--'
};

const statusMap = {
  active: { text: 'نشط', cls: 'bg-green-500 text-white' },
  unverified: { text: 'غير موثق', cls: 'bg-blue-500 text-white' },
  disabled: { text: 'موقوف', cls: 'bg-red-500 text-white' }
};

let employees = [
  { id: 1, name: 'super admin', email: 'admin@ecit.com.sa', phone: '+966 500 000 001', role: 'admin', status: 'active', notes: 'مدير النظام الرئيسي.' },
  { id: 2, name: 'test test', email: '', phone: '+966 500 000 002', role: 'lawyer', status: 'active', notes: 'موظف تجريبي.' },
  { id: 19, name: 'eman eman', email: 'phone.local@0900000000', phone: '+966 500 000 019', role: 'lawyer', status: 'active', notes: 'محامي داخل النظام.' },
  { id: 21, name: 'nady nady', email: 'phone.local@0900000002', phone: '+966 500 000 021', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.' },
  { id: 23, name: 'mohammed mohammed', email: 'phone.local@0900000004', phone: '+966 500 000 023', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.' },
  { id: 24, name: 'bebo bebo', email: 'phone.local@0900000006', phone: '+966 500 000 024', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.' },
  { id: 25, name: 'emem emem', email: 'phone.local@90000000', phone: '+966 500 000 025', role: 'none', status: 'unverified', notes: 'حساب غير موثق.' }
];

let editingId = null;
let deletingId = null;

const employeeCards = document.getElementById('employeeCards');
const rowsCount = document.getElementById('rowsCount');
const topSearch = document.getElementById('topSearch');
const tableSearch = document.getElementById('tableSearch');
const statusFilter = document.getElementById('statusFilter');
const roleFilter = document.getElementById('roleFilter');

function updateStats() {
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statLawyers = document.getElementById('statLawyers');
  const statUnverified = document.getElementById('statUnverified');

  if (statTotal) statTotal.textContent = employees.length;
  if (statActive) statActive.textContent = employees.filter(e => e.status === 'active').length;
  if (statLawyers) statLawyers.textContent = employees.filter(e => e.role === 'lawyer').length;
  if (statUnverified) statUnverified.textContent = employees.filter(e => e.status === 'unverified').length;
}

function renderRows() {
  if (!employeeCards) return;

  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();
  const status = statusFilter?.value || 'all';
  const role = roleFilter?.value || 'all';

  const filtered = employees.filter(item => {
    const text = `${item.name} ${item.email} ${item.phone} ${roleText[item.role]} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
      (status === 'all' || item.status === status) &&
      (role === 'all' || item.role === role);
  });

  employeeCards.innerHTML = filtered.map(item => {
    const st = statusMap[item.status];

    return `
      <article class="employee-row px-6 py-7" data-id="${item.id}">
        <div class="grid grid-cols-12 items-center gap-4 text-center">
          <div class="col-span-1 text-lg font-black text-slate-900">${item.id}</div>

          <div class="col-span-2">
            <p class="font-black text-slate-900">${item.name}</p>
          </div>

          <div class="col-span-3">
            <p class="font-bold text-slate-400">${item.email || '-'}</p>
          </div>

          <div class="col-span-2">
            <span class="role-chip">
              <i class="fa-solid fa-pen text-legalGold"></i>
              ${roleText[item.role]}
            </span>
          </div>

          <div class="col-span-2">
            <span class="status-badge ${st.cls}">${st.text}</span>
          </div>

          <div class="col-span-2">
            <div class="flex items-center justify-center gap-2">
              <button class="delete-btn icon-btn text-red-600 hover:bg-red-600 hover:text-white" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
              </button>

              <button class="edit-btn icon-btn text-legalGold hover:bg-legalGold hover:text-white" data-id="${item.id}">
                <i class="fa-solid fa-pen"></i>
              </button>

              <button class="view-btn icon-btn text-legalGreen hover:bg-legalGreen hover:text-white" data-id="${item.id}">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${employees.length} موظفين`;
  updateStats();
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEmployeeModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const employeeModal = document.getElementById('employeeModal');
const employeeModalTitle = document.getElementById('employeeModalTitle');
const closeEmployeeModal = document.getElementById('closeEmployeeModal');
const cancelEmployeeModal = document.getElementById('cancelEmployeeModal');
const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');

const formName = document.getElementById('formName');
const formEmail = document.getElementById('formEmail');
const formPhone = document.getElementById('formPhone');
const formPassword = document.getElementById('formPassword');
const formRole = document.getElementById('formRole');
const formStatus = document.getElementById('formStatus');
const formNotes = document.getElementById('formNotes');

function openEmployeeModal(id = null) {
  if (!employeeModal) return;
  editingId = id;
  const item = employees.find(e => e.id === id);

  if (employeeModalTitle) employeeModalTitle.textContent = id ? 'تعديل الموظف' : 'إضافة موظف';

  if (formName) formName.value = item?.name || '';
  if (formEmail) formEmail.value = item?.email || '';
  if (formPhone) formPhone.value = item?.phone || '';
  if (formPassword) formPassword.value = '';
  if (formRole) formRole.value = item?.role || 'none';
  if (formStatus) formStatus.value = item?.status || 'active';
  if (formNotes) formNotes.value = item?.notes || '';

  employeeModal.classList.remove('hidden');
  employeeModal.classList.add('flex');
}

function closeEmployeeModalFn() {
  if (!employeeModal) return;
  employeeModal.classList.add('hidden');
  employeeModal.classList.remove('flex');
  editingId = null;
}

if (saveEmployeeBtn) {
  saveEmployeeBtn.addEventListener('click', () => {
    const payload = {
      name: formName.value.trim() || 'موظف جديد',
      email: formEmail.value.trim() || '',
      phone: formPhone.value.trim() || '+966',
      role: formRole.value,
      status: formStatus.value,
      notes: formNotes.value.trim() || 'لا توجد ملاحظات'
    };

    if (editingId) {
      const index = employees.findIndex(e => e.id === editingId);
      employees[index] = { ...employees[index], ...payload };
    } else {
      employees.unshift({ id: Date.now().toString().slice(-4), ...payload });
    }

    closeEmployeeModalFn();
    renderRows();
  });
}

if (closeEmployeeModal) closeEmployeeModal.addEventListener('click', closeEmployeeModalFn);
if (cancelEmployeeModal) cancelEmployeeModal.addEventListener('click', closeEmployeeModalFn);
if (employeeModal) {
  employeeModal.addEventListener('click', e => { if (e.target === employeeModal) closeEmployeeModalFn(); });
}

const openEmployeeModalBtn = document.getElementById('openEmployeeModalBtn');
if (openEmployeeModalBtn) openEmployeeModalBtn.addEventListener('click', () => openEmployeeModal());

const openEmployeeModalBtn2 = document.getElementById('openEmployeeModalBtn2');
if (openEmployeeModalBtn2) openEmployeeModalBtn2.addEventListener('click', () => openEmployeeModal());

const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  const item = employees.find(e => e.id === id);
  if (!item || !viewModalContent) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم الموظف:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الإسم:</b> ${item.name}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>البريد الإلكتروني:</b> ${item.email || '-'}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الهاتف:</b> ${item.phone}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الصلاحية:</b> ${roleText[item.role]}</div>
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
    employees = employees.filter(e => e.id !== deletingId);
    closeDeleteModal();
    renderRows();
  });
}

[tableSearch, topSearch, statusFilter, roleFilter].forEach(el => {
  if (el) {
    el.addEventListener('input', renderRows);
    el.addEventListener('change', renderRows);
  }
});

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) exportBtn.addEventListener('click', () => alert('تم تجهيز ملف Excel بنجاح'));

document.addEventListener('DOMContentLoaded', () => {
  renderRows();
});
