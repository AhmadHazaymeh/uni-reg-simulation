import React from 'react';
import { Eye, Trash2, Plus } from 'lucide-react';

const PlansTab = ({ plans, selectedSpec, setSelectedSpec, setShowPlanModal, openEditModal, handleDeletePlan, styles }) => {
    
    const specNames = {
        'SE': 'هندسة البرمجيات',
        'CS': 'علم الحاسوب',
        'CIS': 'نظم المعلومات الحاسوبية',
        'CY': 'الأمن السيبراني'
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <div style={styles.filterGroup}>
                    <label style={styles.label}>اختيار التخصص لعرض الخطط:</label>
                    <select 
                        value={selectedSpec} 
                        onChange={(e) => setSelectedSpec(e.target.value)} 
                        style={styles.selectInput}
                    >
                        {['SE', 'CS', 'CIS', 'CY'].map(s => (
                            <option key={s} value={s}>
                                {specNames[s]} {}
                            </option>
                        ))}
                    </select>
                </div>
                <button style={styles.addBtn} onClick={() => setShowPlanModal(true)}>
                    <Plus size={18} /> إنشاء خطة جديدة لهذا التخصص
                </button>
            </div>
            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <div style={{flex: 3}}>اسم الخطة الدراسي</div>
                    <div style={{flex: 1}}>الساعات المعتمدة</div>
                    <div style={{flex: 2, textAlign: 'center'}}>خيارات التحكم</div>
                </div>
                {plans.map(p => (
                    <div key={p.plan_id} style={styles.tableRow}>
                        <div style={{flex: 3, fontWeight: 'bold', color: '#1e293b'}}>{p.plan_name}</div>
                        <div style={{flex: 1}}>{p.total_hours} ساعة</div>
                        <div style={{flex: 2, display: 'flex', gap: '10px', justifyContent: 'center'}}>
                            <button style={styles.viewBtn} onClick={() => openEditModal(p)}>
                                <Eye size={16} /> عرض وتخصيص المواد
                            </button>
                            <button style={styles.delBtn} onClick={() => handleDeletePlan(p.plan_id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlansTab;