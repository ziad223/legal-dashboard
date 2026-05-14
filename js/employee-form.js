/* Employee Form Logic */

// Demo Data (Simulating database for the form)
const employees = [
  { id: 1, name: 'super admin', email: 'admin@ecit.com.sa', phone: '+966 500 000 001', role: 'admin', status: 'active', notes: 'مدير النظام الرئيسي.' },
  { id: 2, name: 'test test', email: '', phone: '+966 500 000 002', role: 'lawyer', status: 'active', notes: 'موظف تجريبي.' },
  { id: 19, name: 'eman eman', email: 'phone.local@0900000000', phone: '+966 500 000 019', role: 'lawyer', status: 'active', notes: 'محامي داخل النظام.' },
  { id: 21, name: 'nady nady', email: 'phone.local@0900000002', phone: '+966 500 000 021', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.' },
  { id: 23, name: 'mohammed mohammed', email: 'phone.local@0900000004', phone: '+966 500 000 023', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.' },
  { id: 24, name: 'bebo bebo', email: 'phone.local@0900000006', phone: '+966 500 000 024', role: 'none', status: 'active', notes: 'لم يتم تحديد الصلاحية.' },
  { id: 25, name: 'emem emem', email: 'phone.local@90000000', phone: '+966 500 000 025', role: 'none', status: 'unverified', notes: 'حساب غير موثق.' }
];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  
  const formHeaderTitle = document.getElementById('formHeaderTitle');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  const saveBtn = document.getElementById('saveEmployeeBtn');
  const form = document.getElementById('employeeForm');

  if (id) {
    // Edit Mode
    const employee = employees.find(e => e.id === id);
    if (employee) {
      formHeaderTitle.textContent = 'تعديل بيانات الموظف';
      breadcrumbTitle.textContent = 'تعديل موظف';
      
      document.getElementById('formName').value = employee.name;
      document.getElementById('formEmail').value = employee.email;
      document.getElementById('formPhone').value = employee.phone || '';
      document.getElementById('formRole').value = employee.role;
      document.getElementById('formStatus').value = employee.status;
      document.getElementById('formNotes').value = employee.notes || '';
    } else {
      // Not found
      formHeaderTitle.textContent = 'الموظف غير موجود';
      saveBtn.disabled = true;
      saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API call and saving
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
    saveBtn.disabled = true;

    setTimeout(() => {
      // Redirect back to employees list after "saving"
      window.location.href = 'employees.html';
    }, 800);
  });
});
