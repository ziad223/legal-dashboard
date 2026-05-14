/* Permissions Page Logic */

const roleTypeText = {
  admin: 'مشرف',
  lawyer: 'محامي',
  custom: 'مخصص'
};

const statusMap = {
  active: { text: 'ظاهر', cls: 'bg-green-500 text-white' },
  hidden: { text: 'مخفي', cls: 'bg-red-500 text-white' }
};

let permissions = [
  { id: 1, title: 'المشرف', roleType: 'admin', permissions: ['عرض', 'الإضافة', 'التعديل', 'الحذف', 'الاعتماد'], status: 'active', note: 'صلاحيات كاملة تقريبًا.' },
  { id: 2, title: 'محامي', roleType: 'lawyer', permissions: ['عرض', 'الإضافة', 'التعديل', 'الحذف', 'الاعتماد'], status: 'active', note: 'صلاحيات المحامي الأساسية.' },
  { id: 3, title: '!!!!!!!!!!', roleType: 'custom', permissions: ['الإضافة'], status: 'active', note: 'صلاحية مخصصة.' }
];

let editingId = null;
let deletingId = null;

const permissionCards = document.getElementById('permissionCards');
const rowsCount = document.getElementById('rowsCount');
const topSearch = document.getElementById('globalSearchInput');
const tableSearch = document.getElementById('tableSearch');
const statusFilter = document.getElementById('statusFilter');
const roleFilter = document.getElementById('roleFilter');

function updateStats() {
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statFull = document.getElementById('statFull');
  const statHidden = document.getElementById('statHidden');

  if (statTotal) statTotal.textContent = permissions.length;
  if (statActive) statActive.textContent = permissions.filter(p => p.status === 'active').length;
  if (statFull) statFull.textContent = permissions.filter(p => p.permissions.length >= 5).length;
  if (statHidden) statHidden.textContent = permissions.filter(p => p.status === 'hidden').length;
}

function renderRows() {
  if (!permissionCards) return;

  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();
  const status = statusFilter?.value || 'all';
  const role = roleFilter?.value || 'all';

  const filtered = permissions.filter(item => {
    const text = `${item.title} ${item.note} ${item.permissions.join(' ')} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
           (status === 'all' || item.status === status) &&
           (role === 'all' || item.roleType === role);
  });

  permissionCards.innerHTML = filtered.map(item => {
    const st = statusMap[item.status];

    return `
      <article class="permission-row px-6 py-7" data-id="${item.id}">
        <div class="grid grid-cols-12 items-center gap-4 text-center">
          <div class="col-span-1 text-lg font-black text-slate-900">${item.id}</div>

          <div class="col-span-3">
            <p class="font-black text-slate-900">${item.title}</p>
            <p class="mt-1 text-[10px] font-bold text-slate-400">${roleTypeText[item.roleType]}</p>
          </div>

          <div class="col-span-4 leading-7 text-slate-700">
            ${item.permissions.map(p => `<span class="permission-chip">${p}</span>`).join('')}
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${permissions.length} صلاحيات`;
  updateStats();
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id))));
  document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openPermissionModal(Number(btn.dataset.id))));
  document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id))));
}

const permissionModal = document.getElementById('permissionModal');
const permissionModalTitle = document.getElementById('permissionModalTitle');
const closePermissionModal = document.getElementById('closePermissionModal');
const cancelPermissionModal = document.getElementById('cancelPermissionModal');
const savePermissionBtn = document.getElementById('savePermissionBtn');

const formTitle = document.getElementById('formTitle');
const formRoleType = document.getElementById('formRoleType');
const formStatus = document.getElementById('formStatus');
const formNote = document.getElementById('formNote');

function getCheckedPermissions() {
  return [...document.querySelectorAll('.permission-checkbox')]
    .filter(input => input.checked)
    .map(input => input.value);
}

function setCheckedPermissions(list) {
  document.querySelectorAll('.permission-checkbox').forEach(input => {
    input.checked = list.includes(input.value);
  });
}

function openPermissionModal(id = null) {
  if (!permissionModal) return;
  editingId = id;
  const item = permissions.find(p => p.id === id);

  if (permissionModalTitle) permissionModalTitle.textContent = id ? 'تعديل الصلاحية' : 'إضافة صلاحية';

  if (formTitle) formTitle.value = item?.title || '';
  if (formRoleType) formRoleType.value = item?.roleType || 'custom';
  if (formStatus) formStatus.value = item?.status || 'active';
  if (formNote) formNote.value = item?.note || '';
  setCheckedPermissions(item?.permissions || ['عرض']);

  permissionModal.classList.remove('hidden');
  permissionModal.classList.add('flex');
}

function closePermissionModalFn() {
  if (!permissionModal) return;
  permissionModal.classList.add('hidden');
  permissionModal.classList.remove('flex');
  editingId = null;
}

if (savePermissionBtn) {
    savePermissionBtn.addEventListener('click', () => {
      const checked = getCheckedPermissions();

      const payload = {
        title: formTitle.value.trim() || 'صلاحية جديدة',
        roleType: formRoleType.value,
        permissions: checked.length ? checked : ['عرض'],
        status: formStatus.value,
        note: formNote.value.trim() || 'لا توجد ملاحظات'
      };

      if (editingId) {
        const index = permissions.findIndex(p => p.id === editingId);
        permissions[index] = { ...permissions[index], ...payload };
      } else {
        permissions.unshift({ id: Date.now().toString().slice(-4), ...payload });
      }

      closePermissionModalFn();
      renderRows();
    });
}

if (closePermissionModal) closePermissionModal.addEventListener('click', closePermissionModalFn);
if (cancelPermissionModal) cancelPermissionModal.addEventListener('click', closePermissionModalFn);
if (permissionModal) {
    permissionModal.addEventListener('click', e => { if (e.target === permissionModal) closePermissionModalFn(); });
}

const openPermissionModalBtn = document.getElementById('openPermissionModalBtn');
const openPermissionModalBtn2 = document.getElementById('openPermissionModalBtn2');

if (openPermissionModalBtn) openPermissionModalBtn.addEventListener('click', () => openPermissionModal());
if (openPermissionModalBtn2) openPermissionModalBtn2.addEventListener('click', () => openPermissionModal());

const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  if (!viewModal || !viewModalContent) return;
  const item = permissions.find(p => p.id === id);
  if (!item) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم الصلاحية:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>العنوان:</b> ${item.title}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>نوع الدور:</b> ${roleTypeText[item.roleType]}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الحالة:</b> ${statusMap[item.status].text}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الصلاحيات:</b><br>${item.permissions.map(p => `<span class="permission-chip">${p}</span>`).join('')}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>ملاحظات:</b> ${item.note}</div>
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
      permissions = permissions.filter(p => p.id !== deletingId);
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

document.addEventListener('DOMContentLoaded', () => {
    renderRows();
});
