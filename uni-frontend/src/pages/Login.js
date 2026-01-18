import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://127.0.0.1:5000/api/staff/login', { email, password });
            if (res.data.status === 'success') {
                localStorage.setItem('token', res.data.token);
                Swal.fire({
                    icon: 'success',
                    title: 'أهلاً بك مجدداً',
                    text: 'تم تسجيل دخولك بنجاح',
                    confirmButtonColor: '#2563eb',
                    timer: 1500
                });
                navigate('/data-entry');
            } else {
                Swal.fire({ icon: 'error', title: 'فشل الدخول', text: res.data.message, confirmButtonColor: '#2563eb' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'خطأ تقني', text: 'تأكد من تشغيل السيرفر (Flask)', confirmButtonColor: '#2563eb' });
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
                    <h2 style={styles.title}>دخول مدخل البيانات </h2>
                    <p style={styles.subtitle}>نظام محاكاة التسجيل بجامعة العلوم والتكنولوجيا</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>البريد الإلكتروني</label>
                        <div style={styles.inputWrapper}>
                            <Mail style={styles.fieldIcon} size={18} color="#94a3b8" />
                            <input 
                                type="email" 
                                placeholder="clerk@just.edu.jo" 
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
                    <p>© 2025 مشروع التخرج - كلية تكنولوجيا المعلومات</p>
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
        backgroundColor: '#f8fafc', 
        direction: 'rtl',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px'
    },
    loginCard: {
        width: '100%',
        maxWidth: '450px', 
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        border: '1px solid #f1f5f9',
        textAlign: 'right'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    iconCircle: {
        width: '60px',
        height: '60px',
        backgroundColor: '#eff6ff',
        borderRadius: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',
        transform: 'rotate(-5deg)'
    },
    title: {
        fontSize: '22px',
        color: '#0f172a',
        fontWeight: '700',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '13px',
        color: '#64748b'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        marginRight: '4px'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        padding: '12px 42px 12px 42px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#fff',
        textAlign: 'right'
    },
    fieldIcon: {
        position: 'absolute',
        right: '14px'
    },
    eyeBtn: {
        position: 'absolute',
        left: '14px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    submitBtn: {
        marginTop: '10px',
        padding: '14px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
    },
    footer: {
        marginTop: '25px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#94a3b8'
    }
};

export default Login;