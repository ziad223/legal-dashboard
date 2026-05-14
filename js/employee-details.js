/* Employee Details Logic */

const roleText = {
  admin: 'المشرف',
  lawyer: 'محامي',
  none: '--'
};

const roleDesc = {
  admin: 'صلاحيات كاملة على النظام وإدارة كافة الموظفين والعملاء والمحتوى.',
  lawyer: 'صلاحيات لإدارة القضايا الخاصة به والتواصل مع العملاء المرتبطين به فقط.',
  none: 'لا توجد صلاحيات محددة، حساب قيد المراجعة أو معلق.'
};

const statusMap = {
  active: { text: 'نشط', cls: 'bg-emerald-100 text-emerald-700' },
  unverified: { text: 'غير موثق', cls: 'bg-red-100 text-red-700' },
  disabled: { text: 'موقوف', cls: 'bg-slate-200 text-slate-700' }
};

// Re-using the same demo data
const employees = [
  { id: 1, name: 'super admin', email: 'admin@ecit.com.sa', phone: '+966 500 000 001', role: 'admin', status: 'active', notes: 'مدير النظام الرئيسي.', joined: '01/01/2026' },
  { id: 2, name: 'test test', email: '', phone: '+966 500 000 002', role: 'lawyer', status: 'active', notes: 'موظف تجريبي.', joined: '02/01/2026' },
  { id: 19, name: 'eman eman', email: 'phone.local@0900000000', phone: '+966 500 000 019', role: 'lawyer', status: 'active', notes: 'محامي داخل النظام.', joined: '03/01/2026' },
  { id: 21, name: 'nady nady', email: 'phone.local@0900000002', phone: '+966 500 000 021', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.', joined: '04/01/2026' },
  { id: 23, name: 'mohammed mohammed', email: 'phone.local@0900000004', phone: '+966 500 000 023', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.', joined: '05/01/2026' },
  { id: 24, name: 'bebo bebo', email: 'phone.local@0900000006', phone: '+966 500 000 024', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.', joined: '06/01/2026' },
  { id: 25, name: 'emem emem', email: 'phone.local@90000000', phone: '+966 500 000 025', role: 'none', status: 'unverified', notes: 'حساب غير موثق.', joined: '07/01/2026' }
];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const emp = employees.find(e => e.id === id);

  if (!emp) {
    document.getElementById('empName').textContent = 'الموظف غير موجود';
    return;
  }

  // Populate data
  document.getElementById('empName').textContent = emp.name;
  document.getElementById('empRoleText').textContent = roleText[emp.role] || '--';
  document.getElementById('empPhone').textContent = emp.phone || '--';
  document.getElementById('empEmail').textContent = emp.email || '--';
  document.getElementById('empJoined').textContent = emp.joined || '--';
  
  // Status Badge
  const st = statusMap[emp.status];
  const badge = document.getElementById('empStatusBadge');
  if (st) {
    badge.textContent = st.text;
    badge.className = `w-fit rounded-full px-5 py-2 text-sm font-black ${st.cls}`;
  }

  // Role Description
  document.getElementById('empRoleTitle').textContent = roleText[emp.role] || '--';
  document.getElementById('empRoleDesc').textContent = roleDesc[emp.role] || '--';

  // Notes
  document.getElementById('empNotes').textContent = emp.notes || 'لا توجد ملاحظات.';
});
