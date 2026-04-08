import React, { useState, useEffect } from 'react';
import { 
    School, UserCog, Users, UserPlus, Trash2, Edit, 
    Search, Mail, Hash, X, Save, KeyRound, ChevronLeft, LayoutDashboard, Settings
} from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const [view, setView] = useState('depts'); // 'depts' or 'students'
    const [selectedDept, setSelectedDept] = useState(null); // القسم المفتوح حالياً
    const [departments, setDepartments] = useState([]);
    const [allStaff, setAllStaff] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    
    // Forms
    const [staffForm, setStaffForm] = useState({
        official_id: '', name: '', email: '', password: '', role: 'clerk', dept_id: ''
    });
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [studentForm, setStudentForm] = useState({ student_id: '', name: '', email: '', password: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
    try {
        const [deptRes, staffRes, studentRes] = await Promise.all([
            api.getDepartments(),
            api.getStaff(),
            api.getAdminStudents()
        ]);
        
        console.log("بيانات الأقسام:", deptRes.data);
        console.log("بيانات الموظفين:", staffRes.data);
        
        setDepartments(deptRes.data);
        setAllStaff(staffRes.data);
        setStudents(studentRes.data);
    } catch (err) { console.error("Error fetching data", err); }
};

    

const getDeptStaff = (role) => {
    if (!selectedDept || !allStaff) return [];
    
    return allStaff.filter(s => {
       
        const staffDeptId = Number(s.dept_id);
        const selectedId = Number(selectedDept.dept_id);
        
        return staffDeptId === selectedId && s.role === role;
    });
};

    const handleSaveStaff = async (e) => {
        e.preventDefault();
        try {
            const data = { ...staffForm, dept_id: selectedDept.dept_id };
            let res = editingStaffId 
                ? await api.updateStaff(editingStaffId, data)
                : await api.addStaff(data);

            if (res.data.status === 'success') {
                Swal.fire('نجاح', 'تم حفظ بيانات الكادر بنجاح', 'success');
                setShowStaffModal(false);
                fetchData();
            }
        } catch (err) { Swal.fire('خطأ', 'حدث خلل أثناء الحفظ', 'error'); }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await api.updateStudent(studentForm.student_id, studentForm);
            if (res.data.status === 'success') {
                Swal.fire('تم التحديث', 'تم تغيير بيانات الطالب بنجاح', 'success');
                setShowStudentModal(false);
                fetchData();
            }
        } catch (err) { Swal.fire('خطأ', 'فشل تحديث بيانات الطالب', 'error'); }
    };

    const deleteStaff = async (staffId) => {
    // بنطلع تنبيه تأكيد قبل الحذف (Swal)
    const result = await Swal.fire({
        title: 'متأكد بدك تحذفه؟',
        text: "هاد الإجراء ما فيه رجعة يا غالي!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'آه، احذفه',
        cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
        try {
            // بننادي الـ API اللي ضفناه
            const res = await api.deleteStaff(staffId); 
            if (res.data.status === 'success') {
                Swal.fire('تم الحذف!', 'الموظف طار من السيستم.', 'success');
                fetchData(); // بنحدث القائمة مشان يختفي من قدامنا
            }
        } catch (err) {
            Swal.fire('خطأ', 'صار مشكلة بالاتصال بالسيرفر', 'error');
        }
    }
};

    return (
        <div style={styles.container}>
            {/* Sidebar / Navigation */}
            <div style={styles.sidebar}>
                <div style={styles.logoSection}><Settings size={28}/> <span>لوحة الإدارة العليا</span></div>
                <button onClick={() => {setView('depts'); setSelectedDept(null);}} style={view === 'depts' ? styles.navActive : styles.navBtn}><School size={20}/> الأقسام والكادر</button>
                <button onClick={() => setView('students')} style={view === 'students' ? styles.navActive : styles.navBtn}><Users size={20}/> إدارة الطلاب</button>
            </div>

            <div style={styles.main}>
                {/* 1. عرض الأقسام ككروت */}
                {view === 'depts' && !selectedDept && (
                    <div style={styles.content}>
                        <h2 style={styles.pageTitle}>الأقسام الأكاديمية جامعة العلوم والتكنولجيا الاردنية</h2>
                        <div style={styles.deptGrid}>
                            {departments.map(dept => (
                                <div key={dept.dept_id} style={styles.deptCard} onClick={() => setSelectedDept(dept)}>
                                    <div style={styles.deptIcon}><School size={40} color="#2563eb"/></div>
                                    <h3 style={styles.deptName}>{dept.dept_name}</h3>
                                    <p style={styles.deptSub}>إدارة رئيس القسم والمدخلين</p>
                                    <div style={styles.deptArrow}><ChevronLeft size={20}/></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. عرض تفاصيل القسم المختار */}
                {view === 'depts' && selectedDept && (
                    <div style={styles.content}>
                        <button onClick={() => setSelectedDept(null)} style={styles.backBtn}><ChevronLeft/> العودة للأقسام</button>
                        <h2 style={styles.pageTitle}>إدارة قسم: {selectedDept.dept_name}</h2>

                        {/* قسم رئيس القسم HOD */}
                        <div style={styles.sectionBox}>
                            <div style={styles.sectionHeader}>
                                <h3><UserCog color="#2563eb"/> رئيس القسم </h3>
                                {getDeptStaff('hod').length === 0 && (
                                    <button style={styles.addMiniBtn} onClick={() => { setEditingStaffId(null); setStaffForm({role:'hod', official_id:'', name:'', email:'', password:''}); setShowStaffModal(true); }}><UserPlus size={16}/> تعيين رئيس جديد</button>
                                )}
                            </div>
                            {getDeptStaff('hod').map(hod => (
                                <div key={hod.staff_id} style={styles.infoRow}>
                                    <div style={styles.infoCell}><b>الاسم:</b> {hod.name}</div>
                                    <div style={styles.infoCell}><b>المعرف:</b> {hod.official_id}</div>
                                    <div style={styles.infoCell}><b>الإيميل:</b> {hod.email}</div>
                                    <div style={styles.actions}>
                                        <button style={styles.editIconBtn} onClick={() => { setEditingStaffId(hod.staff_id); setStaffForm(hod); setShowStaffModal(true); }}><Edit size={16}/></button>
                                    
                                    </div>
                                </div>
                            ))}
                            {getDeptStaff('hod').length === 0 && <p style={styles.empty}>لا يوجد رئيس معين لهذا القسم حالياً.</p>}
                        </div>

                        {/* قسم مدخلي البيانات Clerks */}
                        <div style={styles.sectionBox}>
                            <div style={styles.sectionHeader}>
                                <h3><LayoutDashboard color="#10b981"/> مدخلي البيانات</h3>
                                <button style={styles.addMiniBtnGreen} onClick={() => { setEditingStaffId(null); setStaffForm({role:'clerk', official_id:'', name:'', email:'', password:''}); setShowStaffModal(true); }}><UserPlus size={16}/> إضافة مدخل بيانات</button>
                            </div>
                            <table style={styles.table}>
                                <thead>
                                    <tr><th>المعرف (وظيفي/جامعي)</th><th>الاسم</th><th>الإيميل</th><th>التحكم</th></tr>
                                </thead>
                                <tbody>
                                    {getDeptStaff('clerk').map(clerk => (
                                        <tr key={clerk.staff_id}>
                                            <td>{clerk.official_id}</td>
                                            <td>{clerk.name}</td>
                                            <td>{clerk.email}</td>
                                            <td>
                                                <button style={styles.editIconBtn} onClick={() => { setEditingStaffId(clerk.staff_id); setStaffForm(clerk); setShowStaffModal(true); }}><Edit size={14}/></button>
                                                <button style={styles.delIconBtn} onClick={() => deleteStaff(clerk.staff_id)}><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {getDeptStaff('clerk').length === 0 && <p style={styles.empty}>لم يتم تعيين مدخلي بيانات لهذا القسم بعد.</p>}
                        </div>
                    </div>
                )}

                {/* 3. إدارة الطلاب */}
                {view === 'students' && (
                    <div style={styles.content}>
                        <div style={styles.headerRow}>
                            <h2 style={styles.pageTitle}>إدارة شؤون الطلاب</h2>
                            <div style={styles.searchBar}><Search size={18}/> <input placeholder="ابحث باسم الطالب أو رقمه..." onChange={e => setSearchTerm(e.target.value)} /></div>
                        </div>
                        <table style={styles.table}>
                            <thead><tr><th>الرقم الجامعي</th><th>الاسم</th><th>الإيميل</th><th>الإجراء</th></tr></thead>
                            <tbody>
                                {students.filter(s => s.name.includes(searchTerm) || s.student_id.includes(searchTerm)).map(s => (
                                    <tr key={s.student_id}>
                                        <td>{s.student_id}</td>
                                        <td>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td><button style={styles.pwdBtn} onClick={() => { setStudentForm(s); setShowStudentModal(true); }}><KeyRound size={14}/> تعديل / باسوورد</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showStaffModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHead}><h3>{editingStaffId ? 'تعديل البيانات' : 'إضافة كادر جديد'}</h3> <button onClick={() => setShowStaffModal(false)}><X/></button></div>
                        <form onSubmit={handleSaveStaff} style={styles.form}>
                            <input placeholder="المعرف (رقم وظيفي أو جامعي)" value={staffForm.official_id} onChange={e => setStaffForm({...staffForm, official_id: e.target.value})} required />
                            <input placeholder="الاسم الكامل" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} required />
                            <input placeholder="الإيميل" type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} required />
                            <input placeholder={editingStaffId ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"} type="password" onChange={e => setStaffForm({...staffForm, password: e.target.value})} required={!editingStaffId} />
                            <button type="submit" style={styles.saveBtn}>حفظ البيانات</button>
                        </form>
                    </div>
                </div>
            )}

            {showStudentModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHead}><h3>تعديل حساب الطالب: {studentForm.name}</h3> <button onClick={() => setShowStudentModal(false)}><X/></button></div>
                        <form onSubmit={handleUpdateStudent} style={styles.form}>
                            <input value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                            <input type="password" placeholder="تعيين باسوورد جديد..." onChange={e => setStudentForm({...studentForm, password: e.target.value})} />
                            <button type="submit" style={styles.saveBtn}>تحديث البيانات</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' },
    sidebar: { width: '260px', backgroundColor: '#1e293b', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    logoSection: { fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '20px' },
    navBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'right', borderRadius: '8px' },
    navActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#2563eb', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold' },
    main: { flex: 1, padding: '40px', overflowY: 'auto' },
    content: { maxWidth: '1100px', margin: '0 auto' },
    pageTitle: { fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '30px' },
    deptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
    deptCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' },
    deptName: { fontSize: '18px', fontWeight: 'bold', margin: '15px 0 5px 0' },
    deptSub: { fontSize: '13px', color: '#64748b' },
    deptArrow: { position: 'absolute', left: '20px', bottom: '20px', color: '#cbd5e1' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' },
    sectionBox: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', alignItems: 'center' },
    actions: { display: 'flex', gap: '10px' },
    editIconBtn: { padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer' },
    delIconBtn: { padding: '8px', border: 'none', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' },
    addMiniBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    addMiniBtnGreen: { display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', backgroundColor: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    pwdBtn: { padding: '6px 12px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
    modal: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '400px' },
    modalHead: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    saveBtn: { padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    empty: { textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '10px' }
};

export default AdminDashboard;