  /* Case Management Page Logic */

  const typeText = {
    commercial: 'تجاري',
    labor: 'عمالي',
    criminal: 'جنائي',
    civil: 'مدني'
  };

  const stageText = {
    first: 'ابتدائي',
    appeal: 'استئناف',
    execution: 'تنفيذ',
    cassation: 'تمييز'
  };

  const statusMap = {
    active: { text: 'نشطة', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    hearing: { text: 'بانتظار جلسة', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    closed: { text: 'مغلقة', cls: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
    late: { text: 'متأخرة', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
  };

  let cases = [
    { id: 3001, fileNo: 'LAW-2026-001', title: 'مطالبة مالية تجارية', lawyer: 'أحمد السالمي', contract: 'CNT-2026-001', duration: '45 يوم', type: 'commercial', subType: 'مطالبة مالية', stage: 'first', status: 'active', notes: 'ملف نشط وجاري إعداد المذكرات.' },
    { id: 3002, fileNo: 'LAW-2026-002', title: 'نزاع عمالي', lawyer: 'نورة العلي', contract: 'CNT-2026-003', duration: '21 يوم', type: 'labor', subType: 'مستحقات عمالية', stage: 'appeal', status: 'hearing', notes: 'تم تحديد جلسة الأسبوع القادم.' },
    { id: 3003, fileNo: 'LAW-2025-110', title: 'دعوى مدنية', lawyer: 'خالد منصور', contract: 'CNT-2025-110', duration: '120 يوم', type: 'civil', subType: 'تعويضات', stage: 'execution', status: 'late', notes: 'تحتاج متابعة عاجلة مع المحكمة.' },
    { id: 3004, fileNo: 'LAW-2024-078', title: 'قضية جنائية منتهية', lawyer: 'ريم خالد', contract: 'CNT-2024-078', duration: '300 يوم', type: 'criminal', subType: 'دفاع جنائي', stage: 'cassation', status: 'closed', notes: 'تم إغلاق الملف وأرشفة المستندات.' }
  ];

  let editingId = null;
  let deletingId = null;

  const casesTable = document.getElementById('casesTable');
  const rowsCount = document.getElementById('rowsCount');
  const topSearch = document.getElementById('topSearch');
  const tableSearch = document.getElementById('tableSearch');
  const statusFilter = document.getElementById('statusFilter');
  const stageFilter = document.getElementById('stageFilter');
  const typeFilter = document.getElementById('typeFilter');

  function updateStats() {
    const statTotal = document.getElementById('statTotal');
    const statActive = document.getElementById('statActive');
    const statHearing = document.getElementById('statHearing');
    const statClosed = document.getElementById('statClosed');

    if (statTotal) statTotal.textContent = cases.length;
    if (statActive) statActive.textContent = cases.filter(c => c.status === 'active').length;
    if (statHearing) statHearing.textContent = cases.filter(c => c.status === 'hearing').length;
    if (statClosed) statClosed.textContent = cases.filter(c => c.status === 'closed').length;
  }

  function renderRows() {
    if (!casesTable) return;

    const term = ((tableSearch?.value || topSearch?.value || '')).toLowerCase().trim();
    const status = statusFilter?.value || 'all';
    const stage = stageFilter?.value || 'all';
    const type = typeFilter?.value || 'all';

    const filtered = cases.filter(item => {
      const text = `${item.fileNo} ${item.title} ${item.lawyer} ${item.contract} ${item.subType} ${item.id}`.toLowerCase();
      return (!term || text.includes(term)) &&
        (status === 'all' || item.status === status) &&
        (stage === 'all' || item.stage === stage) &&
        (type === 'all' || item.type === type);
    });

    casesTable.innerHTML = filtered.map(item => {
      const st = statusMap[item.status];

      return `
        <tr class="table-row" data-id="${item.id}">
          <td class="px-4 py-3 font-black text-legalGold">${item.fileNo}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="grid h-9 w-9 place-items-center rounded-2xl bg-legalGold/15 text-legalGold">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <div>
                <p class="font-black text-slate-900">${item.title}</p>
                <p class="text-[10px] font-bold text-slate-400">#${item.id}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 font-bold text-slate-600">${item.lawyer}</td>
          <td class="px-4 py-3 font-bold text-slate-500">${item.contract}</td>
          <td class="px-4 py-3 font-bold text-slate-500">${item.duration}</td>
          <td class="px-4 py-3 font-bold text-slate-600">${typeText[item.type]}</td>
          <td class="px-4 py-3 font-bold text-slate-500">${item.subType}</td>
          <td class="px-4 py-3 font-bold text-slate-500">${stageText[item.stage]}</td>
          <td class="px-4 py-3">
            <span class="status-badge ${st.cls}">
              <span class="h-2 w-2 rounded-full ${st.dot}"></span>
              ${st.text}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-center gap-2">
  <a href="stages-of-the-case.html" 
    class="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow-md" 
    title="مراحل القضية">
    <i class="fa-solid fa-list-check text-[14px]"></i>
  </a>           <a href="case-details.html?id=${item.id}" class="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white" title="تفاصيل القضية"><i class="fa-solid fa-eye"></i></a>
              <button class="edit-btn grid h-8 w-8 place-items-center rounded-xl bg-legalGold/15 text-legalGold transition hover:bg-legalGold hover:text-white" data-id="${item.id}" title="تعديل"><i class="fa-solid fa-pen"></i></button>
              <button class="delete-btn grid h-8 w-8 place-items-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white" data-id="${item.id}" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (rowsCount) rowsCount.textContent = `عرض ${filtered.length} من ${cases.length} قضايا`;
    updateStats();
    bindActionButtons();
  }

  function bindActionButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => openViewModal(Number(btn.dataset.id)));
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openCaseModal(Number(btn.dataset.id)));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
    });
  }

  const caseModal = document.getElementById('caseModal');
  const caseModalTitle = document.getElementById('caseModalTitle');
  const closeCaseModal = document.getElementById('closeCaseModal');
  const cancelCaseModal = document.getElementById('cancelCaseModal');
  const saveCaseBtn = document.getElementById('saveCaseBtn');

  const formFileNo = document.getElementById('formFileNo');
  const formTitle = document.getElementById('formTitle');
  const formLawyer = document.getElementById('formLawyer');
  const formContract = document.getElementById('formContract');
  const formDuration = document.getElementById('formDuration');
  const formType = document.getElementById('formType');
  const formSubType = document.getElementById('formSubType');
  const formStage = document.getElementById('formStage');
  const formStatus = document.getElementById('formStatus');
  const formNotes = document.getElementById('formNotes');

  function openCaseModal(id = null) {
    if (!caseModal) return;
    editingId = id;
    const item = cases.find(c => c.id === id);

    if (caseModalTitle) caseModalTitle.textContent = id ? 'تعديل القضية' : 'إضافة قضية';

    if (formFileNo) formFileNo.value = item?.fileNo || '';
    if (formTitle) formTitle.value = item?.title || '';
    if (formLawyer) formLawyer.value = item?.lawyer || '';
    if (formContract) formContract.value = item?.contract || '';
    if (formDuration) formDuration.value = item?.duration || '';
    if (formType) formType.value = item?.type || 'commercial';
    if (formSubType) formSubType.value = item?.subType || '';
    if (formStage) formStage.value = item?.stage || 'first';
    if (formStatus) formStatus.value = item?.status || 'active';
    if (formNotes) formNotes.value = item?.notes || '';

    caseModal.classList.remove('hidden');
    caseModal.classList.add('flex');
  }

  function closeCaseModalFn() {
    if (!caseModal) return;
    caseModal.classList.add('hidden');
    caseModal.classList.remove('flex');
    editingId = null;
  }

  if (saveCaseBtn) {
    saveCaseBtn.addEventListener('click', () => {
      const payload = {
        fileNo: formFileNo.value.trim() || `LAW-${new Date().getFullYear()}-NEW`,
        title: formTitle.value.trim() || 'قضية جديدة',
        lawyer: formLawyer.value.trim() || 'غير محدد',
        contract: formContract.value.trim() || 'CNT-NEW',
        duration: formDuration.value.trim() || '0 يوم',
        type: formType.value,
        subType: formSubType.value.trim() || 'غير محدد',
        stage: formStage.value,
        status: formStatus.value,
        notes: formNotes.value.trim() || 'لا توجد ملاحظات'
      };

      if (editingId) {
        const index = cases.findIndex(c => c.id === editingId);
        cases[index] = { ...cases[index], ...payload };
      } else {
        cases.unshift({ id: Number(Date.now().toString().slice(-4)), ...payload });
      }

      closeCaseModalFn();
      renderRows();
    });
  }

  if (closeCaseModal) closeCaseModal.addEventListener('click', closeCaseModalFn);
  if (cancelCaseModal) cancelCaseModal.addEventListener('click', closeCaseModalFn);
  if (caseModal) {
    caseModal.addEventListener('click', e => { if (e.target === caseModal) closeCaseModalFn(); });
  }

  const openCaseModalBtn = document.getElementById('openCaseModalBtn');
  if (openCaseModalBtn) openCaseModalBtn.addEventListener('click', () => openCaseModal());

  const viewModal = document.getElementById('viewModal');
  const closeViewModal = document.getElementById('closeViewModal');
  const viewModalContent = document.getElementById('viewModalContent');

  function openViewModal(id) {
    const item = cases.find(c => c.id === id);
    if (!item || !viewModalContent) return;

    viewModalContent.innerHTML = `
      <div class="modal-grid-3">
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">رقم الملف</p><p>${item.fileNo}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">عنوان القضية</p><p>${item.title}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">المحامي المسجل</p><p>${item.lawyer}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">رقم العقد</p><p>${item.contract}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">مدة القضية</p><p>${item.duration}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">التصنيف الرئيسي</p><p>${typeText[item.type]}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">التصنيف الفرعي</p><p>${item.subType}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">مرحلة الدعوى</p><p>${stageText[item.stage]}</p></div>
        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">حالة الدعوى</p><p>${statusMap[item.status].text}</p></div>
        <div class="md:col-span-2 lg:col-span-3 rounded-2xl bg-slate-50 p-4 border border-slate-100"><p class="text-slate-400 text-[10px] mb-1">الملاحظات والتعليمات</p><p class="leading-relaxed">${item.notes}</p></div>
      </div>
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
      cases = cases.filter(c => c.id !== deletingId);
      closeDeleteModal();
      renderRows();
    });
  }

  [tableSearch, topSearch, statusFilter, stageFilter, typeFilter].forEach(el => {
    if (el) {
      el.addEventListener('input', renderRows);
      el.addEventListener('change', renderRows);
    }
  });

  const printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', () => alert('تم تجهيز ملف Excel بنجاح'));

  document.addEventListener('DOMContentLoaded', () => {
    renderRows();
  });
