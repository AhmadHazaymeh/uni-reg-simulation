import React, { useState, useEffect } from 'react';
import { 
    School, UserCog, Users, UserPlus, Trash2, Edit, 
    Search, Mail, Hash, X, Save, KeyRound, ChevronLeft, LayoutDashboard, Settings
} from 'lucide-react';
import { api } from '../api/api';
import Swal from 'sweetalert2';



const HoDDashboard = () => { 
    return (
<div style={{ textAlign: 'center', marginTop: '50px' }}>
 <h1>لوحة رئيس القسم</h1>
<p>مرحباً بك دكتور حمزة هون بتقدر تراقب شعب المواد وتتخذ القرارات .</p>
 </div>
 );
};
export default HoDDashboard;