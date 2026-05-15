import React, { useState } from 'react';
import { api } from '../../api/api';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

const CatalogTab = ({ catalog, styles, fetchData }) => {
    const [editingId, setEditingId] = useState(null);
    const [courseForm, setCourseForm] = useState({
        course_code: '', title: '', line_number: '', 
        credit_hours: 3, theory_hours: 0, practical_hours: 0
    });

    const handleEditClick = (course) => {
        setEditingId(course.course_id);
        setCourseForm({
            course_code: course.course_code,
            title: course.title,
            line_number: course.line_number || '',
            credit_hours: course.credit_hours,
            theory_hours: course.theory_hours,
            practical_hours: course.practical_hours
        });
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setCourseForm({ course_code: '', title: '', line_number: '', credit_hours: 3, theory_hours: 0, practical_hours: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const deptId = localStorage.getItem('dept_id');
        const payload = { ...courseForm, dept_id: deptId };

        try {
            let res;
            if (editingId) {
                res = await api.updateCourse(editingId, payload);
            } else {
                res = await api.addCourse(payload);
            }

            if (res.data.status === 'success') {
                Swal.fire({ icon: 'success', title: 'تمت العملية', text: res.data.message, timer: 1500, showConfirmButton: false });
                resetForm();
                if (fetchData) fetchData();
            } else {
                Swal.fire('تنبيه', res.data.message, 'warning');
            }
        } catch (err) {
            Swal.fire('خطأ', 'فشل الاتصال بالسيرفر', 'error');
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من استعادة هذه المادة من المكتبة!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذفها',
            cancelButtonText: 'تراجع',
            confirmButtonColor: '#ef4444'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await api.deleteCourse(id);
                if (res.data.status === 'success') {
                    Swal.fire('تم الحذف', res.data.message, 'success');
                    fetchData();
                } else {
                    Swal.fire('فشل الحذف', res.data.message, 'error');
                }
            } catch (err) {
                Swal.fire('خطأ', 'حدث خلل فني أثناء الحذف', 'error');
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <style>
                {`
                    input[type=number]::-webkit-inner-spin-button, 
                    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            <div style={styles.card}>
                <div style={styles.tableContainer}>
                    <div style={styles.gridHeaderFixed}>
                        <div style={{flex: 1}}>الرمز</div>
                        <div style={{flex: 3}}>اسم المادة</div>
                        <div style={{flex: 1}}>السطر</div>
                        <div style={{flex: 0.6}}>ساعة</div>
                        <div style={{flex: 0.6}}>نظري</div>
                        <div style={{flex: 0.6}}>عملي</div>
                        <div style={{flex: 1, textAlign: 'center'}}>إجراءات</div>
                    </div>

                    <div style={styles.scrollArea}>
                        {catalog.map(c => (
                            <div key={c.course_id} style={{...styles.gridRowFixed, backgroundColor: editingId === c.course_id ? '#eff6ff' : 'transparent'}}>
                                <div style={{flex: 1, fontWeight:'bold', color:'#2563eb'}}>{c.course_code}</div>
                                <div style={{flex: 3}}>{c.title}</div>
                                <div style={{flex: 1, color: '#64748b'}}>{c.line_number || '---'}</div>
                                <div style={{flex: 0.6}}>{c.credit_hours}</div>
                                <div style={{flex: 0.6}}>{c.theory_hours}</div>
                                <div style={{flex: 0.6}}>{c.practical_hours}</div>
                                <div style={{flex: 1, display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                    <button onClick={() => handleEditClick(c)} style={{...styles.editBtn, padding: '6px'}} title="تعديل"><Edit size={14}/></button>
                                    <button onClick={() => handleDelete(c.course_id)} style={{...styles.delIconBtn, padding: '6px'}} title="حذف"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{...styles.card, borderTop: `5px solid ${editingId ? '#f59e0b' : '#2563eb'}`}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>{editingId ? 'تعديل بيانات المادة' : 'إضافة مادة جديدة للمكتبة'}</h3>
                    {editingId && <button onClick={resetForm} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontSize:'13px', fontWeight:'bold'}}><X size={16}/> إلغاء التعديل</button>}
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 120px' }}><label style={styles.label}>الرمز:</label><input style={styles.inputField} value={courseForm.course_code} onChange={e => setCourseForm({...courseForm, course_code: e.target.value})} required /></div>
                    <div style={{ flex: '2 1 200px' }}><label style={styles.label}>الاسم:</label><input style={styles.inputField} value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required /></div>
                    <div style={{ flex: '1 1 100px' }}><label style={styles.label}>السطر:</label><input type="number" style={styles.inputField} value={courseForm.line_number} onChange={e => setCourseForm({...courseForm, line_number: e.target.value})} /></div>
                    <div style={{ width: '70px' }}><label style={styles.label}>ساعات:</label><input type="number" style={styles.inputField} value={courseForm.credit_hours} onChange={e => setCourseForm({...courseForm, credit_hours: e.target.value})} required /></div>
                    <div style={{ width: '70px' }}><label style={styles.label}>نظري:</label><input type="number" style={styles.inputField} value={courseForm.theory_hours} onChange={e => setCourseForm({...courseForm, theory_hours: e.target.value})} /></div>
                    <div style={{ width: '70px' }}><label style={styles.label}>عملي:</label><input type="number" style={styles.inputField} value={courseForm.practical_hours} onChange={e => setCourseForm({...courseForm, practical_hours: e.target.value})} /></div>
                    
                    <button type="submit" style={{...styles.addBtn, backgroundColor: editingId ? '#f59e0b' : '#2563eb', color: 'white', height: '42px', flex: '1 1 150px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: 'none', fontWeight: '600'}}>
                        {editingId ? <><Save size={18} /> حفظ التغييرات</> : <><Plus size={18} /> حفظ في المكتبة</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CatalogTab;