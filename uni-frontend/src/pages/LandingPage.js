import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight, Building, BookOpen, MapPin } from 'lucide-react';
import { universitiesData } from './universitiesData';

const LandingPage = () => {
    const navigate = useNavigate();
    
    const [selectedUniId, setSelectedUniId] = useState('');
    const [selectedFacId, setSelectedFacId] = useState('');
    const [selectedDeptId, setSelectedDeptId] = useState('');

    const selectedUni = universitiesData.find(u => u.id === selectedUniId);
    const selectedFac = selectedUni?.faculties.find(f => f.id === selectedFacId);
    const selectedDept = selectedFac?.departments.find(d => d.id.toString() === selectedDeptId.toString());

    const handleDeptChange = (e) => {
        const deptId = e.target.value;
        setSelectedDeptId(deptId);
        
        if (deptId && selectedUni && selectedFac) {
            const dept = selectedFac.departments.find(d => d.id.toString() === deptId);
            localStorage.setItem('global_university_name', selectedUni.name);
            localStorage.setItem('global_faculty_name', selectedFac.name);
            localStorage.setItem('target_dept_id', dept.id); 
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.mainCard}>
                
                {/* ترويسة البوابة */}
                <div style={styles.header}>
                    <div style={styles.logoCircle}>
                        <GraduationCap size={40} color="#2563eb" />
                    </div>
                    <h1 style={styles.title}>البوابة الأكاديمية </h1>
                    <p style={styles.subtitle}>الجامعات الأردنية - نظام بناء الجداول الدراسية</p>
                </div>

                {/* نموذج الاختيار المتسلسل */}
                <div style={styles.formContainer}>
                    
                    {/* اختيار الجامعة */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Building size={16}/> اختر الجامعة:</label>
                        <select style={styles.select} value={selectedUniId} onChange={(e) => { setSelectedUniId(e.target.value); setSelectedFacId(''); setSelectedDeptId(''); }}>
                            <option value="">-- يرجى اختيار الجامعة --</option>
                            {universitiesData.map(uni => (
                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* اختيار الكلية (يظهر فقط بعد اختيار الجامعة) */}
                    <div style={{...styles.inputGroup, opacity: selectedUniId ? 1 : 0.4, pointerEvents: selectedUniId ? 'auto' : 'none'}}>
                        <label style={styles.label}><BookOpen size={16}/> اختر الكلية:</label>
                        <select style={styles.select} value={selectedFacId} onChange={(e) => { setSelectedFacId(e.target.value); setSelectedDeptId(''); }}>
                            <option value="">-- يرجى اختيار الكلية --</option>
                            {selectedUni?.faculties.map(fac => (
                                <option key={fac.id} value={fac.id}>{fac.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* اختيار القسم (يظهر فقط بعد اختيار الكلية) */}
                    <div style={{...styles.inputGroup, opacity: selectedFacId ? 1 : 0.4, pointerEvents: selectedFacId ? 'auto' : 'none'}}>
                        <label style={styles.label}><MapPin size={16}/> اختر القسم الأكاديمي:</label>
                        <select style={styles.select} value={selectedDeptId} onChange={handleDeptChange}>
                            <option value="">-- يرجى اختيار القسم --</option>
                            {selectedFac?.departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* البوابات تظهر فقط عند اكتمال الاختيار */}
                {selectedDeptId && (
                    <div style={styles.portalsContainer}>
                        <div style={styles.divider}>
                            <span>اختر بوابة الدخول</span>
                        </div>
                        
                        <div style={styles.portalCards}>
                            <button onClick={() => navigate('/login')} style={{...styles.portalBtn, borderColor: '#2563eb', color: '#1e3a8a', backgroundColor: '#eff6ff'}}>
                                <ShieldCheck size={30} color="#2563eb" />
                                <div>
                                    <div style={styles.portalTitle}>رئيس القسم / الموظف</div>
                                    <div style={styles.portalDesc}>بناء الخطط وطرح الشُعب</div>
                                </div>
                                <ArrowRight size={20} />
                            </button>

                            <button onClick={() => navigate('/student-login')} style={{...styles.portalBtn, borderColor: '#10b981', color: '#064e3b', backgroundColor: '#ecfdf5'}}>
                                <GraduationCap size={30} color="#10b981" />
                                <div>
                                    <div style={styles.portalTitle}>بوابة الطالب</div>
                                    <div style={styles.portalDesc}>استعراض الجداول والتصويت</div>
                                </div>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <footer style={styles.footer}>
                جميع الحقوق محفوظة © 2026 - مشروع التخرج
            </footer>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Tajawal, sans-serif'
    },
    mainCard: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '650px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
        padding: '40px',
        boxSizing: 'border-box'
    },
    header: {
        textAlign: 'center',
        marginBottom: '35px'
    },
    logoCircle: {
        width: '80px',
        height: '80px',
        backgroundColor: '#eff6ff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
    },
    title: {
        fontSize: '26px',
        color: '#0f172a',
        margin: '0 0 10px 0',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: '15px',
        color: '#64748b',
        margin: 0
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: '0.3s ease'
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    select: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '15px',
        color: '#1e293b',
        backgroundColor: '#f8fafc',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
    },
    portalsContainer: {
        marginTop: '35px',
        animation: 'fadeIn 0.5s ease'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 'bold',
        marginBottom: '20px',
        '::before': { content: '""', flex: 1, borderBottom: '1px solid #e2e8f0', marginRight: '15px' },
        '::after': { content: '""', flex: 1, borderBottom: '1px solid #e2e8f0', marginLeft: '15px' }
    },
    portalCards: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    portalBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        borderRadius: '16px',
        border: '2px solid transparent',
        cursor: 'pointer',
        textAlign: 'right',
        transition: '0.2s ease',
        textDecoration: 'none'
    },
    portalTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        marginBottom: '4px'
    },
    portalDesc: {
        fontSize: '13px',
        opacity: 0.8
    },
    footer: {
        marginTop: '30px',
        color: '#94a3b8',
        fontSize: '14px'
    }
};

export default LandingPage;