import React, { useState, useEffect } from 'react';
import { 
    Plus, Clock, Users, MapPin, User, Trash2, 
    Edit, AlertCircle, BarChart3, CheckCircle, CalendarDays, X, GraduationCap, BookOpen, Layers
} from 'lucide-react';
import { api } from '../../api/api';
import Swal from 'sweetalert2';

const ScheduleTab = ({ catalog, styles }) => {
    const [sections, setSections] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [newSection, setNewSection] = useState({
        course_id: '', start_time: '08:00', end_time: '09:00',
        instructor_name: '', room_id: '', delivery_mode: 'On-site', capacity: 50
    });

    const daysMap = {
        'S': 'سبت',
        'U': 'أحد',
        'M': 'اثنين',
        'T': 'ثلاثاء',
        'W': 'أربعاء',
        'R': 'خميس'
    };

    const renderDayBadges = (daysString) => {
        if (!daysString) return null;
        return (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                {daysString.split('').map(char => (
                    <span key={char} style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569', 
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                    }}>
                        {daysMap[char] || char}
                    </span>
                ))}
            </div>
        );
    };

    const daysList = [
        { label: 'سبت', value: 'S' }, { label: 'أحد', value: 'U' }, { label: 'اثنين', value: 'M' },
        { label: 'ثلاثاء', value: 'T' }, { label: 'أربعاء', value: 'W' }, { label: 'خميس', value: 'R' }
    ];

    const fetchSections = async () => {
        try {
            const res = await api.getStaffSchedule(); 
            setSections(res.data);
        } catch (err) { console.error("Error fetching sections", err); }
    };

    useEffect(() => { fetchSections(); }, []);

    const groupedSections = sections.reduce((acc, section) => {
        const key = section.course_id;
        if (!acc[key]) {
            acc[key] = {
                course_name: section.course_name,
                course_code: section.course_code || 'N/A', 
                credit_hours: section.credit_hours || 3,
                items: []
            };
        }
        acc[key].items.push(section);
        return acc;
    }, {});

    const toggleDay = (day) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const handleFinalApproval = async () => {
        const result = await Swal.fire({
            title: 'الاعتماد النهائي للجدول',
            text: "هل أنت متأكد من اعتماد هذا الجدول؟ سيظهر فوراً للطلاب لبدء عملية التصويت ولن يتمكنوا من رؤيته قبل ذلك.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، اعتمد الجدول وانشره',
            cancelButtonText: 'تراجع',
            confirmButtonColor: '#10b981'
        });

        if (result.isConfirmed) {
            try {
                await api.publishSchedule(); 
                Swal.fire('تم الاعتماد', 'الجدول الدراسي متاح الآن للطلاب بنجاح.', 'success');
                fetchSections();
            } catch (err) {
                Swal.fire('خطأ', 'حدث خلل أثناء اعتماد الجدول. تأكد من اتصال قاعدة البيانات.', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'خيارات حذف الشعبة الدراسية',
            text: "هذه الشعبة مرتبطة بتصويتات الطلاب. كيف ترغب في المتابعة؟",
            icon: 'warning',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'حذف الشعبة (إبقاء سجل الأصوات)',
            denyButtonText: 'حذف نهائي (مسح الشعبة والأصوات)',
            cancelButtonText: 'تراجع',
            confirmButtonColor: '#3b82f6',
            denyButtonColor: '#ef4444',
        });

        try {
            if (result.isConfirmed) {
                await api.deleteSection(id, { keep_votes: true });
                Swal.fire('تم الحذف', 'حُذفت الشعبة بنجاح مع بقاء سجلات التصويت.', 'success');
            } else if (result.isDenied) {
                await api.deleteSection(id, { keep_votes: false });
                Swal.fire('تم المسح الشامل', 'تم حذف الشعبة وكافة البيانات نهائياً.', 'success');
            }
            if (result.isConfirmed || result.isDenied) fetchSections();
        } catch (err) {
            Swal.fire('خطأ', 'فشل إجراء الحذف.', 'error');
        }
    };

    const validateSchedule = () => {
        if (!newSection.course_id || selectedDays.length === 0) return "يرجى اختيار المادة وتحديد أيام الشعبة.";
        const daysString = selectedDays.join('');

        for (let s of sections) {
            if (s.section_id === editingId) continue;

            const daysOverlap = s.days.split('').some(d => daysString.includes(d));
            const timeOverlap = (newSection.start_time < s.end_time) && (newSection.end_time > s.start_time);

            if (daysOverlap && timeOverlap) {
                if (newSection.room_id && s.room_id && newSection.room_id.trim() === s.room_id.trim()) {
                    return `تعارض مكاني: القاعة (${s.room_id}) محجوزة لمساق (${s.course_name}) في هذا الوقت!`;
                }

                if (newSection.instructor_name && s.instructor_name && newSection.instructor_name.trim() === s.instructor_name.trim()) {
                    return `تعارض بشري: المدرس (${s.instructor_name}) لديه شعبة أخرى لمساق (${s.course_name}) في هذا الوقت!`;
                }
            }
        }
        return null;
    };

    const handleSubmit = async (e, ignoreWarning = false) => {
        if (e) e.preventDefault();
        
        const localError = validateSchedule();
        if (localError) return Swal.fire('تنبيه ', localError, 'warning');

        const payload = { 
            ...newSection, 
            days: selectedDays.join(''),
            ignore_warning: ignoreWarning 
        };

        try {
            let res;
            if (editingId) {
                res = await api.updateSection(editingId, payload);
            } else {
                res = await api.createSection(payload);
            }

            if (res.data.status === 'conflict' && res.data.type === 'warning') {
                const proceed = await Swal.fire({
                    title: 'تنبيه تداخل مواعيد',
                    text: res.data.message,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'طرح الشعبة بالرغم من ذلك',
                    cancelButtonText: 'تراجع وتعديل',
                    confirmButtonColor: '#f59e0b'
                });
                if (proceed.isConfirmed) return handleSubmit(null, true);
                return;
            }

            resetForm();
            fetchSections();
            Swal.fire({ icon: 'success', title: 'تمت العملية بنجاح', timer: 1000, showConfirmButton: false });
        } catch (err) { 
            const errorMsg = err.response?.data?.message || 'فشل في حفظ البيانات، تأكد من اتصال قاعدة البيانات.';
            Swal.fire('خطأ في العملية', errorMsg, 'error'); 
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setSelectedDays([]);
        setNewSection({ course_id: '', start_time: '08:00', end_time: '09:00', instructor_name: '', room_id: '', delivery_mode: 'On-site', capacity: 50 });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {}
            <div style={{...styles.card, borderTop: '5px solid #2563eb', padding: '25px'}}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: '#1e293b' }}>
                    <CalendarDays size={24} color="#2563eb" /> {editingId ? 'تعديل بيانات الشعبة' : 'طرح شعب للجدول الدراسي'}
                </h3>
                
                <form onSubmit={(e) => handleSubmit(e)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div style={{gridColumn: 'span 2'}}>
                        <label style={styles.label}>اختيار المادة من المكتبة:</label>
                        <select style={styles.inputField} value={newSection.course_id} onChange={e => setNewSection({...newSection, course_id: e.target.value})} required>
                            <option value="">-- اختر المساق --</option>
                            {catalog.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.title}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={styles.label}>نمط التدريس:</label>
                        <select style={styles.inputField} value={newSection.delivery_mode} onChange={e => setNewSection({...newSection, delivery_mode: e.target.value})}>
                            <option value="On-site">وجاهي (داخل الحرم)</option>
                            <option value="Remote">عن بعد (Online)</option>
                            <option value="Hybrid">مدمج (Hybrid)</option>
                        </select>
                    </div>

                    <div style={{gridColumn: 'span 3'}}>
                        <label style={styles.label}>تحديد الأيام:</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                            {daysList.map(day => (
                                <button key={day.value} type="button" onClick={() => toggleDay(day.value)}
                                    style={{
                                        padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                        backgroundColor: selectedDays.includes(day.value) ? '#2563eb' : '#fff',
                                        color: selectedDays.includes(day.value) ? '#fff' : '#1e293b',
                                        cursor: 'pointer', fontWeight: 'bold', transition: '0.3s'
                                    }}>
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={styles.label}>الفترة الزمنية:</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="time" style={styles.inputField} value={newSection.start_time} onChange={e => setNewSection({...newSection, start_time: e.target.value})} required />
                            <input type="time" style={styles.inputField} value={newSection.end_time} onChange={e => setNewSection({...newSection, end_time: e.target.value})} required />
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column'}}>
                        <label style={styles.label}>اسم المدرس:</label>
                        <input placeholder="د. اسم المدرس (اختياري)" style={styles.inputField} value={newSection.instructor_name} onChange={e => setNewSection({...newSection, instructor_name: e.target.value})} />
                    </div>
                    
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <label style={styles.label}>اسم القاعة:</label>
                        <input placeholder="أدخل اسم القاعة (اختياري)" style={styles.inputField} value={newSection.room_id} onChange={e => setNewSection({...newSection, room_id: e.target.value})} />
                    </div>

                    <button type="submit" style={{...styles.saveBtn, gridColumn: 'span 3', height: '50px', borderRadius: '12px', fontSize: '16px'}}>
                        {editingId ? 'حفظ التعديلات الحالية' : 'إضافة الشعبة للجدول'}
                    </button>
                    {editingId && <button type="button" onClick={resetForm} style={{...styles.cancelBtn, gridColumn: 'span 3'}}>إلغاء التعديل</button>}
                </form>
            </div>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                        <Layers size={22} color="#2563eb" /> مراجعة الجدول المطروح حسب المواد
                    </h3>
                    {sections.length > 0 && (
                        <button onClick={handleFinalApproval} style={{
                            backgroundColor: '#10b981', color: '#fff', padding: '10px 20px', 
                            borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <CheckCircle size={18} /> الاعتماد النهائي للجدول
                        </button>
                    )}
                </div>

                {Object.keys(groupedSections).length === 0 ? (
                    <div style={{padding:'40px', textAlign:'center', color:'#94a3b8', backgroundColor: '#f8fafc', borderRadius: '15px'}}>لا توجد مواد مطروحة حالياً</div>
                ) : (
                    Object.keys(groupedSections).map(courseId => {
                        const group = groupedSections[courseId];
                        return (
                            <div key={courseId} style={{backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '15px'}}>
                                <div style={{backgroundColor: '#f1f5f9', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <BookOpen size={20} color="#2563eb" />
                                        <span style={{fontWeight: 'bold', fontSize: '18px'}}>{group.course_name}</span>
                                        <span style={{color: '#2563eb', fontSize: '14px', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold'}}>{group.course_code}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', fontWeight: 'bold'}}>
                                        <GraduationCap size={18} /> {group.credit_hours} ساعات معتمدة
                                    </div>
                                </div>

                                <div style={{padding: '10px'}}>
                                    {group.items.map((s, index) => {
                                        const percent = Math.min(Math.round((s.current_votes / s.capacity) * 100), 100);
                                        return (
                                            <div key={s.section_id} style={{
                                                display: 'grid', 
                                                gridTemplateColumns: '0.8fr 1.5fr 2fr 1fr 1fr 1fr 0.6fr', 
                                                gap: '15px', padding: '15px', alignItems: 'center',
                                                borderBottom: index === group.items.length - 1 ? 'none' : '1px solid #f1f5f9'
                                            }}>
                                                <div style={{fontWeight: 'bold', color: '#1e293b'}}>شعبة #{s.section_num}</div>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    <User size={16} color="#64748b" />
                                                    <span style={{fontSize: '14px'}}>{s.instructor_name || 'غير محدد'}</span>
                                                </div>
                                                
                                                {/************************************************************* */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>
                                                        <Clock size={14} color="#64748b" />
                                                        {s.start_time} - {s.end_time}
                                                    </div>
                                                    {renderDayBadges(s.days)}
                                                </div>

                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    <MapPin size={16} color="#64748b" />
                                                    <span style={{backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold'}}>{s.room_id || '---'}</span>
                                                </div>
                                                <div style={{fontSize: '13px', color: '#1e293b', fontWeight: '600'}}>
                                                    {s.delivery_mode === 'On-site' ? 'وجاهي' : s.delivery_mode === 'Remote' ? 'أونلاين' : 'مدمج'}
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                                                        <span style={{fontWeight:'bold'}}>{s.current_votes} صوت</span>
                                                        <span style={{color: percent > 80 ? '#ef4444' : '#10b981'}}>{percent}%</span>
                                                    </div>
                                                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${percent}%`, height: '100%', background: percent > 80 ? '#ef4444' : '#2563eb', transition: '0.5s' }} />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                    <button onClick={() => {setEditingId(s.section_id); setSelectedDays(s.days.split('')); setNewSection(s); window.scrollTo({top: 0, behavior: 'smooth'});}} style={{...styles.editBtn, padding: '8px'}}><Edit size={14}/></button>
                                                    <button onClick={() => handleDelete(s.section_id)} style={{...styles.delIconBtn, padding: '8px'}}><Trash2 size={14}/></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ScheduleTab;