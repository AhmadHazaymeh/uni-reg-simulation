import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Hash, Lock, GraduationCap, AlertCircle, User, Calendar, BookOpen } from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';

const StudentRegister = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        student_id: '',
        name: '',
        email: '',
        password: '',
        year_level: '1', 
        plan_id: ''
    });

    const [plans, setPlans] = useState([]); 

    const selectedUniId = localStorage.getItem('selected_uni_id');
    const selectedUniName = localStorage.getItem('global_university_name') || 'الجامعة';
    const selectedDeptId = localStorage.getItem('target_dept_id'); 

    useEffect(() => {
        if (selectedDeptId) {
           
            api.getPlans(selectedDeptId)
                .then(res => {
                    const fetchedPlans = res.data || [];
                    setPlans(fetchedPlans);

                    if (fetchedPlans.length > 0) {
                        setFormData(prev => ({ ...prev, plan_id: fetchedPlans[0].plan_id }));
                    }
                })
                .catch(err => console.error("Error fetching plans", err));
        }
    }, [selectedDeptId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!selectedUniId || !selectedDeptId) {
            return Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى العودة لصفحة البداية واختيار الجامعة والقسم أولاً.',
                confirmButtonColor: '#10b981'
            });
        }

        const selectedPlanName = plans.find(p => String(p.plan_id) === String(formData.plan_id))?.plan_name || 'غير محدد';

        const payload = {
            ...formData,
            uni_id: selectedUniId,
            dept_id: selectedDeptId,
            specialization: selectedPlanName
        };

        try {
            const res = await api.createStudent(payload); 
            if (res.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'تم إنشاء الحساب',
                    text: `أهلاً بك يا ${formData.name} في نظام ${selectedUniName}، يمكنك الآن تسجيل الدخول.`,
                    confirmButtonColor: '#10b981'
                });
                navigate('/student-login');
            } else {
                Swal.fire('فشل التسجيل', res.data.message, 'error');
            }
        } catch (err) {
            let errorMessage = "حدث خطأ غير متوقع في السيرفر"; 

            if (err.response && err.response.data && err.response.data.errors) {
                errorMessage = err.response.data.errors[0];
            } else if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }

            Swal.fire('فشل في التسجيل', errorMessage, 'error');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}><UserPlus color="#fff" size={32} /></div>
                    <h2 style={styles.title}>إنشاء حساب طالب جديد</h2>
                    <p style={styles.subtitle}>بوابة التسجيل - {selectedUniName}</p>
                </div>

                <form onSubmit={handleRegister} style={styles.form}>
                    
                    {/*  الاسم  */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><User size={16} /> الاسم الكامل:</label>
                        <input name="name" placeholder="أدخل اسمك الرباعي (مثال: أحمد هزايمة)" style={styles.input} onChange={handleChange} value={formData.name} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Hash size={16} /> الرقم الجامعي:</label>
                        <input name="student_id" placeholder="أدخل رقمك الجامعي" style={styles.input} onChange={handleChange} value={formData.student_id} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Mail size={16} /> البريد الإلكتروني الجامعي:</label>
                        <input name="email" type="email" placeholder="student@university.edu.jo" style={styles.input} onChange={handleChange} value={formData.email} required />
                    </div>

                    {/*  السنة الدراسية  */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Calendar size={16} /> السنة الدراسية:</label>
                        <select name="year_level" style={styles.input} onChange={handleChange} value={formData.year_level} required>
                            <option value="1">سنة أولى</option>
                            <option value="2">سنة ثانية</option>
                            <option value="3">سنة ثالثة</option>
                            <option value="4">سنة رابعة (خريج)</option>
                            <option value="5">سنة خامسة</option>
                        </select>
                    </div>

                    {/*  الخطة الدراسية  */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><BookOpen size={16} /> الخطة الدراسية:</label>
                        <select name="plan_id" style={styles.input} onChange={handleChange} value={formData.plan_id} required>
                            <option value="" disabled>-- اختر خطتك الدراسية --</option>
                            {plans.map(p => (
                                <option key={p.plan_id} value={p.plan_id}>{p.plan_name}</option>
                            ))}
                        </select>
                        {plans.length === 0 && <span style={{fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block'}}>جاري جلب الخطط أو لا توجد خطط مضافة لقسمك حالياً.</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Lock size={16} /> كلمة المرور:</label>
                        <input name="password" type="password" placeholder="********" style={styles.input} onChange={handleChange} value={formData.password} required />
                    </div>

                    <button type="submit" style={styles.registerBtn}>تفعيل الحساب والانتساب</button>
                    
                    <div style={styles.footer}>
                        لديك حساب بالفعل؟ <Link to="/student-login" style={styles.link}>تسجيل الدخول</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', padding: '20px', fontFamily: 'Tajawal, sans-serif' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '480px', textAlign: 'right', direction: 'rtl' },
    header: { textAlign: 'center', marginBottom: '30px' },
    iconCircle: { backgroundColor: '#10b981', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
    title: { fontSize: '24px', color: '#1e293b', fontWeight: 'bold' },
    subtitle: { color: '#64748b', fontSize: '14px', marginTop: '5px' },
    inputGroup: { marginBottom: '15px' }, 
    label: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569', fontWeight: '600', fontSize: '14px' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', transition: '0.3s', textAlign: 'right', fontFamily: 'Tajawal, sans-serif', fontSize: '14px', backgroundColor: '#fff' },
    registerBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '15px', fontFamily: 'Tajawal, sans-serif' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
    link: { color: '#10b981', textDecoration: 'none', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column' }
};

export default StudentRegister;