/* Customer Details Logic */

const typeText = {
  individual: 'فرد',
  company: 'شركة',
  vip: 'عميل مميز'
};

const statusMap = {
  active: { text: 'نشط', cls: 'bg-emerald-100 text-emerald-700' },
  pending: { text: 'قيد المتابعة', cls: 'bg-amber-100 text-amber-700' },
  expired: { text: 'منتهي', cls: 'bg-red-100 text-red-700' }
};

// Detailed demo data for clients
const detailedClients = [
  { 
    id: 20, 
    name: 'aya aya', 
    email: 'phone.local@0900000001', 
    phone: '+966 55 123 4567', 
    contract: 'CNT-2026-001', 
    type: 'individual', 
    status: 'active', 
    notes: 'عميل نشط ولديه عقد استشارة سنوي.',
    identity: '1029384756',
    createdAt: '01/01/2026',
    contractValue: '50,000 ريال',
    paymentMethod: 'تحويل بنكي',
    contractDuration: 'سنة واحدة'
  },
  { 
    id: 22, 
    name: 'nour nour', 
    email: 'phone.local@0900000003', 
    phone: '+966 54 800 2211', 
    contract: 'CNT-2026-003', 
    type: 'vip', 
    status: 'active', 
    notes: 'عميل مميز يحتاج متابعة دورية.',
    identity: '1092837465',
    createdAt: '15/02/2026',
    contractValue: '120,000 ريال',
    paymentMethod: 'بطاقة ائتمان',
    contractDuration: 'سنتين'
  },
  { 
    id: 26, 
    name: 'دخالة خالد', 
    email: 'phone.local@0900010000', 
    phone: '+966 50 444 9988', 
    contract: 'CNT-2026-008', 
    type: 'company', 
    status: 'pending', 
    notes: 'بانتظار توقيع ملحق العقد.',
    identity: '7001234567',
    createdAt: '10/03/2026',
    contractValue: '250,000 ريال',
    paymentMethod: 'شيك مصدق',
    contractDuration: '3 سنوات'
  },
  { 
    id: 31, 
    name: 'شركة النور التجارية', 
    email: 'info@alnour.com', 
    phone: '+966 56 202 3030', 
    contract: 'CNT-2025-110', 
    type: 'company', 
    status: 'expired', 
    notes: 'العقد منتهي ويحتاج تجديد.',
    identity: '7009876543',
    createdAt: '20/05/2025',
    contractValue: '80,000 ريال',
    paymentMethod: 'تحويل بنكي',
    contractDuration: 'سنة واحدة'
  }
];

const clientContracts = {
  20: [
    { id: 'CNT-2026-001', type: 'استشارة سنوية', startDate: '01/01/2026', endDate: '01/01/2027', value: '50,000 ريال', status: 'active' },
    { id: 'CNT-2025-088', type: 'تأسيس شركة', startDate: '15/06/2025', endDate: '15/08/2025', value: '25,000 ريال', status: 'expired' }
  ],
  22: [
    { id: 'CNT-2026-003', type: 'تمثيل قانوني', startDate: '15/02/2026', endDate: '15/02/2028', value: '120,000 ريال', status: 'active' }
  ],
  26: [
    { id: 'CNT-2026-008', type: 'صياغة عقود', startDate: '10/03/2026', endDate: '10/03/2029', value: '250,000 ريال', status: 'pending' }
  ],
  31: [
    { id: 'CNT-2025-110', type: 'استشارة شهرية', startDate: '20/05/2025', endDate: '20/05/2026', value: '80,000 ريال', status: 'expired' }
  ]
};

