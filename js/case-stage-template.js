/* Case Stage Template Logic */

// Mock data for a specific case stage
const stageData = {
  stageName: 'الاستئناف',
  caseTitle: 'قضية تجارية رقم 102',
  entries: [
    { id: 1, title: 'تقديم مذكرة استئناف', type: 'document', date: '2026-06-01', assignee: 'أحمد محمود', status: 'completed' },
    { id: 2, title: 'جلسة استماع أولى', type: 'session', date: '2026-06-15', assignee: 'سارة العلي', status: 'pending' },
    { id: 3, title: 'طلب تأجيل', type: 'action', date: '2026-05-10', assignee: 'أحمد محمود', status: 'delayed' }
  ]
};

const typeMap = {
  session: { text: 'جلسة', icon: 'fa-gavel' },
  document: { text: 'مستند', icon: 'fa-file-lines' },
  action: { text: 'إجراء قانوني', icon: 'fa-bolt' }
};

const statusMap = {
  completed: { text: 'مكتمل', cls: 'bg-emerald-100 text-emerald-700' },
  pending: { text: 'قيد الانتظار', cls: 'bg-amber-100 text-amber-700' },
  delayed: { text: 'متأخر', cls: 'bg-red-100 text-red-700' }
};

document.addEventListener('DOMContentLoaded', () => {
  // Update header text based on data
  document.getElementById('stageTitle').textContent = `تفاصيل مرحلة: ${stageData.stageName}`;
  document.getElementById('breadcrumbStageName').textContent = stageData.stageName;

  const tbody = document.getElementById('stageTableBody');
  const rowsCount = document.getElementById('rowsCount');

  let entries = [...stageData.entries];

  const renderTable = () => {
    // Update Stats
    document.getElementById('statTotal').textContent = entries.length;
    document.getElementById('statCompleted').textContent = entries.filter(e => e.status === 'completed').length;
    document.getElementById('statPending').textContent = entries.filter(e => e.status === 'pending' || e.status === 'delayed').length;
    document.getElementById('statSessions').textContent = entries.filter(e => e.type === 'session').length;

    if (entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-8 text-center text-slate-500 font-bold">لا توجد سجلات في هذه المرحلة.</td></tr>`;
      rowsCount.textContent = `عرض 0 من 0 سجل`;
      return;
    }

    tbody.innerHTML = entries.map((entry, index) => {
      const typeInfo = typeMap[entry.type] || { text: entry.type, icon: 'fa-circle' };
      const st = statusMap[entry.status] || { text: entry.status, cls: 'bg-slate-100 text-slate-700' };

      return `
        <tr class="group transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-white rounded-2xl">
          <td class="px-4 py-4 rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-100">
            <div class="grid h-8 w-8 place-items-center rounded-xl bg-slate-50 text-xs font-black text-slate-400 group-hover:bg-legalGold/10 group-hover:text-legalGold transition-colors">${index + 1}</div>
          </td>
          <td class="px-4 py-4 border-y border-transparent group-hover:border-slate-100">
            <p class="font-black text-slate-900 text-sm drop-shadow-sm">${entry.title}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">معرف السجل: #${entry.id}</p>
          </td>
          <td class="px-4 py-4 border-y border-transparent group-hover:border-slate-100">
            <span class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl">
              <i class="fa-solid ${typeInfo.icon} text-legalGold"></i>
              ${typeInfo.text}
            </span>
          </td>
          <td class="px-4 py-4 border-y border-transparent group-hover:border-slate-100 text-sm">${entry.date}</td>
          <td class="px-4 py-4 border-y border-transparent group-hover:border-slate-100 text-sm">
             <div class="flex items-center gap-2">
               <div class="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-[10px] font-black text-slate-600">${entry.assignee.charAt(0)}</div>
               ${entry.assignee}
             </div>
          </td>
          <td class="px-4 py-4 border-y border-transparent group-hover:border-slate-100">
            <span class="rounded-xl px-4 py-1.5 text-xs font-black shadow-sm ${st.cls}">${st.text}</span>
          </td>
          <td class="px-4 py-4 rounded-l-2xl border-y border-l border-transparent group-hover:border-slate-100 text-center">
            <div class="flex items-center justify-center gap-2 transition-opacity duration-300">
              <button data-action="edit" data-id="${entry.id}" title="تعديل" class="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-500 hover:text-white shadow-sm hover:shadow-emerald-500/30 hover:-translate-y-0.5">
                <i class="fa-solid fa-pen text-sm pointer-events-none"></i>
              </button>
              <button data-action="delete" data-id="${entry.id}" title="حذف" class="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-500 hover:text-white shadow-sm hover:shadow-red-500/30 hover:-translate-y-0.5">
                <i class="fa-solid fa-trash text-sm pointer-events-none"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    rowsCount.textContent = `عرض ${entries.length} من ${entries.length} سجل`;
  };

  renderTable();

  // Modal logic
  const stageModal = document.getElementById('stageModal');
  const deleteStageModal = document.getElementById('deleteStageModal');
  let currentEditId = null;

  const openModal = (modal) => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };
  const closeModal = (modal) => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Open Add Modal
  document.getElementById('openStageModalBtn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('stageModalTitle').textContent = 'إضافة جديد';
    document.getElementById('formEntryTitle').value = '';
    document.getElementById('formEntryType').value = 'session';
    document.getElementById('formEntryDate').value = '';
    document.getElementById('formEntryAssignee').value = '';
    document.getElementById('formEntryStatus').value = 'pending';
    document.getElementById('formEntryNotes').value = '';
    openModal(stageModal);
  });

  // Close Modals
  document.getElementById('closeStageModal').addEventListener('click', () => closeModal(stageModal));
  document.getElementById('cancelStageModal').addEventListener('click', () => closeModal(stageModal));
  document.getElementById('cancelDeleteStageBtn').addEventListener('click', () => closeModal(deleteStageModal));

  // Handle Table Actions
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const entryId = Number(btn.dataset.id);
    const entry = entries.find(x => x.id === entryId);

    if (action === 'edit' && entry) {
      currentEditId = entryId;
      document.getElementById('stageModalTitle').textContent = 'تعديل السجل';
      document.getElementById('formEntryTitle').value = entry.title;
      document.getElementById('formEntryType').value = entry.type;
      document.getElementById('formEntryDate').value = entry.date;
      document.getElementById('formEntryAssignee').value = entry.assignee;
      document.getElementById('formEntryStatus').value = entry.status;
      openModal(stageModal);
    } else if (action === 'delete') {
      currentEditId = entryId;
      openModal(deleteStageModal);
    }
  });

  // Handle Save
  document.getElementById('saveStageBtn').addEventListener('click', () => {
    const title = document.getElementById('formEntryTitle').value;
    const type = document.getElementById('formEntryType').value;
    const date = document.getElementById('formEntryDate').value;
    const assignee = document.getElementById('formEntryAssignee').value;
    const status = document.getElementById('formEntryStatus').value;

    if (!title || !date) {
      alert('يرجى تعبئة العنوان والتاريخ على الأقل');
      return;
    }

    if (currentEditId) {
      // Edit existing
      const entry = entries.find(x => x.id === currentEditId);
      if (entry) {
        entry.title = title;
        entry.type = type;
        entry.date = date;
        entry.assignee = assignee || 'غير محدد';
        entry.status = status;
      }
    } else {
      // Add new
      const newId = Date.now();
      entries.push({
        id: newId,
        title: title,
        type: type,
        date: date,
        assignee: assignee || 'غير محدد',
        status: status
      });
    }

    renderTable();
    closeModal(stageModal);
  });

  // Handle Confirm Delete
  document.getElementById('confirmDeleteStageBtn').addEventListener('click', () => {
    if (currentEditId) {
      entries = entries.filter(x => x.id !== currentEditId);
      renderTable();
    }
    closeModal(deleteStageModal);
  });
});
