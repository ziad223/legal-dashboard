/* Tasks and Organization Page Logic */

const statusMap = {
  new: { text: 'جديدة', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  progress: { text: 'قيد التنفيذ', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  done: { text: 'منجزة', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  late: { text: 'متأخرة', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

const priorityMap = {
  high: { text: 'عالية', cls: 'text-red-600 bg-red-50' },
  medium: { text: 'متوسطة', cls: 'text-amber-600 bg-amber-50' },
  low: { text: 'منخفضة', cls: 'text-blue-600 bg-blue-50' }
};

let tasks = [
  { id: 4001, title: 'مراجعة عقود الموردين', type: 'إداري', owner: 'أحمد السالمي', assignee: 'خالد منصور', start: '2026-05-10', end: '2026-05-15', priority: 'high', status: 'progress', details: 'مراجعة شاملة لجميع بنود عقود الموردين للعام الحالي.' },
  { id: 4002, title: 'تحضير مذكرة الدفاع - قضية 3001', type: 'قانوني', owner: 'نورة العلي', assignee: 'ريم خالد', start: '2026-05-12', end: '2026-05-14', priority: 'high', status: 'new', details: 'تجهيز المذكرة القانونية وتقديمها للمحكمة.' },
  { id: 4003, title: 'أرشفة ملفات الموظفين', type: 'موارد بشرية', owner: 'إيمان محمد', assignee: 'نادي فهد', start: '2026-05-01', end: '2026-05-05', priority: 'low', status: 'done', details: 'تم الانتهاء من أرشفة جميع الملفات الورقية.' },
  { id: 4004, title: 'تحديث بيانات العملاء', type: 'إداري', owner: 'محمد علي', assignee: 'بيبو سمير', start: '2026-04-20', end: '2026-04-25', priority: 'medium', status: 'late', details: 'المهمة تجاوزت الموعد المحدد للتسليم.' }
];

let editingId = null;
let deletingId = null;

const tasksTable = document.getElementById('tasksTable');
const rowsCount = document.getElementById('rowsCount');
const topSearch = document.getElementById('globalSearchInput');
const tableSearch = document.getElementById('tableSearch');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');

function updateStats() {
  const statTotal = document.getElementById('statTotal');
  const statProgress = document.getElementById('statProgress');
  const statDone = document.getElementById('statDone');
  const statLate = document.getElementById('statLate');

  if (statTotal) statTotal.textContent = tasks.length;
  if (statProgress) statProgress.textContent = tasks.filter(t => t.status === 'progress' || t.status === 'new').length;
  if (statDone) statDone.textContent = tasks.filter(t => t.status === 'done').length;
  if (statLate) statLate.textContent = tasks.filter(t => t.status === 'late').length;
}

function renderRows() {
  if (!tasksTable) return;

  const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();
  const status = statusFilter?.value || 'all';
  const priority = priorityFilter?.value || 'all';

  const filtered = tasks.filter(item => {
    const text = `${item.title} ${item.owner} ${item.assignee} ${item.type} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
           (status === 'all' || item.status === status) &&
           (priority === 'all' || item.priority === priority);
  });

  tasksTable.innerHTML = filtered.map(item => {
    const st = statusMap[item.status];
    const pr = priorityMap[item.priority];

    return `
      <tr class="table-row" data-id="${item.id}">
        <td class="px-4 py-3 font-black text-legalGold">#${item.id}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="grid h-9 w-9 place-items-center rounded-2xl bg-legalGold/15 text-legalGold">
              <i class="fa-solid fa-list-check"></i>
            </div>
            <p class="font-black text-slate-900">${item.title}</p>
          </div>
        </td>
        <td class="px-4 py-3 font-bold text-slate-500">${item.type}</td>
        <td class="px-4 py-3 font-bold text-slate-600">${item.owner}</td>
        <td class="px-4 py-3 font-bold text-slate-600">${item.assignee}</td>
        <td class="px-4 py-3 font-bold text-slate-500">${item.start}</td>
        <td class="px-4 py-3 font-bold text-slate-500">${item.end}</td>
        <td class="px-4 py-3">
          <span class="rounded-lg px-3 py-1 text-[10px] font-black ${pr.cls}">${pr.text}</span>
        </td>
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${tasks.length} مهام`;
  updateStats();
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openTaskModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const taskModal = document.getElementById('taskModal');
const taskModalTitle = document.getElementById('taskModalTitle');
const closeTaskModal = document.getElementById('closeTaskModal');
const cancelTaskModal = document.getElementById('cancelTaskModal');
const saveTaskBtn = document.getElementById('saveTaskBtn');

const formTitle = document.getElementById('formTitle');
const formType = document.getElementById('formType');
const formOwner = document.getElementById('formOwner');
const formAssignee = document.getElementById('formAssignee');
const formStart = document.getElementById('formStart');
const formEnd = document.getElementById('formEnd');
const formPriority = document.getElementById('formPriority');
const formStatus = document.getElementById('formStatus');
const formDetails = document.getElementById('formDetails');

function openTaskModal(id = null) {
  if (!taskModal) return;
  editingId = id;
  const item = tasks.find(t => t.id === id);

  if (taskModalTitle) taskModalTitle.textContent = id ? 'تعديل المهمة' : 'إضافة مهمة';

  if (formTitle) formTitle.value = item?.title || '';
  if (formType) formType.value = item?.type || '';
  if (formOwner) formOwner.value = item?.owner || '';
  if (formAssignee) formAssignee.value = item?.assignee || '';
  if (formStart) formStart.value = item?.start || '';
  if (formEnd) formEnd.value = item?.end || '';
  if (formPriority) formPriority.value = item?.priority || 'medium';
  if (formStatus) formStatus.value = item?.status || 'new';
  if (formDetails) formDetails.value = item?.details || '';

  taskModal.classList.remove('hidden');
  taskModal.classList.add('flex');
}

function closeTaskModalFn() {
  if (!taskModal) return;
  taskModal.classList.add('hidden');
  taskModal.classList.remove('flex');
  editingId = null;
}

if (saveTaskBtn) {
    saveTaskBtn.addEventListener('click', () => {
      const payload = {
        title: formTitle.value.trim() || 'مهمة جديدة',
        type: formType.value.trim() || 'إداري',
        owner: formOwner.value.trim() || 'غير محدد',
        assignee: formAssignee.value.trim() || 'غير محدد',
        start: formStart.value || '2026-05-12',
        end: formEnd.value || '2026-05-12',
        priority: formPriority.value,
        status: formStatus.value,
        details: formDetails.value.trim() || 'لا توجد تفاصيل'
      };

      if (editingId) {
        const index = tasks.findIndex(t => t.id === editingId);
        tasks[index] = { ...tasks[index], ...payload };
      } else {
        tasks.unshift({ id: Number(Date.now().toString().slice(-4)), ...payload });
      }

      closeTaskModalFn();
      renderRows();
    });
}

if (closeTaskModal) closeTaskModal.addEventListener('click', closeTaskModalFn);
if (cancelTaskModal) cancelTaskModal.addEventListener('click', closeTaskModalFn);
if (taskModal) {
    taskModal.addEventListener('click', e => { if (e.target === taskModal) closeTaskModalFn(); });
}

const openTaskModalBtn = document.getElementById('openTaskModalBtn');
if (openTaskModalBtn) openTaskModalBtn.addEventListener('click', () => openTaskModal());

const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  const item = tasks.find(t => t.id === id);
  if (!item || !viewModalContent) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم المهمة:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>العنوان:</b> ${item.title}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>النوع:</b> ${item.type}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>المسؤول:</b> ${item.owner}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>المكلف:</b> ${item.assignee}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>تاريخ البداية:</b> ${item.start}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>تاريخ النهاية:</b> ${item.end}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الأولوية:</b> ${priorityMap[item.priority].text}</div>
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
      tasks = tasks.filter(t => t.id !== deletingId);
      closeDeleteModal();
      renderRows();
    });
}

[tableSearch, topSearch, statusFilter, priorityFilter].forEach(el => {
  if (el) {
      el.addEventListener('input', renderRows);
      el.addEventListener('change', renderRows);
  }
});

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) exportBtn.addEventListener('click', () => alert('تم تجهيز ملف Excel بنجاح'));

// Initial render
renderRows();
