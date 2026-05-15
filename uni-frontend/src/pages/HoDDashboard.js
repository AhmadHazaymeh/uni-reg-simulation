import React, { useState, useEffect } from 'react';
import { api } from '../api/api'; 
import { AlertTriangle, TrendingUp, FileText, ChevronDown, ChevronUp, Clock, Calendar, Lightbulb, CheckCircle, BookOpen } from 'lucide-react';
import Swal from 'sweetalert2';

const HoDDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [finalReport, setFinalReport] = useState([]);
    const [showReport, setShowReport] = useState(false);

    const daysMap = {
        'S': 'سبت', 'U': 'أحد', 'M': 'اثنين', 'T': 'ثلاثاء', 'W': 'أربعاء', 'R': 'خميس'
    };

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
            const [analyticsRes, reportRes] = await Promise.all([
                api.getHODAnalytics(deptId),
                api.getHODFinalReport(deptId)
            ]);
            
            setReports(analyticsRes.data);
            if (reportRes.data.status === 'success') {
                setFinalReport(reportRes.data.report);
            }
            setLoading(false);
        } catch (err) {
            console.error("خطأ في الاتصال بقاعدة البيانات", err);
            setLoading(false);
        }
    };

    const groupedReports = reports.reduce((acc, curr) => {
        if (!acc[curr.course_code]) {
            acc[curr.course_code] = { title: curr.title, code: curr.course_code, sections: [] };
        }
        acc[curr.course_code].sections.push(curr);
        return acc;
    }, {});

    if (loading) return <div style={{textAlign:'center', marginTop:'50px', fontSize: '18px'}}>جاري تحميل البيانات من الخادم...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.pageTitle}>صفحة رئيس القسم - متابعة التسجيل</h2>
                <p style={styles.subTitle}>جامعة العلوم والتكنولوجيا الأردنية - النظام الداخلي</p>
            </header>

            {/* الزر الرئيسي لفتح الإحصائيات */}
            <div 
                style={styles.toggleCard} 
                onClick={() => setShowAnalytics(!showAnalytics)}
            >
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <TrendingUp size={20} color="#0056b3" />
                    <div>
                        <h3 style={styles.toggleTitle}>عرض إحصائيات الشعب المطروحة</h3>
                    </div>
                </div>
                {showAnalytics ? <ChevronUp size={20} color="#333" /> : <ChevronDown size={20} color="#333" />}
            </div>

            {showAnalytics && (
                <div style={styles.mainCard}>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>اسم المادة</th>
                                    <th style={styles.th}>رقم الشعبة</th>
                                    <th style={styles.th}>الموعد والأيام</th>
                                    <th style={styles.th}>نسبة الإقبال</th>
                                    <th style={styles.th}>حالة الشعبة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(groupedReports).map((course, courseIndex) => (
                                    <React.Fragment key={course.code}>
                                        {course.sections.map((sec, index) => (
                                            <tr key={sec.section_id} style={styles.tr}>
                                                
                                                {index === 0 && (
                                                    <td rowSpan={course.sections.length} style={styles.tdCourse}>
                                                        <div style={{fontWeight: 'bold', color: '#000'}}>{course.title}</div>
                                                        <div style={{fontSize: '12px', color: '#666'}}>{course.code}</div>
                                                    </td>
                                                )}

                                                <td style={styles.td}>
                                                    شعبة {sec.section_num}
                                                </td>

                                                <td style={styles.td}>
                                                    <div>{translateDays(sec.days)}</div>
                                                    <div style={{fontSize: '12px', color: '#555'}}>{sec.start_time} - {sec.end_time}</div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                        <div style={styles.progressTrack}>
                                                            <div style={{
                                                                ...styles.progressBar, 
                                                                width: `${sec.demand_pct}%`,
                                                                backgroundColor: sec.demand_pct >= 80 ? '#dc3545' : '#007bff'
                                                            }}></div>
                                                        </div>
                                                        <span style={{fontSize: '12px'}}>{sec.demand_pct}% ({sec.vote_count})</span>
                                                    </div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={{
                                                        color: sec.status === 'critical' ? '#dc3545' : '#333',
                                                        fontSize: '13px'
                                                    }}>
                                                        {sec.advice || "عادية"}
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

            {/* --- بداية ميزة التقرير --- */}
            <div 
                style={{...styles.toggleCard, marginTop: '20px'}} 
                onClick={() => setShowReport(!showReport)}
            >
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <FileText size={20} color="#28a745" />
                    <div>
                        <h3 style={styles.toggleTitle}>تقرير النظام والمقترحات للجدول النهائي</h3>
                    </div>
                </div>
                {showReport ? <ChevronUp size={20} color="#333" /> : <ChevronDown size={20} color="#333" />}
            </div>

            {showReport && (
                <div style={styles.mainCard}>
                    <div style={{padding: '20px'}}>
                        {finalReport.length === 0 ? (
                            <p style={{textAlign: 'center', color: '#666'}}>لا يوجد بيانات كافية.</p>
                        ) : (
                            finalReport.map((item, idx) => (
                                <div key={idx} style={styles.reportBox}>
                                    
                                    <div style={{borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between'}}>
                                        <h3 style={{margin: 0, fontSize: '16px', color: '#000'}}>{item.title} ({item.course_code})</h3>
                                        <div style={{color: '#28a745', fontWeight: 'bold', fontSize: '14px'}}>
                                            الطلاب المصوتين: {item.total_votes}
                                        </div>
                                    </div>

                                    <div style={{marginBottom: '15px'}}>
                                        <h4 style={{fontSize: '14px', color: '#000', marginBottom: '10px'}}>القرار المقترح من النظام:</h4>
                                        <p style={{fontSize: '14px', color: '#333'}}>
                                            ينصح بطرح عدد ({item.recommended_count}) شعب بناءً على الإقبال.
                                        </p>
                                        
                                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px'}}>
                                            {item.proposed_sections.map((sec, sIdx) => (
                                                <div key={sIdx} style={styles.sectionBox}>
                                                    <div style={{fontWeight: 'bold', marginBottom: '5px'}}>الشعبة #{sIdx + 1}</div>
                                                    <div style={{fontSize: '13px'}}>الأيام: {translateDays(sec.days)}</div>
                                                    <div style={{fontSize: '13px'}}>الوقت: {sec.start_time} - {sec.end_time}</div>
                                                    <div style={{fontSize: '13px'}}>السعة : {sec.capacity}</div>
                                                    {sec.vote_count > 0 && <div style={{fontSize: '11px', color: '#666', marginTop: '5px'}}>عدد الأصوات: {sec.vote_count}</div>}
                                                    <div style={{fontSize: '12px', color: '#856404', marginTop: '8px', borderTop: '1px dashed #ccc', paddingTop: '5px'}}>
                                                     <strong>توصية:</strong> {sec.advice}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {item.insights.length > 0 && (
                                        <div style={styles.insightBox}>
                                            <h4 style={{fontSize: '14px', color: '#856404', margin: '0 0 5px 0'}}>ملاحظات إضافية:</h4>
                                            <ul style={{margin: 0, paddingRight: '20px', color: '#856404', fontSize: '13px'}}>
                                                {item.insights.map((insight, iIdx) => (
                                                    <li key={iIdx}>{insight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh', direction: 'rtl', fontFamily: 'Arial, sans-serif' },
    header: { marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
    pageTitle: { fontSize: '22px', color: '#333', margin: 0 },
    subTitle: { fontSize: '13px', color: '#777', marginTop: '5px' },
    
    toggleCard: { backgroundColor: '#e9ecef', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' },
    toggleTitle: { fontSize: '16px', margin: 0, color: '#333' },

    mainCard: { backgroundColor: '#fff', border: '1px solid #ccc', borderTop: 'none', padding: '10px' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' },
    th: { textAlign: 'right', padding: '10px', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ddd', fontSize: '14px' },
    tr: { borderBottom: '1px solid #ddd' },
    td: { padding: '10px', border: '1px solid #ddd', fontSize: '13px' },
    tdCourse: { padding: '10px', backgroundColor: '#fdfdfd', border: '1px solid #ddd', verticalAlign: 'top' },
    
    progressTrack: { height: '10px', backgroundColor: '#e9ecef', border: '1px solid #ccc', width: '100px' },
    progressBar: { height: '100%' },
    
    reportBox: { border: '1px solid #ccc', padding: '15px', marginBottom: '15px', backgroundColor: '#fff' },
    sectionBox: { border: '1px solid #aaa', padding: '10px', backgroundColor: '#f8f9fa', width: '180px' },
    insightBox: { backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '10px' }
};

export default HoDDashboard;