const contractStatusMap = {
  active: { text: 'ساري', cls: 'bg-emerald-100 text-emerald-700' },
  pending: { text: 'قيد المراجعة', cls: 'bg-amber-100 text-amber-700' },
  expired: { text: 'منتهي', cls: 'bg-red-100 text-red-700' }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const client = detailedClients.find(c => c.id === id);

  if (!client) {
    document.getElementById('clientName').textContent = 'العميل غير موجود';
    return;
  }

  // Populate basic info
  document.getElementById('clientName').textContent = client.name;
  document.getElementById('clientEmail').textContent = client.email;
  document.getElementById('clientPhone').textContent = client.phone;
  document.getElementById('clientContract').textContent = client.contract;
  document.getElementById('clientType').textContent = typeText[client.type] || client.type;
  document.getElementById('clientIdentity').textContent = client.identity || '---';
  
  // Status badge
  const st = statusMap[client.status];
  const badge = document.getElementById('clientStatusBadge');
  if (st) {
    badge.textContent = st.text;
    badge.className = `w-fit rounded-full px-5 py-2 text-sm font-black ${st.cls}`;
  }

  // Personal info
  document.getElementById('firstName').textContent = client.name.split(' ')[0] || client.name;
  document.getElementById('emailBox').textContent = client.email;
  document.getElementById('phoneBox').textContent = client.phone;
  document.getElementById('createdAt').textContent = client.createdAt || '---';

  // Render Contracts Table
  const tbody = document.getElementById('contractsTableBody');
  let contracts = clientContracts[client.id] || [];
  let currentContractId = null;
  
  const renderContracts = () => {
    if (contracts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-slate-500">لا توجد عقود مسجلة لهذا العميل.</td></tr>`;
    } else {
      tbody.innerHTML = contracts.map(c => {
        const st = contractStatusMap[c.status] || { text: c.status, cls: 'bg-slate-100 text-slate-700' };
        return `
          <tr class="transition hover:bg-slate-50/50">
            <td class="px-6 py-4 font-bold text-slate-900">${c.id}</td>
            <td class="px-6 py-4">${c.type}</td>
            <td class="px-6 py-4 text-slate-500">${c.startDate}</td>
            <td class="px-6 py-4 text-slate-500">${c.endDate}</td>
            <td class="px-6 py-4 font-black text-slate-900">${c.value}</td>
            <td class="px-6 py-4">
              <span class="rounded-full px-3 py-1 text-xs font-black ${st.cls}">${st.text}</span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button data-action="view" data-id="${c.id}" title="عرض التفاصيل" class="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100">
                  <i class="fa-solid fa-eye text-sm pointer-events-none"></i>
                </button>
                <button data-action="edit" data-id="${c.id}" title="تعديل العقد" class="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100">
                  <i class="fa-solid fa-pen text-sm pointer-events-none"></i>
                </button>
                <button data-action="delete" data-id="${c.id}" title="حذف العقد" class="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100">
                  <i class="fa-solid fa-trash text-sm pointer-events-none"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  };

  renderContracts();

  // Modal logic
  const contractModal = document.getElementById('contractModal');
  const viewContractModal = document.getElementById('viewContractModal');
  const deleteContractModal = document.getElementById('deleteContractModal');

  const openModal = (modal) => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };
  const closeModal = (modal) => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  document.getElementById('addContractBtn').addEventListener('click', () => {
    currentContractId = null;
    document.getElementById('contractModalTitle').textContent = 'إضافة عقد جديد';
    document.getElementById('contractFormId').value = '';
    document.getElementById('contractFormType').value = '';
    document.getElementById('contractFormStart').value = '';
    document.getElementById('contractFormEnd').value = '';
    document.getElementById('contractFormValue').value = '';
    document.getElementById('contractFormStatus').value = 'active';
    openModal(contractModal);
  });

  // Close buttons
  document.getElementById('closeContractModal').addEventListener('click', () => closeModal(contractModal));
  document.getElementById('cancelContractModal').addEventListener('click', () => closeModal(contractModal));
  document.getElementById('closeViewContractModal').addEventListener('click', () => closeModal(viewContractModal));
  document.getElementById('cancelDeleteContractBtn').addEventListener('click', () => closeModal(deleteContractModal));

  // Handle Save
  document.getElementById('saveContractBtn').addEventListener('click', () => {
    const type = document.getElementById('contractFormType').value;
    const start = document.getElementById('contractFormStart').value;
    const end = document.getElementById('contractFormEnd').value;
    const value = document.getElementById('contractFormValue').value;
    const status = document.getElementById('contractFormStatus').value;

    if (!type || !value) {
      alert('يرجى تعبئة نوع العقد وقيمته على الأقل');
      return;
    }

    if (currentContractId) {
      // Edit existing
      const contract = contracts.find(c => c.id === currentContractId);
      if (contract) {
        contract.type = type;
        contract.startDate = start ? start.split('-').reverse().join('/') : contract.startDate;
        contract.endDate = end ? end.split('-').reverse().join('/') : contract.endDate;
        contract.value = value;
        contract.status = status;
      }
    } else {
      // Add new
      const newId = 'CNT-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
      contracts.push({
        id: newId,
        type: type,
        startDate: start ? start.split('-').reverse().join('/') : new Date().toLocaleDateString('en-GB'),
        endDate: end ? end.split('-').reverse().join('/') : '',
        value: value,
        status: status
      });
    }

    renderContracts();
    closeModal(contractModal);
  });

  // Handle Confirm Delete
  document.getElementById('confirmDeleteContractBtn').addEventListener('click', () => {
    if (currentContractId) {
      contracts = contracts.filter(c => c.id !== currentContractId);
      renderContracts();
    }
    closeModal(deleteContractModal);
  });

  // Table buttons delegation
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const contractId = btn.dataset.id;
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    if (action === 'edit') {
      currentContractId = contractId;
      document.getElementById('contractModalTitle').textContent = 'تعديل العقد';
      document.getElementById('contractFormId').value = contract.id;
      document.getElementById('contractFormType').value = contract.type;
      document.getElementById('contractFormStart').value = contract.startDate.includes('/') ? contract.startDate.split('/').reverse().join('-') : contract.startDate;
      document.getElementById('contractFormEnd').value = contract.endDate.includes('/') ? contract.endDate.split('/').reverse().join('-') : contract.endDate;
      document.getElementById('contractFormValue').value = contract.value;
      document.getElementById('contractFormStatus').value = contract.status;
      openModal(contractModal);
    } else if (action === 'view') {
      const st = contractStatusMap[contract.status] || { text: contract.status, cls: 'bg-slate-100 text-slate-700' };
      document.getElementById('viewContractContent').innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <span class="text-slate-400">رقم العقد</span>
          <strong class="text-slate-900">${contract.id}</strong>
        </div>
        <div class="flex items-center justify-between border-b border-slate-100 py-3">
          <span class="text-slate-400">نوع العقد</span>
          <strong class="text-slate-900">${contract.type}</strong>
        </div>
        <div class="flex items-center justify-between border-b border-slate-100 py-3">
          <span class="text-slate-400">تاريخ البداية</span>
          <strong class="text-slate-900">${contract.startDate}</strong>
        </div>
        <div class="flex items-center justify-between border-b border-slate-100 py-3">
          <span class="text-slate-400">تاريخ النهاية</span>
          <strong class="text-slate-900">${contract.endDate}</strong>
        </div>
        <div class="flex items-center justify-between border-b border-slate-100 py-3">
          <span class="text-slate-400">قيمة العقد</span>
          <strong class="text-slate-900">${contract.value}</strong>
        </div>
        <div class="flex items-center justify-between pt-3">
          <span class="text-slate-400">الحالة</span>
          <span class="rounded-full px-3 py-1 text-xs font-black ${st.cls}">${st.text}</span>
        </div>
      `;
      openModal(viewContractModal);
    } else if (action === 'delete') {
      currentContractId = contractId;
      openModal(deleteContractModal);
    }
  });

  // Notes
  document.getElementById('clientNotes').textContent = client.notes || 'لا توجد ملاحظات.';
});
