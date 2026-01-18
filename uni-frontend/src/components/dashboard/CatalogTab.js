import React from 'react';

const CatalogTab = ({ catalog, styles }) => {
    
    
    return (
        <div style={styles.card}>
            <div style={styles.tableContainer}>
                
                {}
                <div style={styles.gridHeaderFixed}>
                    <div style={{flex: 1}}>الرمز</div>
                    <div style={{flex: 4}}>اسم المادة</div> {}
                    <div style={{flex: 1.2}}>رقم السطر</div>
                    <div style={{flex: 0.8}}>ساعة</div>
                    <div style={{flex: 0.8}}>نظري</div>
                    <div style={{flex: 0.8}}>عملي</div>
                </div>

                {}
                <div style={styles.scrollArea}>
                    {catalog.map(c => (
                        <div key={c.course_id} style={styles.gridRowFixed}>
                            {}
                            <div style={{flex: 1, fontWeight:'bold', color:'#2563eb'}}>
                                {c.course_code}
                            </div>
                            <div style={{flex: 4}}>
                                {c.title}
                            </div>
                            <div style={{flex: 1.2, color: '#64748b'}}>
                                {c.line_number}
                            </div>
                            <div style={{flex: 0.8}}>
                                {c.credit_hours}
                            </div>
                            <div style={{flex: 0.8}}>
                                {c.theory_hours}
                            </div>
                            <div style={{flex: 0.8}}>
                                {c.practical_hours}
                            </div>
                            
                            {}
                        </div>
                    ))}
                    
                    {}
                    {catalog.length === 0 && (
                        <div style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>
                            لا توجد مواد في المكتبة حالياً.
                        </div>
                    )}
                </div>
                
                {}
            </div>
        </div>
    );
};

export default CatalogTab;