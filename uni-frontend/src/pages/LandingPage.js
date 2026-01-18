import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const portalOptions = [
        {
            id: 'staff',
            title: 'بوابة الموظف / مدخل البيانات',
            description: 'إدارة المكتبة العامة، بناء الخطط الدراسية، وطرح الشعب .',
            icon: <ShieldCheck size={48} color="#2563eb" />,
            bgColor: '#eff6ff',
            borderColor: '#2563eb',
            path: '/login' 
        },
        {
            id: 'student',
            title: 'بوابة الطالب الجامعي',
            description: 'استعراض الجدول الدراسي المقترح، التصويت على الشعب .',
            icon: <GraduationCap size={48} color="#10b981" />,
            bgColor: '#ecfdf5',
            borderColor: '#10b981',
            path: '/student-login' 
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.mainTitle}>نظام محاكاة بناء الجدول الدراسي </h1>
                <p style={styles.subTitle}>جامعة العلوم والتكنولوجيا الأردنية - مشروع التخرج</p>
            </div>

            <div style={styles.grid}>
                {portalOptions.map((option) => (
                    <div 
                        key={option.id} 
                        style={{...styles.card, borderTop: `6px solid ${option.borderColor}`}}
                        onClick={() => navigate(option.path)}
                    >
                        <div style={{...styles.iconWrapper, backgroundColor: option.bgColor}}>
                            {option.icon}
                        </div>
                        <h2 style={styles.cardTitle}>{option.title}</h2>
                        <p style={styles.cardDescription}>{option.description}</p>
                        <button style={{...styles.btn, backgroundColor: option.borderColor}}>
                            دخول البوابة <ArrowRight size={18} style={{marginRight: '8px'}} />
                        </button>
                    </div>
                ))}
            </div>

            <footer style={styles.footer}>
                جميع الحقوق محفوظة © 2026 - مختبرات هندسة البرمجيات
            </footer>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Tajawal, sans-serif'
    },
    header: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    mainTitle: {
        fontSize: '32px',
        color: '#1e293b',
        marginBottom: '10px',
        fontWeight: '900'
    },
    subTitle: {
        fontSize: '18px',
        color: '#64748b'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px',
        width: '100%',
        maxWidth: '900px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px 30px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        ':hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)'
        }
    },
    iconWrapper: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
    },
    cardTitle: {
        fontSize: '22px',
        color: '#1e293b',
        marginBottom: '15px',
        fontWeight: 'bold'
    },
    cardDescription: {
        fontSize: '15px',
        color: '#64748b',
        lineHeight: '1.6',
        marginBottom: '25px',
        minHeight: '70px'
    },
    btn: {
        padding: '12px 25px',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    footer: {
        marginTop: '60px',
        color: '#94a3b8',
        fontSize: '14px'
    }
};

export default LandingPage;