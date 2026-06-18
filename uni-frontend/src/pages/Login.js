import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { api } from '../api/api'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const selectedUniName = localStorage.getItem('global_university_name') || 'الجامعة';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const selectedUniId = localStorage.getItem('selected_uni_id');

        if (!selectedUniId) {
            setLoading(false);
            return Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى العودة لصفحة البداية واختيار الجامعة أولاً لضمان الدخول للنظام الصحيح.',
                confirmButtonColor: '#2563eb'
            });
        }

        try {
            const res = await api.loginStaff({ 
                email, 
                password,
                uni_id: selectedUniId 
            });

            if (res.data.status === 'success') {
                const { token, user } = res.data;

                const targetDeptId = localStorage.getItem('target_dept_id');

                if (user.role !== 'admin' && targetDeptId !== null) {
                    if (targetDeptId != user.dept_id) {
                        Swal.fire({
                            icon: 'error',
                            title: 'صلاحيات غير صالحة',
                            text: 'هذا الحساب لا يتبع للقسم الأكاديمي الذي قمت باختياره في هذه الجامعة.',
                            confirmButtonColor: '#ef4444'
                        });
                        setLoading(false);
                        return;
                    }
                }
                

                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role);
                localStorage.setItem('dept_id', user.dept_id);
                localStorage.setItem('user_name', user.name);
                localStorage.setItem('uni_id', user.uni_id); 

                Swal.fire({
                    icon: 'success',
                    title: `أهلاً بك يا ${user.name}`,
                    text: `تم تسجيل دخولك بنجاح إلى ${selectedUniName}`,
                    timer: 1500,
                    showConfirmButton: false
                });

                // توجيه المستخدم حسب دوره
                if (user.role === 'admin') navigate('/admin-dashboard');
                else if (user.role === 'hod') navigate('/hod-dashboard');
                else navigate('/data-entry');

            } else {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'فشل الدخول', 
                    text: res.data.message, 
                    confirmButtonColor: '#2563eb' 
                });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'تأكد من تشغيل السيرفر ومن صحة بيانات الدخول لهذه الجامعة';
            Swal.fire({ 
                icon: 'error', 
                title: 'خطأ في الاتصال', 
                text: errorMsg, 
                confirmButtonColor: '#2563eb' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}>
                        <LogIn size={28} color="#2563eb" />
                    </div>
                    <h2 style={styles.title}>دخول الموظف</h2>
                    {/*  اسم الجامعة */}
                    <p style={styles.subtitle}>بوابة تسجيل الموظفين - {selectedUniName}</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>البريد الإلكتروني أو الرقم الوظيفي</label>
                        <div style={styles.inputWrapper}>
                            <Mail style={styles.fieldIcon} size={18} color="#94a3b8" />
                            <input 
                                type="text" 
                                placeholder="أدخل بيانات الاعتماد الخاصة بك" 
                                style={styles.input} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>كلمة المرور</label>
                        <div style={styles.inputWrapper}>
                            <Lock style={styles.fieldIcon} size={18} color="#94a3b8" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                style={styles.input} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}
                    >
                        {loading ? 'جاري التحقق...' : 'دخول للنظام'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p>جميع الحقوق محفوظة © 2026 - مشروع التخرج</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)', 
        direction: 'rtl',
        fontFamily: "'Tajawal', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px'
    },
    loginCard: {
        width: '100%',
        maxWidth: '420px', 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        textAlign: 'right'
    },
    header: {
        textAlign: 'center',
        marginBottom: '35px'
    },
    iconCircle: {
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.1)'
    },
    title: {
        fontSize: '26px',
        color: '#0f172a',
        fontWeight: '900',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '14px',
        color: '#475569',
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
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#334155',
        marginRight: '4px'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        padding: '14px 42px 14px 14px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        backdropFilter: 'blur(10px)',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.3s ease',
        color: '#1e293b',
        textAlign: 'right',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
        boxSizing: 'border-box'
    },
    fieldIcon: {
        position: 'absolute',
        right: '14px',
        zIndex: 2
    },
    eyeBtn: {
        position: 'absolute',
        left: '14px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2
    },
    submitBtn: {
        marginTop: '15px',
        padding: '16px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
    },
    footer: {
        marginTop: '25px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#475569',
        fontWeight: '500'
    }
};

export default Login;