import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Hash, Lock } from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ student_id: '', password: '' });

    const selectedUniId = localStorage.getItem('selected_uni_id');
    const selectedUniName = localStorage.getItem('global_university_name') || 'الجامعة';

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!selectedUniId) {
            return Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى العودة لصفحة البداية واختيار الجامعة أولاً.',
                confirmButtonColor: '#10b981'
            });
        }


        const payload = {
            ...loginData,
            uni_id: selectedUniId
        };

        try {
            const res = await api.loginStudent(payload); 
            
            if (res.data.status === 'success') {
                const targetDeptId = localStorage.getItem('target_dept_id');
                const userDeptId = res.data.user.dept_id;

                if (targetDeptId && targetDeptId != userDeptId) {
                    Swal.fire({
                        icon: 'error',
                        title: 'بوابة خاطئة',
                        text: 'عذراً، أنت تحاول الدخول من بوابة قسم لا تتبع له. يرجى العودة للرئيسية واختيار قسمك الصحيح.',
                        confirmButtonColor: '#ef4444'
                    });
                    return; 
                }
                Swal.fire({ 
                    icon: 'success', 
                    title: 'تم تسجيل الدخول بنجاح', 
                    text: `أهلاً بك في نظام ${selectedUniName}`,
                    timer: 1500, 
                    showConfirmButton: false 
                });
                
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
                    {/* عرض اسم الجامعة  */}
                    <p style={styles.subtitle}>بوابة الطالب - {selectedUniName}</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Hash size={16} /> الرقم الجامعي:</label>
                        {/* */}
                        <input 
                            placeholder="أدخل رقمك الجامعي" 
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
    container: { 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px', 
        fontFamily: 'Tajawal, sans-serif', 
        direction: 'rtl' 
    },
    card: { 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '40px', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        border: '1px solid rgba(255, 255, 255, 0.6)',
        width: '100%', 
        maxWidth: '420px', 
        textAlign: 'right' 
    },
    header: { 
        textAlign: 'center', 
        marginBottom: '35px' 
    },
    iconCircle: { 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
        width: '70px', 
        height: '70px', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 15px',
        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
    },
    title: { 
        fontSize: '26px', 
        color: '#0f172a', 
        fontWeight: '900', 
        marginBottom: '8px' 
    },
    subtitle: { 
        color: '#475569', 
        fontSize: '14px', 
        fontWeight: '500' 
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px' 
    },
    label: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: '#334155', 
        fontWeight: 'bold', 
        fontSize: '14px' 
    },
    input: { 
        width: '100%', 
        padding: '14px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255, 255, 255, 0.8)', 
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        backdropFilter: 'blur(10px)',
        outline: 'none', 
        transition: 'all 0.3s ease', 
        textAlign: 'right', 
        boxSizing: 'border-box',
        color: '#1e293b', 
        fontSize: '15px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
    },
    loginBtn: { 
        width: '100%', 
        padding: '16px', 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '12px', 
        fontWeight: 'bold', 
        fontSize: '16px', 
        cursor: 'pointer', 
        transition: 'all 0.3s ease', 
        marginTop: '10px',
        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)'
    },
    footer: { 
        marginTop: '25px', 
        textAlign: 'center', 
        fontSize: '14px', 
        color: '#475569', 
        fontWeight: '500' 
    },
    link: { 
        color: '#059669', 
        textDecoration: 'none', 
        fontWeight: 'bold', 
        transition: 'color 0.3s ease' 
    }
};

export default StudentLogin;