/* Reports and Statistics Page Logic */

const categoryText = {
  cases: 'القضايا',
  contracts: 'العقود',
  clients: 'العملاء',
  consultations: 'الإستشارات'
};

const periodText = {
  today: 'اليوم',
  week: 'هذا الأسبوع',
  month: 'هذا الشهر',
  year: 'هذه السنة'
};

const statusMap = {
  high: { text: 'أداء مرتفع', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  medium: { text: 'أداء متوسط', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  low: { text: 'يحتاج متابعة', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

let reports = [
  { id: 2001, title: 'تقرير القضايا الشهرية', category: 'cases', period: 'month', records: 48, performance: 86, status: 'high', notes: 'ارتفاع جيد في إنجاز ملفات القضايا هذا الشهر.' },
  { id: 2002, title: 'تقرير العقود النشطة', category: 'contracts', period: 'month', records: 31, performance: 74, status: 'medium', notes: 'عدد العقود النشطة مستقر ويحتاج متابعة دورية.' },
  { id: 2003, title: 'تقرير العملاء الجدد', category: 'clients', period: 'week', records: 16, performance: 68, status: 'medium', notes: 'زيادة في العملاء الجدد خلال الأسبوع الحالي.' },
  { id: 2004, title: 'تقرير الإستشارات المتأخرة', category: 'consultations', period: 'today', records: 7, performance: 45, status: 'low', notes: 'يوجد عدد من الطلبات يحتاج رد سريع.' }
];

let editingId = null;
let deletingId = null;

const reportsTable = document.getElementById('reportsTable');
const rowsCount = document.getElementById('rowsCount');
const reportSearch = document.getElementById('reportSearch');
const topSearch = document.getElementById('globalSearchInput');
const periodFilter = document.getElementById('periodFilter');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');

function renderRows() {
  if (!reportsTable) return;
  const term = ((reportSearch?.value || topSearch?.value || '')).toLowerCase().trim();
  const period = periodFilter?.value || 'all';
  const category = categoryFilter?.value || 'all';
  const status = statusFilter?.value || 'all';

  const filtered = reports.filter(item => {
    const text = `${item.title} ${categoryText[item.category]} ${periodText[item.period]} ${item.id}`.toLowerCase();
    return (!term || text.includes(term)) &&
      (period === 'all' || item.period === period) &&
      (category === 'all' || item.category === category) &&
      (status === 'all' || item.status === status);
  });

  reportsTable.innerHTML = filtered.map(item => {
    const st = statusMap[item.status];

    return `
      <tr class="table-row" data-id="${item.id}">
        <td class="px-4 py-3 font-black text-legalGold">#${item.id}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="grid h-9 w-9 place-items-center rounded-2xl bg-legalGold/15 text-legalGold">
              <i class="fa-solid fa-chart-simple"></i>
            </div>
            <div>
              <p class="font-black text-slate-900">${item.title}</p>
              <p class="text-[10px] font-bold text-slate-400">${item.notes}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 font-bold text-slate-600">${categoryText[item.category]}</td>
        <td class="px-4 py-3 font-bold text-slate-500">${periodText[item.period]}</td>
        <td class="px-4 py-3 font-bold text-slate-500">${item.records}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="w-10 font-black text-legalGreen">${item.performance}%</span>
            <div class="mini-bar w-24"><span style="width:${item.performance}%"></span></div>
          </div>
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

  if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${reports.length} تقارير`;
  bindActionButtons();
}

function bindActionButtons() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openReportModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
}

const reportModal = document.getElementById('reportModal');
const reportModalTitle = document.getElementById('reportModalTitle');
const closeReportModal = document.getElementById('closeReportModal');
const cancelReportModal = document.getElementById('cancelReportModal');
const saveReportBtn = document.getElementById('saveReportBtn');

const formTitle = document.getElementById('formTitle');
const formCategory = document.getElementById('formCategory');
const formPeriod = document.getElementById('formPeriod');
const formStatus = document.getElementById('formStatus');
const formRecords = document.getElementById('formRecords');
const formPerformance = document.getElementById('formPerformance');
const formNotes = document.getElementById('formNotes');

function openReportModal(id = null) {
  if (!reportModal) return;
  editingId = id;
  const item = reports.find(r => r.id === id);

  if (reportModalTitle) reportModalTitle.textContent = id ? 'تعديل التقرير' : 'إضافة تقرير';

  if (formTitle) formTitle.value = item?.title || '';
  if (formCategory) formCategory.value = item?.category || 'cases';
  if (formPeriod) formPeriod.value = item?.period || 'month';
  if (formStatus) formStatus.value = item?.status || 'medium';
  if (formRecords) formRecords.value = item?.records || '';
  if (formPerformance) formPerformance.value = item?.performance || '';
  if (formNotes) formNotes.value = item?.notes || '';

  reportModal.classList.remove('hidden');
  reportModal.classList.add('flex');
}

function closeReportModalFn() {
  if (!reportModal) return;
  reportModal.classList.add('hidden');
  reportModal.classList.remove('flex');
  editingId = null;
}

if (saveReportBtn) {
  saveReportBtn.addEventListener('click', () => {
    const payload = {
      title: formTitle.value.trim() || 'تقرير جديد',
      category: formCategory.value,
      period: formPeriod.value,
      records: Number(formRecords.value || 0),
      performance: Math.min(100, Math.max(0, Number(formPerformance.value || 0))),
      status: formStatus.value,
      notes: formNotes.value.trim() || 'لا توجد ملاحظات'
    };

    if (editingId) {
      const index = reports.findIndex(r => r.id === editingId);
      reports[index] = { ...reports[index], ...payload };
    } else {
      reports.unshift({ id: Date.now().toString().slice(-4), ...payload });
    }

    closeReportModalFn();
    renderRows();
  });
}

if (closeReportModal) closeReportModal.addEventListener('click', closeReportModalFn);
if (cancelReportModal) cancelReportModal.addEventListener('click', closeReportModalFn);
if (reportModal) {
  reportModal.addEventListener('click', e => { if (e.target === reportModal) closeReportModalFn(); });
}

const openReportModalBtn = document.getElementById('openReportModalBtn');
if (openReportModalBtn) openReportModalBtn.addEventListener('click', () => openReportModal());

const viewModal = document.getElementById('viewModal');
const closeViewModal = document.getElementById('closeViewModal');
const viewModalContent = document.getElementById('viewModalContent');

function openViewModal(id) {
  if (!viewModal || !viewModalContent) return;
  const item = reports.find(r => r.id === id);
  if (!item) return;

  viewModalContent.innerHTML = `
    <div class="rounded-2xl bg-slate-50 p-4"><b>رقم التقرير:</b> #${item.id}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>اسم التقرير:</b> ${item.title}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>القسم:</b> ${categoryText[item.category]}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>الفترة:</b> ${periodText[item.period]}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>عدد السجلات:</b> ${item.records}</div>
    <div class="rounded-2xl bg-slate-50 p-4"><b>نسبة الأداء:</b> ${item.performance}%</div>
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
    reports = reports.filter(r => r.id !== deletingId);
    closeDeleteModal();
    renderRows();
  });
}

[reportSearch, topSearch, periodFilter, categoryFilter, statusFilter].forEach(el => {
  if (el) {
    el.addEventListener('input', renderRows);
    el.addEventListener('change', renderRows);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderRows();
});

if (document.getElementById('exportBtn')) {
  document.getElementById('exportBtn').addEventListener('click', () => alert('تم تصدير الملف بنجاح'));
}

if (document.getElementById('printBtn')) {
  document.getElementById('printBtn').addEventListener('click', () => window.print());
}
