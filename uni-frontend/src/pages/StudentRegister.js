import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Hash, Lock, GraduationCap, AlertCircle } from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_id: '',
        email: '',
        password: '',
        full_name: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        
        const idRegex = /^1[0-9]{5}$/; 
       if (!idRegex.test(formData.student_id)) {
            return Swal.fire('خطأ في التحقق', 'يجب أن يبدأ الرقم الجامعي بـ 1 ويتكون من 6 أرقام.', 'warning');
        }

        if (!formData.email.endsWith('@just.edu.jo')) {
            return Swal.fire('هوية غير صالحة', 'يجب استخدام البريد الإلكتروني الرسمي للجامعة (@just.edu.jo).', 'error');
        }

        try {
            const res = await api.createStudent(formData); 
            if (res.data.status === 'success') {
                Swal.fire('تم إنشاء الحساب', 'أهلاً بك في نظام المحاكاة، يمكنك الآن تسجيل الدخول.', 'success');
                navigate('/student-login');
            } else {
                Swal.fire('فشل التسجيل', res.data.message, 'error');
            }
        } catch (err) {
            
            let errorMessage = "حدث خطأ غير متوقع في السيرفر"; 

            
            if (err.response && err.response.data && err.response.data.errors) {
                
                errorMessage = err.response.data.errors[0];
            } 
            
            else if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }

            Swal.fire('فشل في السيرفر', errorMessage, 'error');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}><UserPlus color="#fff" size={32} /></div>
                    <h2 style={styles.title}>إنشاء حساب طالب جديد</h2>
                    <p style={styles.subtitle}>بوابة جامعة العلوم والتكنولوجيا الأردنية</p>
                </div>

                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Hash size={16} /> الرقم الجامعي:</label>
                        <input name="student_id" placeholder="1XXXXX" style={styles.input} onChange={handleChange} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Mail size={16} /> البريد الإلكتروني الجامعي:</label>
                        <input name="email" type="email" placeholder="username@just.edu.jo" style={styles.input} onChange={handleChange} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Lock size={16} /> كلمة المرور:</label>
                        <input name="password" type="password" placeholder="********" style={styles.input} onChange={handleChange} required />
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
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', padding: '20px' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' },
    header: { textAlign: 'center', marginBottom: '30px' },
    iconCircle: { backgroundColor: '#10b981', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
    title: { fontSize: '24px', color: '#1e293b', fontWeight: 'bold' },
    subtitle: { color: '#64748b', fontSize: '14px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569', fontWeight: '600', fontSize: '14px' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', transition: '0.3s' },
    registerBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
    link: { color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }
};

export default StudentRegister;