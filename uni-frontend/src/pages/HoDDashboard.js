import React, { useState, useEffect } from 'react';
import { api } from '../api/api'; 
import { AlertTriangle, TrendingUp, FileText, ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react'; 
import Swal from 'sweetalert2';

const HoDDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // خريطة تحويل الرموز لأيام بالعربي (شغل التكنو الصح)
    const daysMap = {
        'S': 'سبت', 'U': 'أحد', 'M': 'اثنين', 'T': 'ثلاثاء', 'W': 'أربعاء', 'R': 'خميس'
    };

    // دالة مشان نحول أيام الشعبة لكلام مفهوم
    const translateDays = (daysString) => {
        if (!daysString) return 'غير محدد';
        return daysString.split('').map(day => daysMap[day] || day).join(' - ');
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        const deptId = localStorage.getItem('dept_id'); 
        try {
            const res = await api.getHODAnalytics(deptId); 
            setReports(res.data);
            setLoading(false);
        } catch (err) {
            console.error("مشكلة بجلب البيانات من السيرفر", err);
            setLoading(false);
        }
    };

    // تجميع الشُعب تحت كل مادة
    const groupedReports = reports.reduce((acc, curr) => {
        if (!acc[curr.course_code]) {
            acc[curr.course_code] = { title: curr.title, code: curr.course_code, sections: [] };
        }
        acc[curr.course_code].sections.push(curr);
        return acc;
    }, {});

    if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>عم بنحلل نبض الطلاب... ثواني بس</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.pageTitle}>لوحة متابعة تصويتات المواد </h2>
                <p style={styles.subTitle}>جامعة العلوم والتكنولوجيا الأردنية</p>
            </header>

            {/* الزر الرئيسي لفتح الإحصائيات */}
            <div 
                style={{
                    ...styles.toggleCard, 
                    borderRadius: showAnalytics ? '20px 20px 0 0' : '20px' 
                }} 
                onClick={() => setShowAnalytics(!showAnalytics)}
            >
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <div style={styles.iconCircle}><TrendingUp size={24} color="#2563eb" /></div>
                    <div>
                        <h3 style={styles.toggleTitle}>حالة الشُعب وتوزيع الإقبال</h3>
                        <p style={styles.toggleSub}>اضغط لعرض تفاصيل تصويت الطلاب لكل مادة</p>
                    </div>
                </div>
                {showAnalytics ? <ChevronUp size={24} color="#64748b" /> : <ChevronDown size={24} color="#64748b" />}
            </div>

            {showAnalytics && (
                <div style={styles.mainCardFadeIn}>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>المساق (المادة)</th>
                                    <th style={styles.th}>تفاصيل الشعبة</th>
                                    <th style={styles.th}>موعدها </th>
                                    <th style={styles.th}>الإقبال</th>
                                    <th style={styles.th}>التوصية </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(groupedReports).map((course, courseIndex) => (
                                    <React.Fragment key={course.code}>
                                        {course.sections.map((sec, index) => (
                                            <tr key={sec.section_id} 
                                                style={{
                                                    ...styles.tr,
                                                    // بنحط خط فاصل سميك بين كل مادة والثانية
                                                    borderBottom: (index === course.sections.length - 1) ? '4px solid #2563eb' : '2px solid #4b4e50'
                                                }}>
                                                
                                                {/* اسم المادة بيطلع مرة وحدة وبكون "ماسك" كل شعبها */}
                                                {index === 0 && (
                                                    <td rowSpan={course.sections.length} style={styles.tdCourse}>
                                                        <div style={styles.courseInfo}>
                                                            <span style={styles.cTitle}>{course.title}</span>
                                                            <span style={styles.cCode}>{course.code}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.sectionBadge,
                                                        backgroundColor: sec.status === 'critical' ? '#ef4444' : 
                                                                        sec.status === 'warning' ? '#f59e0b' : '#10b981'
                                                    }}>
                                                        شعبة #{sec.section_num}
                                                    </span>
                                                </td>

                                                {/* الأيام والوقت بالعربي (طلب الدكتور) */}
                                                <td style={styles.td}>
                                                    <div style={styles.timeWrapper}>
                                                        <div style={styles.daysText}><Calendar size={12}/> {translateDays(sec.days)}</div>
                                                        <div style={styles.timeText}><Clock size={12}/> {sec.start_time} - {sec.end_time}</div>
                                                    </div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={styles.progressWrapper}>
                                                        <div style={styles.progressTrack}>
                                                            <div style={{
                                                                ...styles.progressBar, 
                                                                width: `${sec.demand_pct}%`,
                                                                backgroundColor: sec.status === 'critical' ? '#ef4444' : '#2563eb'
                                                            }}></div>
                                                        </div>
                                                        <span style={styles.pctText}>{sec.demand_pct}% ({sec.vote_count} طالب)</span>
                                                    </div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={{
                                                        ...styles.adviceNote,
                                                        color: sec.status === 'critical' ? '#b91c1c' : '#1e293b',
                                                        backgroundColor: sec.status === 'critical' ? '#fef2f2' : '#f8fafc'
                                                    }}>
                                                        {sec.advice || "الوضع طبيعي."}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// التنسيقات - مرتبة "مسطرة" مشان الفواصل
const styles = {
    container: { padding: '40px', backgroundColor: '#f1f5f9', minHeight: '100vh', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' },
    header: { marginBottom: '30px' },
    pageTitle: { fontSize: '26px', fontWeight: '900', color: '#1e293b', margin: 0 },
    subTitle: { fontSize: '14px', color: '#64748b', marginTop: '5px' },
    
    toggleCard: { backgroundColor: '#fff', padding: '25px 35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.3s' },
    iconCircle: { width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    toggleTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' },
    toggleSub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' },

    mainCardFadeIn: { backgroundColor: '#fff', borderRadius: '0 0 20px 20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' },
    tableContainer: { padding: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'right', padding: '15px', color: '#64748b', fontSize: '15px', fontWeight: '800', borderBottom: '2px solid #e2e8f0' },
    tr: { transition: '0.2s' },
    td: { padding: '15px', verticalAlign: 'middle' },
    tdCourse: { padding: '20px', backgroundColor: '#f8fafc', borderLeft: '5px solid #2563eb', verticalAlign: 'middle', fontWeight: 'bold' },
    
    courseInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    cTitle: { color: '#1e293b', fontSize: '14px' },
    cCode: { fontSize: '11px', color: '#2563eb' },
    
    sectionBadge: { color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' },
    
    timeWrapper: { display: 'flex', flexDirection: 'column', gap: '5px' },
    daysText: { fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' },
    timeText: { fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' },

    progressWrapper: { display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '140px' },
    progressTrack: { height: '6px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: '10px', transition: 'width 1s ease-in-out' },
    pctText: { fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' },
    
    adviceNote: { padding: '10px', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0', lineHeight: '1.4' }
};

export default HoDDashboard;