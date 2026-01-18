import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { 
    LogOut, BookOpen, User, PieChart, CheckCircle, 
    Hash, X, Calendar as CalendarIcon 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StudentDashboard = () => {
    const navigate = useNavigate();
    
    const [activeYear, setActiveYear] = useState(1); 
    const [studyPlan, setStudyPlan] = useState({}); 
    const [offeredSections, setOfferedSections] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [userVotes, setUserVotes] = useState([]); 
  
    const studentUser = JSON.parse(localStorage.getItem('student_user') || '{}');

    const daysMap = {
        'S': 'سبت', 'U': 'أحد', 'M': 'اثنين', 'T': 'ثلاثاء', 'W': 'أربعاء', 'R': 'خميس'
    };

    const translateDays = (daysString) => {
        if (!daysString) return '';
        return daysString.split('').map(day => daysMap[day] || day).join(' - ');
    };

    const semesterNames = { 1: 'الفصل الأول', 2: 'الفصل الثاني', 3: 'الفصل الصيفي' };

    useEffect(() => {
        if (!studentUser.id) {
            navigate('/');
            return;
        }
        fetchAndGroupData();
    }, []);

    const fetchAndGroupData = async () => {
        try {
            setLoading(true);
            
            const scheduleRes = await api.getStudentSchedule(studentUser.id);
            const grouped = scheduleRes.data.reduce((acc, section) => {
                const code = section.course_code;
                if (!acc[code]) {
                    acc[code] = {
                        title: section.course_name,
                        code: code,
                        totalVotes: 0,
                        sections: []
                    };
                }
                acc[code].sections.push(section);
                acc[code].totalVotes += (section.current_votes || 0);
                return acc;
            }, {});
            setOfferedSections(grouped);

            try {
                const votesRes = await api.getStudentVotes(studentUser.id);
                setUserVotes(votesRes.data.map(v => v.section_id));
            } catch (vErr) { console.warn("لا يمكن جلب تصويتات الطالب حالياً"); }

            const planId = studentUser.plan_id || 1; 
            const planRes = await api.getPlanCourses(planId);
            const organizedPlan = planRes.data.reduce((acc, course) => {
                const y = course.year_level || 1;
                const s = course.semester || 1;
                if (!acc[y]) acc[y] = { 1: [], 2: [], 3: [] };
                acc[y][s].push(course);
                return acc;
            }, {});
            setStudyPlan(organizedPlan);

            setLoading(false);
        } catch (err) {
            console.error("خطأ في جلب البيانات", err);
            setLoading(false);
        }
    };

    const handleVoteToggle = async (courseId, sectionId, courseName, sectionNum) => {
        const hasVoted = userVotes.includes(sectionId);
        const planId = studentUser.plan_id || 1;
        
        if (hasVoted) {
            try {
                const res = await api.removeVote({ student_id: studentUser.id, section_id: sectionId });
                if (res.data.status === 'success') {
                    setUserVotes(prev => prev.filter(id => id !== sectionId));
                    Swal.fire({ icon: 'info', title: 'تم سحب الصوت', text: `ألغيت تصويتك للشعبة رقم ${sectionNum}`, timer: 1500, showConfirmButton: false });
                    fetchAndGroupData();
                }
            } catch (err) { console.error(err); }
            return;
        }

        try {
            const prereqRes = await api.getPlanCoursePrereqs(planId, courseId);
            const prereqs = prereqRes.data;
            

const votedAlread = Object.values(offeredSections).some(course => 
        course.sections.some(sec => sec.course_id === courseId && userVotes.includes(sec.section_id)));
         if(votedAlread){
            Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: `أنت مصوت مسبقاً لمساق (${courseName}) في شعبة أخرى. قم بإلغاء تصويتك القديم أولاً لتتمكن من تغيير الشعبة.`,
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#6366f1'
        });
        return;

    }
///////

            if (prereqs.length > 0) {
                const prereq = prereqs[0]; 
                const isStudyType = prereq.req_type === 'Study'; 
                
                const result = await Swal.fire({
                    title: '<span style="color: #f59e0b;">تنبيه المتطلب السابق</span>',
                    html: `
                        <div style="text-align: right; direction: rtl; font-family: 'Tajawal', sans-serif;">
                            <p style="font-weight: bold;">هذا المساق له متطلب (${isStudyType ? 'سابق دراسة' : 'سابق نجاح'}):</p>
                            <p style="color: #6366f1; font-weight: 800; font-size: 18px;">${prereq.course_code} - ${prereq.title}</p>
                            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
                            <p style="font-size: 14px; color: #64748b;">
                                <b>ملاحظة:</b> ${isStudyType 
                                    ? "سابق الدراسة معناه يشترط ان تكون قد درست المادة ولا يشترط ان تكون قد نجحت فيها." 
                                    : "سابق النجاح يشترط ان تكون قد نجحت بالمادة."}
                            </p>
                        </div>
                    `,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: isStudyType ? 'نعم، أقر أنني درستها' : 'نعم، لقد نجحت بهذه المادة',
                    cancelButtonText: 'إلغاء التصويت',
                    confirmButtonColor: '#6366f1',
                    cancelButtonColor: '#ef4444',
                    reverseButtons: true
                });

                if (!result.isConfirmed) {
                    Swal.fire({
                        icon: 'error',
                        title: 'تم إلغاء التصويت',
                        text: 'لا يمكنك التصويت لهذا المساق دون استيفاء المتطلبات السابقة.',
                        confirmButtonText: 'حسناً'
                    });
                    return; 
                }
            }

            const voteData = { student_id: studentUser.id, course_id: courseId, section_id: sectionId };
            const res = await api.submitVote(voteData);
            
            if (res.data.status === 'success') {
                setUserVotes(prev => [...prev, sectionId]);
                Swal.fire({ icon: 'success', title: 'تم تسجيل صوتك!', text: `اخترت الشعبة ${sectionNum} لمساق ${courseName}`, timer: 1500, showConfirmButton: false });
                fetchAndGroupData();
            }
        } catch (err) {
            const msg = err.response?.data?.message || "حدث خطأ أثناء معالجة الطلب";
            Swal.fire({ icon: 'error', title: 'تنبيه', text: msg });
        }
    };

    const handleLogout = () => { localStorage.clear(); navigate('/'); };

    if (loading) return <div style={styles.loading}>جاري تحميل جدولك الدراسي المخصص...</div>;

    return (
        <div style={styles.container}>
            {}
            <nav style={styles.navbar}>
                <div style={styles.welcomeSection}>
                    <div style={styles.avatar}><User size={24} color="#6366f1" /></div>
                    <div>
                        <span style={styles.welcomeLabel}>مرحباً بك مجدداً،</span>
                        <h4 style={styles.studentName}>{studentUser.name || 'طالبنا العزيز'}</h4>
                    </div>
                </div>

                <div style={styles.universityTitle}>
                    جامعة العلوم والتكنولوجيا الأردنية - قسم هندسة البرمجيات
                 </div>

                <div style={styles.navActions}>
                    <div style={styles.idBadge}><Hash size={14} /> {studentUser.id}</div>
                    <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={18} /> خروج</button>
                </div>
            </nav>

            {}
            <div style={styles.yearTabs}>
                {[1, 2, 3, 4].map(y => (
                    <button key={y} onClick={() => setActiveYear(y)} style={activeYear === y ? styles.activeYearBtn : styles.yearBtn}>السنة {y}</button>
                ))}
            </div>

            <header style={styles.mainHeader}>
                <h1 style={styles.title}>بوابة التصويت وبناء الجدول</h1>
                <p style={styles.subtitle}>تظهر هنا مواد خطتك الدراسية فقط. صوت للشُعب التي تناسب وقتك.</p>
            </header>

            {}
            <div style={styles.grid}>
                {[1, 2, 3].map(sem => (
                    studyPlan[activeYear]?.[sem]?.length > 0 && (
                        <div key={sem} style={styles.semesterSection}>
                            <div style={styles.semesterHeader}>
                                <CalendarIcon size={20} color="#6366f1" />
                                <h2 style={styles.semesterTitle}>{semesterNames[sem]}</h2>
                            </div>

                            <div style={styles.coursesGrid}>
                                {studyPlan[activeYear][sem].map(course => {
                                    const offeredData = offeredSections[course.course_code];
                                    const isOffered = !!offeredData;

                                    return (
                                        <div key={course.course_id} style={isOffered ? styles.courseCard : styles.plainCourseCard}>
                                            <div style={styles.courseHeader}>
                                                <div style={styles.courseMainInfo}>
                                                    <div style={{...styles.bookIcon, backgroundColor: isOffered ? '#6366f1' : '#cbd5e1'}}><BookOpen size={20} color="#fff" /></div>
                                                    <div>
                                                        <h3 style={styles.courseTitleText}>{course.title}</h3>
                                                        <span style={styles.courseCodeTag}>{course.course_code}</span>
                                                    </div>
                                                </div>
                                                {isOffered && (
                                                    <div style={styles.totalVotesBadge}>
                                                        <PieChart size={14} /> إجمالي الأصوات: {offeredData.totalVotes}
                                                    </div>
                                                )}
                                                {!isOffered && <span style={{fontSize:'12px', color:'#94a3b8'}}>غير مطروحة للتصويت حالياً</span>}
                                            </div>

                                            {isOffered && (
                                                <div style={styles.tableContainer}>
                                                    <table style={styles.table}>
                                                        <thead>
                                                            <tr>
                                                                <th style={styles.th}>الشعبة</th>
                                                                <th style={styles.th}>المدرس</th>
                                                                <th style={styles.th}>الموعد</th>
                                                                <th style={styles.th}>الإقبال</th>
                                                                <th style={styles.th}>الإجراء</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {offeredData.sections.map((section) => {
                                                                const votePercent = offeredData.totalVotes > 0 ? Math.round((section.current_votes / offeredData.totalVotes) * 100) : 0;
                                                                const isVoted = userVotes.includes(section.section_id);
                                                                return (
                                                                    <tr key={section.section_id} style={styles.tr}>
                                                                        <td style={styles.tdSection}># {section.section_num}</td>
                                                                        <td style={styles.td}>{section.instructor_name}</td>
                                                                        <td style={styles.td}>
                                                                            <div style={styles.daysTag}>{translateDays(section.days)}</div>
                                                                            <div style={styles.timeLabel}>{section.start_time} - {section.end_time}</div>
                                                                        </td>
                                                                        <td style={styles.td}>
                                                                            <div style={styles.analyticsWrapper}>
                                                                                <div style={styles.progressTrack}>
                                                                                    <div style={{...styles.progressBar, width: `${votePercent}%`, backgroundColor: votePercent > 50 ? '#10b981' : '#6366f1'}}></div>
                                                                                </div>
                                                                                <span style={styles.percentText}>{votePercent}% ({section.current_votes} صوت)</span>
                                                                            </div>
                                                                        </td>
                                                                        <td style={styles.td}>
                                                                            <button
                                                                                style={{...styles.voteBtn, backgroundColor: isVoted ? '#ef4444' : '#6366f1'}}
                                                                                onClick={() => handleVoteToggle(section.course_id, section.section_id, course.title, section.section_num)}
                                                                            >
                                                                                {isVoted ? <X size={16} /> : <CheckCircle size={16} />}
                                                                                {isVoted ? 'سحب' : 'تصويت'}
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px 5%', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' },
    loading: { textAlign: 'center', marginTop: '100px', fontSize: '20px', color: '#6366f1', fontWeight: 'bold' },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' },
    universityTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: '2px solid #e2e8f0',
    borderLeft: '2px solid #e2e8f0',
    margin: '0 20px',
    padding: '0 15px'
},
    welcomeSection: { display: 'flex', alignItems: 'center', gap: '15px' },

    avatar: { backgroundColor: '#eef2ff', padding: '12px', borderRadius: '15px' },

    welcomeLabel: { fontSize: '12px', color: '#64748b', display: 'block' },

    studentName: { margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '800' },

    navActions: { display: 'flex', alignItems: 'center', gap: '20px' },

    idBadge: { backgroundColor: '#f8fafc', padding: '8px 15px', borderRadius: '10px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },

    logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
    
    yearTabs: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' },

    yearBtn: { padding: '10px 25px', borderRadius: '30px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', cursor: 'pointer' },
    
    activeYearBtn: { padding: '10px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(99,102,241,0.2)' },

    mainHeader: { textAlign: 'center', marginBottom: '50px' },
    title: { fontSize: '32px', color: '#1e293b', fontWeight: '900', marginBottom: '10px' },
    subtitle: { color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto' },
    
    semesterSection: { marginBottom: '50px' },
    semesterHeader: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '25px' },
    semesterTitle: { fontSize: '22px', color: '#1e293b', margin: 0 },
    
    coursesGrid: { display: 'flex', flexDirection: 'column', gap: '25px' },
    courseCard: { backgroundColor: '#fff', borderRadius: '25px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' },
    plainCourseCard: { backgroundColor: '#fff', borderRadius: '25px', padding: '20px 30px', border: '1px solid #f1f5f9', opacity: 0.7 },
    
    courseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    courseMainInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
    bookIcon: { padding: '10px', borderRadius: '12px' },
    courseTitleText: { margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: 'bold' },
    courseCodeTag: { fontSize: '11px', color: '#6366f1', fontWeight: 'bold', backgroundColor: '#eef2ff', padding: '2px 8px', borderRadius: '6px' },
    totalVotesBadge: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' },
    
    tableContainer: { overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', borderBottom: '1px solid #f1f5f9' },
    tr: { transition: '0.2s' },
    td: { padding: '15px', color: '#1e293b', fontSize: '14px' },
    tdSection: { padding: '15px', fontWeight: 'bold', color: '#6366f1' },
    daysTag: { backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginBottom: '5px' },
    timeLabel: { fontSize: '13px', fontWeight: '500' },
    analyticsWrapper: { display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '120px' },
    progressTrack: { width: '100%', height: '5px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: '10px', transition: 'width 1s' },
    percentText: { fontSize: '10px', color: '#64748b', fontWeight: 'bold' },
    voteBtn: { display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
};

export default StudentDashboard;