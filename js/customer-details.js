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

  // Contract summary
  document.getElementById('contractValue').textContent = client.contractValue || '---';
  document.getElementById('paymentMethod').textContent = client.paymentMethod || '---';
  document.getElementById('contractDuration').textContent = client.contractDuration || '---';

  // Notes
  document.getElementById('clientNotes').textContent = client.notes || 'لا توجد ملاحظات.';
});
