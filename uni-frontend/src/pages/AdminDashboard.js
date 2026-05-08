import React, { useState, useEffect } from 'react';
import { 
    School, UserCog, Users, UserPlus, Trash2, Edit, 
    Search, Mail, Hash, X, Save, KeyRound, ChevronLeft, LayoutDashboard, Settings
} from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const [view, setView] = useState('depts'); 
    const [selectedDept, setSelectedDept] = useState(null); 
    const [departments, setDepartments] = useState([]);
    const [allStaff, setAllStaff] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [uniName, setUniName] = useState('');

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
        const selectedUniName = localStorage.getItem('global_university_name');
        setUniName(selectedUniName || 'الجامعة');
        fetchData();
    }, []);

    const fetchData = async () => {
        const uniId = localStorage.getItem('selected_uni_id');
        if (!uniId) {
            Swal.fire('تنبيه', 'يرجى اختيار الجامعة من الصفحة الرئيسية أولاً', 'warning');
            return;
        }

        try {
            const [deptRes, staffRes, studentRes] = await Promise.all([
                api.getDepartments(uniId),
                api.getStaff(uniId),
                api.getAdminStudents(uniId)
            ]);
            
            setDepartments(deptRes.data || []);
            setAllStaff(staffRes.data || []);
            setStudents(studentRes.data || []);
        } catch (err) { 
            console.error("Error fetching data", err);
        }
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
            const uniId = localStorage.getItem('selected_uni_id');
            const data = { 
                ...staffForm, 
                dept_id: selectedDept.dept_id,
                uni_id: uniId 
            };
            
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
                const res = await api.deleteStaff(staffId); 
                if (res.data.status === 'success') {
                    Swal.fire('تم الحذف!', 'الموظف طار من السيستم.', 'success');
                    fetchData(); 
                }
            } catch (err) {
                Swal.fire('خطأ', 'صار مشكلة بالاتصال بالسيرفر', 'error');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.logoSection}><Settings size={28}/> <span>لوحة إدارة {uniName}</span></div>
                <button onClick={() => {setView('depts'); setSelectedDept(null);}} style={view === 'depts' ? styles.navActive : styles.navBtn}><School size={20}/> الأقسام والكادر</button>
                <button onClick={() => setView('students')} style={view === 'students' ? styles.navActive : styles.navBtn}><Users size={20}/> إدارة الطلاب</button>
            </div>

            <div style={styles.main}>
                {view === 'depts' && !selectedDept && (
                    <div style={styles.content}>
                        <h2 style={styles.pageTitle}>الأقسام الأكاديمية - {uniName}</h2>
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

                {view === 'depts' && selectedDept && (
                    <div style={styles.content}>
                        <button onClick={() => setSelectedDept(null)} style={styles.backBtn}><ChevronLeft size={18}/> العودة للأقسام</button>
                        <h2 style={styles.pageTitle}>إدارة قسم: {selectedDept.dept_name}</h2>

                        {/* قسم رئيس القسم HOD */}
                        <div style={styles.sectionBox}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}><UserCog color="#2563eb"/> رئيس القسم</h3>
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
                                        <button style={styles.delIconBtn} onClick={() => deleteStaff(hod.staff_id)}><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                            {getDeptStaff('hod').length === 0 && <p style={styles.empty}>لا يوجد رئيس معين لهذا القسم حالياً.</p>}
                        </div>

                        {/* قسم مدخلي البيانات Clerks */}
                        <div style={styles.sectionBox}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}><LayoutDashboard color="#10b981"/> مدخلي البيانات</h3>
                                <button style={styles.addMiniBtnGreen} onClick={() => { setEditingStaffId(null); setStaffForm({role:'clerk', official_id:'', name:'', email:'', password:''}); setShowStaffModal(true); }}><UserPlus size={16}/> إضافة مدخل بيانات</button>
                            </div>
                            <table style={styles.table}>
                                <thead>
                                    <tr><th>المعرف</th><th>الاسم</th><th>الإيميل</th><th>التحكم</th></tr>
                                </thead>
                                <tbody>
                                    {getDeptStaff('clerk').map(clerk => (
                                        <tr key={clerk.staff_id}>
                                            <td style={styles.td}>{clerk.official_id}</td>
                                            <td style={styles.td}>{clerk.name}</td>
                                            <td style={styles.td}>{clerk.email}</td>
                                            <td style={styles.td}>
                                                <div style={styles.actionsCenter}>
                                                    <button style={styles.editIconBtn} onClick={() => { setEditingStaffId(clerk.staff_id); setStaffForm(clerk); setShowStaffModal(true); }}><Edit size={14}/></button>
                                                    <button style={styles.delIconBtn} onClick={() => deleteStaff(clerk.staff_id)}><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {getDeptStaff('clerk').length === 0 && <p style={styles.empty}>لم يتم تعيين مدخلي بيانات لهذا القسم بعد.</p>}
                        </div>
                    </div>
                )}

                {view === 'students' && (
                    <div style={styles.content}>
                        <div style={styles.headerRow}>
                            <h2 style={styles.pageTitle}>إدارة شؤون طلاب {uniName}</h2>
                            <div style={styles.searchBar}><Search size={18} color="#94a3b8"/> <input style={styles.searchInput} placeholder="ابحث باسم الطالب أو رقمه..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                        </div>
                        <table style={styles.table}>
                            <thead><tr><th>الرقم الجامعي</th><th>الاسم</th><th>الإيميل</th><th>الإجراء</th></tr></thead>
                            <tbody>
                                {students.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.student_id?.includes(searchTerm)).map(s => (
                                    <tr key={s.student_id}>
                                        <td style={styles.td}>{s.student_id}</td>
                                        <td style={styles.td}>{s.name}</td>
                                        <td style={styles.td}>{s.email}</td>
                                        <td style={styles.td}><button style={styles.pwdBtn} onClick={() => { setStudentForm(s); setShowStudentModal(true); }}><KeyRound size={14}/> تعديل / باسوورد</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && <p style={styles.empty}>لا يوجد طلاب مسجلين في هذه الجامعة بعد.</p>}
                    </div>
                )}

                {/* Staff Modal */}
                {showStaffModal && (
                    <div style={styles.overlay}>
                        <div style={styles.modal}>
                            <div style={styles.modalHead}>
                                <h3 style={{margin: 0}}>{editingStaffId ? 'تعديل البيانات' : 'إضافة كادر جديد'}</h3> 
                                <button style={styles.closeBtn} onClick={() => setShowStaffModal(false)}><X size={20}/></button>
                            </div>
                            <form onSubmit={handleSaveStaff} style={styles.form}>
                                <input style={styles.input} placeholder="المعرف (رقم وظيفي أو جامعي)" value={staffForm.official_id} onChange={e => setStaffForm({...staffForm, official_id: e.target.value})} required />
                                <input style={styles.input} placeholder="الاسم الكامل" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} required />
                                <input style={styles.input} placeholder="الإيميل" type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} required />
                                <input style={styles.input} placeholder={editingStaffId ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"} type="password" onChange={e => setStaffForm({...staffForm, password: e.target.value})} required={!editingStaffId} />
                                <button type="submit" style={styles.saveBtn}>حفظ البيانات في {uniName}</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Student Modal */}
                {showStudentModal && (
                    <div style={styles.overlay}>
                        <div style={styles.modal}>
                            <div style={styles.modalHead}>
                                <h3 style={{margin: 0}}>تعديل حساب الطالب</h3> 
                                <button style={styles.closeBtn} onClick={() => setShowStudentModal(false)}><X size={20}/></button>
                            </div>
                            <form onSubmit={handleUpdateStudent} style={styles.form}>
                                <input style={styles.input} value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} placeholder="اسم الطالب" required />
                                <input style={styles.input} type="password" placeholder="تعيين باسوورد جديد (اختياري)..." onChange={e => setStudentForm({...studentForm, password: e.target.value})} />
                                <button type="submit" style={styles.saveBtn}>تحديث بيانات الطالب</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// هنا جميع الستايلات كاملة ومفصلة، لا تقم بحذف أي سطر منها!
const styles = {
    container: { display: 'flex', minHeight: '100vh', direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc' },
    sidebar: { width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '10px', fontWeight: 'bold' },
    navBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'right', borderRadius: '8px', transition: '0.3s' },
    navActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', backgroundColor: '#2563eb', color: 'white', cursor: 'pointer', textAlign: 'right', borderRadius: '8px', fontWeight: 'bold' },
    main: { flex: 1, padding: '30px', overflowY: 'auto' },
    content: { maxWidth: '1100px', margin: '0 auto' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '25px' },
    deptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    deptCard: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.3s', position: 'relative', border: '1px solid #e2e8f0' },
    deptName: { fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' },
    deptSub: { fontSize: '13px', color: '#64748b' },
    deptIcon: { marginBottom: '15px' },
    deptArrow: { position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold', fontSize: '14px' },
    sectionBox: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' },
    sectionTitle: { margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: '#1e293b' },
    addMiniBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    addMiniBtnGreen: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    infoRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '10px' },
    infoCell: { flex: 1, color: '#334155', fontSize: '14px' },
    actions: { display: 'flex', gap: '10px' },
    actionsCenter: { display: 'flex', gap: '10px', justifyContent: 'center' },
    editIconBtn: { padding: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    delIconBtn: { padding: '8px', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
    td: { padding: '15px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', fontSize: '14px', color: '#475569' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '300px' },
    searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
    pwdBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', margin: '0 auto' },
    empty: { textAlign: 'center', color: '#94a3b8', padding: '20px', margin: 0, fontSize: '14px' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: '#0f172a' },
    closeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    saveBtn: { padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '15px' }
};

export default AdminDashboard;