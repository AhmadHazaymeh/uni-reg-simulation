import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Hash, Lock } from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ student_id: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.loginStudent(loginData); 
            
            if (res.data.status === 'success') {
                Swal.fire({ icon: 'success', title: 'تم تسجيل الدخول بنجاح', timer: 1500, showConfirmButton: false });
                
                localStorage.setItem('student_token', res.data.token);
                localStorage.setItem('student_user', JSON.stringify(res.data.user));
                
                navigate('/student'); 
            } else {
                Swal.fire('خطأ في الدخول', res.data.message || 'الرقم الجامعي أو كلمة المرور غير صحيحة', 'error');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'تأكد من تشغيل السيرفر (Backend) والاتصال بالشبكة';
            Swal.fire('فشل الاتصال', errorMsg, 'error');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}><LogIn color="#fff" size={32} /></div>
                    <h2 style={styles.title}>تسجيل دخول الطالب</h2>
                    <p style={styles.subtitle}>نظام محاكاة التسجيل - بوابة الطالب</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Hash size={16} /> الرقم الجامعي:</label>
                        <input 
                            placeholder="1XXXXX" 
                            style={styles.input} 
                            value={loginData.student_id}
                            onChange={e => setLoginData({...loginData, student_id: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Lock size={16} /> كلمة المرور:</label>
                        <input 
                            type="password" 
                            placeholder="********" 
                            style={styles.input} 
                            value={loginData.password}
                            onChange={e => setLoginData({...loginData, password: e.target.value})} 
                            required 
                        />
                    </div>

                    <button type="submit" style={styles.loginBtn}>دخول النظام</button>
                    
                    <div style={styles.footer}>
                        ليس لديك حساب؟ <Link to="/student-register" style={styles.link}>إنشاء حساب جديد</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecfdf5', padding: '20px', fontFamily: 'Tajawal, sans-serif' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    header: { textAlign: 'center', marginBottom: '30px' },
    iconCircle: { backgroundColor: '#10b981', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
    title: { fontSize: '24px', color: '#1e293b', fontWeight: 'bold' },
    subtitle: { color: '#64748b', fontSize: '14px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569', fontWeight: '600', fontSize: '14px' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' },
    loginBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.3s' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
    link: { color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }
};

export default StudentLogin;