import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    GraduationCap, LogOut, BookOpen, Layers, Calendar,
    X, Check, Link as LinkIcon, AlertCircle, Plus
} from 'lucide-react';
import { api } from '../api/api';
import PlansTab from '../components/dashboard/PlansTab';
import CatalogTab from '../components/dashboard/CatalogTab';
import ScheduleTab from '../components/dashboard/ScheduleTab';

const DataEntryDashboard = () => {
    const [activeTab, setActiveTab] = useState('plans');
    const [selectedSpec, setSelectedSpec] = useState('SE');

    const [plans, setPlans] = useState([]);
    const [catalog, setCatalog] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);

    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanHours, setNewPlanHours] = useState('');
    
    const [currentPlan, setCurrentPlan] = useState(null);
    const [courseList, setCourseList] = useState([]);

    const [editingPlanCourseId, setEditingPlanCourseId] = useState(null);
    const [editPlanCourseData, setEditPlanCourseData] = useState({});
    
    const [selectedCatalogId, setSelectedCatalogId] = useState('');
    const [linkYear] = useState('0');
    const [linkSemester] = useState('0');
    const [linkCategory, setLinkCategory] = useState('إجباري تخصص');

    const [currentCoursePrereqs, setCurrentCoursePrereqs] = useState([]);
    const [newPrereqId, setNewPrereqId] = useState('');
    const [newPrereqType, setNewPrereqType] = useState('Success');

    const categories = [
        { id: 'إجباري جامعة', label: 'متطلبات جامعة إجبارية' },
        { id: 'اختياري جامعة', label: 'متطلبات جامعة اختيارية' },
        { id: 'إجباري كلية', label: 'متطلبات كلية إجبارية' },
        { id: 'إجباري تخصص', label: 'متطلبات تخصص إجبارية' },
        { id: 'اختياري تخصص', label: 'متطلبات تخصص اختيارية' }
    ];

    const fetchData = async () => {
        try {
            const [plansRes, catalogRes] = await Promise.all([
                api.getPlans(),
                api.getCatalog()
            ]);
            setPlans(plansRes.data.filter(p => p.specialization === selectedSpec));
            setCatalog(catalogRes.data);
        } catch (err) { console.error("Error fetching data", err); }
    };

    useEffect(() => { fetchData(); }, [selectedSpec, activeTab]);

    const fetchPrereqs = async (planId, courseId) => {
        try {
            const res = await api.getPlanCoursePrereqs(planId, courseId);
            setCurrentCoursePrereqs(res.data);
        } catch (err) { console.error("Error fetching prereqs", err); }
    };

    const handleAddPrereq = async (courseId) => {
        if (!newPrereqId) {
            return Swal.fire('تنبيه', 'يرجى اختيار مادة لتكون متطلباً سابقاً', 'warning');
        }
        try {
            const data = { prereq_id: newPrereqId, req_type: newPrereqType };
            const res = await api.addPlanCoursePrereq(currentPlan.plan_id, courseId, data);
            if (res.data.status === 'success') {
                Swal.fire({ icon: 'success', title: 'تمت إضافة المتطلب', timer: 1000, showConfirmButton: false });
                fetchPrereqs(currentPlan.plan_id, courseId);
                setNewPrereqId('');
                const resCourses = await api.getPlanCourses(currentPlan.plan_id);
                setCourseList(resCourses.data);
            }
        } catch (err) { Swal.fire('خطأ', 'فشل إضافة المتطلب', 'error'); }
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        const hours = parseInt(newPlanHours);
        if (hours < 1) {
            return Swal.fire({ icon: 'warning', title: 'رقم غير منطقي', text: 'يجب أن يكون عدد الساعات 1 على الأقل.' });
        }
        try {
            const res = await api.createPlan({
                plan_name: newPlanName,
                specialization: selectedSpec,
                total_hours: hours
            });
            if (res.data.status === 'success') {
                Swal.fire({ icon: 'success', title: 'تم إنشاء الخطة بنجاح', timer: 1500, showConfirmButton: false });
                setNewPlanName(''); setNewPlanHours(''); setShowPlanModal(false);
                fetchData();
            }
        } catch (err) { Swal.fire('خطأ', 'فشل إنشاء الخطة', 'error'); }
    };

    const handleDeletePlan = async (planId) => {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "سيتم حذف الخطة وكافة ارتباطات المواد بها نهائياً!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذفها',
            confirmButtonColor: '#ef4444'
        });
        if (result.isConfirmed) {
            try {
                await api.deletePlan(planId);
                fetchData();
                Swal.fire('تم الحذف', 'تم حذف الخطة بنجاح', 'success');
            } catch (err) { Swal.fire('خطأ', 'فشل الحذف', 'error'); }
        }
    };

    const openEditModal = async (plan) => {
        setCurrentPlan(plan);
        setEditingPlanCourseId(null);
        try {
            const res = await api.getPlanCourses(plan.plan_id);
            setCourseList(res.data);
            setShowEditModal(true);
        } catch (err) { setCourseList([]); setShowEditModal(true); }
    };

    const handleLinkCourse = async (e) => {
    e.preventDefault();
    if (!selectedCatalogId) return;
    try {
        const linkData = {
            course_id: selectedCatalogId,
            year_level: linkYear,
            semester: linkSemester,
            category: linkCategory
        };
        const res = await api.linkCourseToPlan(currentPlan.plan_id, linkData);
        if (res.data.status === 'success') {
            const resCourses = await api.getPlanCourses(currentPlan.plan_id);
            setCourseList(resCourses.data);

            Swal.fire({
                icon: 'success',
                title: 'تم ربط المادة بنجاح',
                text: 'يمكنك الآن تخصيص الساعات ونمط التدريس للمادة المضافة.',
                timer: 1500,
                showConfirmButton: false,
                //position: 'top-end', 
                //toast: true          
            });
            

            setEditingPlanCourseId(selectedCatalogId); 
            const newCourse = resCourses.data.find(c => c.course_id === selectedCatalogId);
            setEditPlanCourseData({...newCourse});
            
            setSelectedCatalogId('');
        }
    } catch (err) { Swal.fire('تنبيه', 'المادة مرتبطة بالفعل', 'warning'); }
};
    const handleUnlinkCourse = async (courseId) => {
        try {
            await api.unlinkCourseFromPlan(currentPlan.plan_id, courseId);
            setCourseList(courseList.filter(c => c.course_id !== courseId));
            Swal.fire('تمت الإزالة', 'تم فك الارتباط', 'success');
        } catch (err) { Swal.fire('خطأ', 'فشل فك الارتباط', 'error'); }
    };

   const handleUpdatePlanCourse = async (courseId) => {
    try {
        const dataToSend = {
            title: editPlanCourseData.title,
            credit_hours: parseInt(editPlanCourseData.credit_hours) || 0,
            theory_hours: parseInt(editPlanCourseData.theory_hours) || 0,
            practical_hours: parseInt(editPlanCourseData.practical_hours) || 0,
            delivery_mode: editPlanCourseData.delivery_mode || 'وجاهي', 
            is_confirmed: 1
        };

        const res = await api.updatePlanCourseDetails(currentPlan.plan_id, courseId, dataToSend);
        
        if (res.data.status === 'success') {
            setCourseList(courseList.map(c => c.course_id === courseId ? { ...c, ...dataToSend } : c));
            setEditingPlanCourseId(null);
            Swal.fire({ icon: 'success', title: 'تم الحفظ والاعتماد', timer: 1000, showConfirmButton: false });
        } else {
            Swal.fire('تنبيه', res.data.message || 'فشل الحفظ في السيرفر', 'warning');
        }
    } catch (err) {
        Swal.fire('خطأ', 'فشل في تحديث قاعدة البيانات - تأكد من أسماء الأعمدة في الباك أند', 'error');
    }
};
    const handleDeletePrereq = async (courseId, prereqId, reqType) => {
    const result = await Swal.fire({
        title: 'حذف المتطلب؟',
        text: "هل أنت متأكد من حذف هذا الارتباط؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذفه',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
        try {
            const res = await api.deletePlanCoursePrereq(currentPlan.plan_id, courseId, { 
                prereq_id: prereqId, 
                req_type: reqType 
            });

            if (res.data.status === 'success') {
                if (editingPlanCourseId === courseId) {
                    await fetchPrereqs(currentPlan.plan_id, courseId);
                }

                const resCourses = await api.getPlanCourses(currentPlan.plan_id);
                setCourseList(resCourses.data);

                Swal.fire({ icon: 'success', title: 'تم الحذف بنجاح', timer: 800, showConfirmButton: false });
            } else {
                Swal.fire('خطأ', 'فشل السيرفر في الحذف، قد لا يكون السجل موجوداً', 'error');
            }
        } catch (err) { 
            console.error(err);
            Swal.fire('خطأ تقني', 'تأكد من اتصال قاعدة البيانات وصحة البيانات المرسلة', 'error'); 
        }
    }
};





    
    return (
        <div style={styles.dashboardContainer}>
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}><GraduationCap size={30} /> <span style={styles.logoText}>نظام التسجيل</span></div>
                <nav style={styles.nav}>
                    <button onClick={() => setActiveTab('plans')} style={activeTab === 'plans' ? styles.activeNavItem : styles.navItem}><BookOpen size={20} /> الخطط الدراسية</button>
                    <button onClick={() => setActiveTab('catalog')} style={activeTab === 'catalog' ? styles.activeNavItem : styles.navItem}><Layers size={20} /> مكتبة المواد</button>
                    <button onClick={() => setActiveTab('schedule')} style={activeTab === 'schedule' ? styles.activeNavItem : styles.navItem}><Calendar size={20} /> بناء الجدول</button>
                </nav>
                <button onClick={() => window.location.href='/login'} style={styles.logoutBtn}><LogOut size={20} /> خروج</button>
            </aside>

            <main style={styles.mainContent}>
                <header style={styles.topHeader}>
                    <div style={styles.userInfo}><span>مدخل البيانات</span><div style={styles.userAvatar}>JUST</div></div>
                    <h2 style={styles.pageTitle}>{activeTab === 'plans' ? 'إدارة الخطط' : activeTab === 'catalog' ? 'المكتبة العامة' : 'طرح الشُعب الدراسية'}</h2>
                </header>

                <div style={styles.contentArea}>
                    {activeTab === 'plans' && (
                        <PlansTab plans={plans} selectedSpec={selectedSpec} setSelectedSpec={setSelectedSpec} setShowPlanModal={setShowPlanModal} openEditModal={openEditModal} handleDeletePlan={handleDeletePlan} styles={styles} />
                    )}
                    {activeTab === 'catalog' && <CatalogTab catalog={catalog} styles={styles} />}
                    {activeTab === 'schedule' && <ScheduleTab catalog={catalog} styles={styles} />}
                </div>
            </main>

            {/* Create Plan */}
            {showPlanModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.smallModalCard}>
                        <div style={styles.modalHeader}><h2>إنشاء خطة جديدة</h2><button onClick={() => setShowPlanModal(false)} style={styles.circularCloseBtn}><X size={20} /></button></div>
                        <form onSubmit={handleCreatePlan} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                            <div><label style={styles.label}>اسم الخطة:</label><input style={styles.inputField} value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} required /></div>
                            <div><label style={styles.label}>الساعات:</label><input type="number" style={styles.inputField} value={newPlanHours} onChange={(e) => setNewPlanHours(e.target.value)} required min="1"/></div>
                            <div style={{display:'flex', gap:'10px'}}><button type="submit" style={styles.saveBtn}>حفظ</button><button onClick={() => setShowPlanModal(false)} style={styles.cancelBtn}>إلغاء</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Plan Courses  */}
            {showEditModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <div style={styles.modalHeader}>
                            <div style={{textAlign: 'right'}}>
                                <h2>تخصيص مواد {currentPlan?.plan_name}</h2>
                                <p style={{color:'#64748b', fontSize:'14px'}}>إدارة المواد حسب التصنيف الأكاديمي والمتطلبات السابقة.</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} style={styles.circularCloseBtn}><X size={24} /></button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            <div style={styles.scrollArea}>
                                {categories.map(cat => (
                                    courseList.some(c => c.category === cat.id) && (
                                        <div key={cat.id} style={{ marginBottom: '40px' }}>
                                            <div style={styles.yearHeader}>{cat.label}</div>
                                            
                                            <div style={styles.gridHeaderFixed}>
                                                <div style={{flex: 1.2}}>رقم المادة</div>
                                                <div style={{flex: 3}}>اسم المادة</div>
                                                <div style={{flex: 0.6, textAlign:'center'}}>س.م</div>
                                                <div style={{flex: 0.6, textAlign:'center'}}>نظري</div>
                                                <div style={{flex: 0.6, textAlign:'center'}}>عملي</div>
                                                <div style={{flex: 2.5}}>المتطلبات السابقة</div>
                                                <div style={{flex: 1.2}}>نمط التدريس</div>
                                                <div style={{flex: 1.2, textAlign:'center'}}>تحكم</div>
                                            </div>

                                            {courseList.filter(c => c.category === cat.id).map(c => (
                                                <div key={c.course_id} style={editingPlanCourseId === c.course_id ? {...styles.editingRowFixed, flexDirection: 'column', alignItems: 'stretch'} : styles.gridRowFixed}>
                                                    {editingPlanCourseId === c.course_id ? (
                                                        <>
                                                            <>
                                                                <div style={{display: 'flex', gap: '10px', alignItems: 'center', width: '100%'}}>
                                                                    <div style={{flex: 1.2, fontWeight:'bold'}}>{c.course_code}</div>
                                                                    <div style={{flex: 3}}><input style={styles.editInput} value={editPlanCourseData.title || ''} onChange={e => setEditPlanCourseData({...editPlanCourseData, title: e.target.value})} /></div>
                                                                    <div style={{flex: 0.6}}><input type="number" style={styles.editInput} value={editPlanCourseData.credit_hours || ''} onChange={e => setEditPlanCourseData({...editPlanCourseData, credit_hours: e.target.value})} /></div>
                                                                    {}
                                                                    <div style={{flex: 0.6}}><input type="number" style={styles.editInput} value={editPlanCourseData.theory_hours || 0} onChange={e => setEditPlanCourseData({...editPlanCourseData, theory_hours: e.target.value})} /></div>
                                                                    <div style={{flex: 0.6}}><input type="number" style={styles.editInput} value={editPlanCourseData.practical_hours || 0} onChange={e => setEditPlanCourseData({...editPlanCourseData, practical_hours: e.target.value})} /></div>
                                                                    <div style={{flex: 2.5}}>---</div>
                                                                    <div style={{flex: 1.2}}>
                                                                       <select 
                                                                            style={styles.editInput} 
                                                                            value={editPlanCourseData.delivery_mode || 'وجاهي'} 
                                                                            onChange={e => setEditPlanCourseData({...editPlanCourseData, delivery_mode: e.target.value})}
                                                                        >
                                                                            <option value="وجاهي">وجاهي</option>
                                                                            <option value="مدمج">مدمج</option>
                                                                            <option value="عن بعد">عن بعد</option>
                                                                        </select>
                                                                    </div>
                                                                    <div style={{flex: 1.2, display: 'flex', gap: '5px', justifyContent: 'center'}}>
                                                                            {}
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => handleUpdatePlanCourse(c.course_id)} 
                                                                                style={styles.saveActionBtn}
                                                                            >
                                                                                <Check size={16}/>
                                                                            </button>

                                                                            {/*  الإكس */}
                                                                            <button 
                                                                            type="button"
                                                                                onClick={() => setEditingPlanCourseId(null)} 
                                                                                style={styles.cancelActionBtn}
                                                                            >
                                                                                <X size={16}/>
                                                                            </button>
                                                                        </div>
                                                                </div>
                                                                {}
                                                            </>
                                                            <div style={styles.prereqManager}>
                                                                <div style={styles.prereqTitle}><AlertCircle size={14}/> إدارة المتطلبات السابقة:</div>
                                                                <div style={styles.prereqListWrap}>
                                                                    {currentCoursePrereqs.map((pr, idx) => (
                                                                        <span key={idx} style={pr.req_type === 'Success' ? styles.prereqBadgeSuccess : styles.prereqBadgeStudy}>
                                                                            {pr.req_type === 'Success' ? 'نجاح:' : 'دراسة:'} {pr.course_code}
                                                                            <X size={12} style={{ cursor: 'pointer', marginRight: '8px' }} onClick={() => handleDeletePrereq(editingPlanCourseId, pr.prereq_id, pr.req_type)} />
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <div style={styles.addPrereqRow}>
                                                                    <select value={newPrereqId} onChange={e => setNewPrereqId(e.target.value)} style={{...styles.miniSelect, flex: 2}}>
                                                                        <option value="">-- اختر مادة --</option>
                                                                         {courseList.filter(item => item.course_id !== c.course_id).map(item => (
                                                                            <option key={item.course_id} value={item.course_id}>{item.course_code} - {item.title}</option>
                                                                             ))}  </select>
                                                                    <select value={newPrereqType} onChange={e => setNewPrereqType(e.target.value)} style={{...styles.miniSelect, flex: 1}}>
                                                                        <option value="Success">سابق نجاح</option><option value="Study">سابق دراسة</option>
                                                                    </select>
                                                                    <button onClick={() => handleAddPrereq(c.course_id)} style={styles.addPrereqBtn}>إضافة</button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div style={{flex: 1, fontWeight:'bold', color:'#2563eb'}}>{c.course_code}</div>
                                                            <div style={{flex: 2.5}}>{c.title}</div>
                                                            <div style={{flex: 0.6, textAlign:'center'}}>{c.credit_hours}</div>
                                                            <div style={{flex: 0.6, textAlign:'center'}}>{c.theory_hours || 0}</div>
                                                            <div style={{flex: 0.6, textAlign:'center'}}>{c.practical_hours || 0}</div>
                                                            <div style={{flex: 2, display:'flex', flexWrap:'wrap', gap:'3px'}}>
                                                                {c.prerequisites?.length > 0 ? c.prerequisites.map((p, idx) => (
                                                                    <span key={idx} style={p.req_type === 'Success' ? styles.prereqBadgeSuccess : styles.prereqBadgeStudy}>
                                                                   <AlertCircle size={10} /> {p.req_type === 'Success' ? 'نجاح:' : 'دراسة:'} {p.course_code} - {p.title}
                                                                    </span>
                                                                )) : <span style={{color:'#cbd5e1', fontSize:'10px'}}>لا يوجد</span>}
                                                            </div>
                                                            <div style={{flex: 1, fontSize:'13px'}}>{c.delivery_mode }</div>
                                                            <div style={{flex: 1.2, display:'flex', gap:'5px', justifyContent:'center'}}>
                                                                <button onClick={() => { setEditingPlanCourseId(c.course_id); setEditPlanCourseData({...c}); fetchPrereqs(currentPlan.plan_id, c.course_id); }} style={styles.editBtn}>تخصيص</button>
                                                                <button onClick={() => handleUnlinkCourse(c.course_id)} style={styles.delIconBtn}><X size={18}/></button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))}
                            </div>

                            {}
                            <div style={styles.linkBar}>
                                <div style={{display: 'flex', gap: '15px', alignItems: 'center', flex: 1}}>
                                    <label style={{fontWeight:'bold'}}>المادة:</label>
                                    <select value={selectedCatalogId} onChange={(e) => setSelectedCatalogId(e.target.value)} style={{...styles.selectInput, flex: 2}}>
                                        <option value="">-- اختر مادة للربط --</option>
                                        {catalog.filter(cat => !courseList.some(cl => String(cl.course_id) === String(cat.course_id))).map(cat => (
                                            <option key={cat.course_id} value={cat.course_id}>{cat.course_code} - {cat.title}</option>
                                        ))}
                                    </select>
                                    <label style={{fontWeight:'bold'}}>التصنيف:</label>
                                    <select value={linkCategory} onChange={e => setLinkCategory(e.target.value)} style={{...styles.selectInput, flex: 1}}>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                    </select>
                                    <button onClick={handleLinkCourse} style={styles.saveBtn}><Plus size={18}/> ربط المادة</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: 'Segoe UI, sans-serif' },
    sidebar: { width: '270px', backgroundColor: '#1e293b', color: '#fff', padding: '25px', display: 'flex', flexDirection: 'column' },
    logoSection: { borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '20px', fontWeight: 'bold' },
    nav: { flex: 1 },
    navItem: { display: 'flex', gap: '10px', padding: '12px', width: '100%', background: 'none', border: 'none', color: '#94a3b8', textAlign: 'right', cursor: 'pointer', borderRadius: '8px', marginBottom: '5px' },
    activeNavItem: { display: 'flex', gap: '10px', padding: '12px', width: '100%', backgroundColor: '#2563eb', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold' },
    logoutBtn: { padding: '12px', backgroundColor: '#ef444415', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: 'auto' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
    topHeader: { height: '80px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid #e2e8f0' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    userAvatar: { width: '35px', height: '35px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#2563eb' },
    pageTitle: { fontSize: '20px', fontWeight: 'bold' },
    contentArea: { padding: '30px' },
    card: { backgroundColor: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#64748b' },
    selectInput: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' },
    inputField: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'right' },
    tableContainer: { border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' },
    tableHeader: { display: 'flex', backgroundColor: '#f8fafc', padding: '15px', fontWeight: 'bold', color: '#64748b', borderBottom: '1px solid #e2e8f0' },
    tableRow: { display: 'flex', padding: '15px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' },
    gridHeaderFixed: { display: 'flex', gap: '10px', padding: '15px', backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 'bold', fontSize:'13px' },
    gridRowFixed: { display: 'flex', gap: '10px', padding: '12px 15px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' },
    editingRowFixed: { display: 'flex', gap: '15px', padding: '15px', backgroundColor: '#eff6ff', borderBottom: '2px solid #2563eb' },
    editInput: { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'right', fontSize:'13px' },
    saveBtn: { display: 'flex', gap: '5px', padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    viewBtn: { display: 'flex', gap: '5px', padding: '8px 15px', backgroundColor: '#2563eb15', color: '#2563eb', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    addBtn: { display: 'flex', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    delBtn: { color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
    modalCard: { width: '95vw', height: '90vh', backgroundColor: '#fff', borderRadius: '15px', padding: '30px', display: 'flex', flexDirection: 'column' },
    smallModalCard: { width: '420px', backgroundColor: '#fff', borderRadius: '15px', padding: '25px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' },
    circularCloseBtn: { width: '35px', height: '35px', borderRadius: '50%', border: 'none', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
    saveActionBtn: { padding: '6px', color: '#fff', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cancelActionBtn: { padding: '6px', color: '#fff', backgroundColor: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    delIconBtn: { color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
    editBtn: { color: '#d97706', backgroundColor: '#fffbeb', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
    linkBar: { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: '#f1f5f9', marginTop: 'auto', borderRadius: '12px' },
    modalBody: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    scrollArea: { flex: 1, overflowY: 'auto' },
    yearHeader: { backgroundColor: '#1e293b', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' },
    prereqBadgeSuccess: { backgroundColor: '#fef2f2', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', border: '1px solid #fee2e2', fontWeight:'bold' },
    prereqBadgeStudy: { backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', border: '1px solid #dbeafe', fontWeight:'bold' },
    prereqManager: { marginTop: '10px', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #2563eb' },
    prereqTitle: { fontSize: '12px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' },
    addPrereqRow: { display: 'flex', gap: '8px', alignItems: 'center' },
    miniSelect: { padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' },
    addPrereqBtn: { padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
    prereqListWrap: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' },
    cancelBtn: { padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default DataEntryDashboard;