import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight, Building, BookOpen, MapPin } from 'lucide-react';
import { api } from '../api/api'; 

const LandingPage = () => {
    const navigate = useNavigate();
    
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [selectedUniId, setSelectedUniId] = useState('');
    const [selectedFacId, setSelectedFacId] = useState('');
    const [selectedDeptId, setSelectedDeptId] = useState('');
   
    useEffect(() => {
        const fetchUnis = async () => {
            try {
                const res = await api.getUniversities();
                setUniversities(res.data);
            } catch (err) {
                console.error("خطأ في جلب بيانات الجامعات", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUnis();
    }, []);

    const selectedUni = universities.find(u => u.id.toString() === selectedUniId.toString());
    const selectedFac = selectedUni?.faculties?.find(f => f.id.toString() === selectedFacId.toString());
    const selectedDept = selectedFac?.departments?.find(d => d.id.toString() === selectedDeptId.toString());

    const handleUniChange = (e) => {
        const uniId = e.target.value;
        setSelectedUniId(uniId);
        setSelectedFacId('');
        setSelectedDeptId('');
        
        const uni = universities.find(u => u.id.toString() === uniId.toString());
        if (uni) {
            localStorage.setItem('selected_uni_id', uni.id);
            localStorage.setItem('global_university_name', uni.name);
        }
    };

   const handleDeptChange = (e) => {
        const deptId = e.target.value;
        setSelectedDeptId(deptId);
        
        if (deptId && selectedUni && selectedFac) {
            const dept = selectedFac.departments.find(d => d.id.toString() === deptId.toString());
            localStorage.setItem('global_faculty_name', selectedFac.name);
            localStorage.setItem('target_dept_id', dept.id); 
            
            localStorage.setItem('selected_dept_id', dept.id); 
            localStorage.setItem('selected_dept_name', dept.name); 
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{textAlign: 'center', color: '#2563eb', fontWeight: 'bold'}}>
                    جاري الاتصال بقاعدة البيانات لجلب الجامعات...
                </div>
            </div>
        );
    }

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

                {/*  الاختيار المتسلسل */}
                <div style={styles.formContainer}>
                    
                    {/* اختيار الجامعة */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><Building size={16}/> اختر الجامعة:</label>
                        <select style={styles.select} value={selectedUniId} onChange={handleUniChange}>
                            <option value="">-- يرجى اختيار الجامعة --</option>
                            {universities.map(uni => (
                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* اختيار الكلية  ) */}
                    <div style={{...styles.inputGroup, opacity: selectedUniId ? 1 : 0.4, pointerEvents: selectedUniId ? 'auto' : 'none'}}>
                        <label style={styles.label}><BookOpen size={16}/> اختر الكلية:</label>
                        <select style={styles.select} value={selectedFacId} onChange={(e) => { setSelectedFacId(e.target.value); setSelectedDeptId(''); }}>
                            <option value="">-- يرجى اختيار الكلية --</option>
                            {selectedUni?.faculties?.map(fac => (
                                <option key={fac.id} value={fac.id}>{fac.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* اختيار القسم ) */}
                    <div style={{...styles.inputGroup, opacity: selectedFacId ? 1 : 0.4, pointerEvents: selectedFacId ? 'auto' : 'none'}}>
                        <label style={styles.label}><MapPin size={16}/> اختر القسم الأكاديمي:</label>
                        <select style={styles.select} value={selectedDeptId} onChange={handleDeptChange}>
                            <option value="">-- يرجى اختيار القسم --</option>
                            {selectedFac?.departments?.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* البوابات      */}
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Tajawal, sans-serif',
        position: 'relative',
        overflow: 'hidden'
    },
    mainCard: {
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', 
        width: '100%',
        maxWidth: '650px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        padding: '40px',
        boxSizing: 'border-box',
        border: '1px solid rgba(255, 255, 255, 0.6)' 
    },
    header: {
        textAlign: 'center',
        marginBottom: '35px'
    },
    logoCircle: {
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.1)'
    },
    title: {
        fontSize: '28px',
        color: '#0f172a',
        margin: '0 0 10px 0',
        fontWeight: '900'
    },
    subtitle: {
        fontSize: '15px',
        color: '#475569',
        margin: 0,
        fontWeight: '500'
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
        color: '#334155',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    select: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        fontSize: '15px',
        color: '#1e293b',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        backdropFilter: 'blur(10px)',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
    },
    portalsContainer: {
        marginTop: '35px',
        animation: 'fadeIn 0.5s ease'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '13px',
        fontWeight: 'bold',
        marginBottom: '20px',
        '::before': { content: '""', flex: 1, borderBottom: '1px solid rgba(0,0,0,0.1)', marginRight: '15px' },
        '::after': { content: '""', flex: 1, borderBottom: '1px solid rgba(0,0,0,0.1)', marginLeft: '15px' }
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
        border: '1px solid rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
        textAlign: 'right',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
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
        color: 'rgba(255, 255, 255, 0.7)', 
        fontSize: '14px',
        fontWeight: '500'
    }
};

export default LandingPage;