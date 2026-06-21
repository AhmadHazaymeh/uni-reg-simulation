import axios from 'axios';

const API_BASE = "http://127.0.0.1:5000/api";

export const api = {
    //Plans
    getPlans: (deptId) => axios.get(`${API_BASE}/plans`, { params: { dept_id: deptId } }),    createPlan: (planData) => axios.post(`${API_BASE}/plans`, planData),
    deletePlan: (planId) => axios.delete(`${API_BASE}/plans/${planId}`),
    deletePlanCoursePrereq: (planId, courseId, data) => axios.post(`${API_BASE}/plans/${planId}/courses/${courseId}/prereqs/delete`, data),
        

    //Catalog
   getCatalog: (deptId) => axios.get(`${API_BASE}/catalog/courses`, { params: { dept_id: deptId } }),
   addCourse: (courseData) => axios.post(`${API_BASE}/add-course`, courseData), 
   updateCourse: (id, data) => axios.put(`${API_BASE}/courses/${id}`, data), 
    deleteCourse: (id) => axios.delete(`${API_BASE}/courses/${id}`),

    // Plan-Courses
    getPlanCourses: (planId) => axios.get(`${API_BASE}/plans/${planId}/courses`),
    updatePlanCourseDetails: (planId, courseId, data) => axios.put(`${API_BASE}/plans/${planId}/courses/${courseId}`, data),
    linkCourseToPlan: (planId, data) => axios.post(`${API_BASE}/plans/${planId}/courses/link`, data),
    unlinkCourseFromPlan: (planId, courseId) => axios.delete(`${API_BASE}/plans/${planId}/courses/${courseId}`),

    // plan course
    getPlanCoursePrereqs: (planId, courseId) => axios.get(`${API_BASE}/plans/${planId}/courses/${courseId}/prereqs`),
    addPlanCoursePrereq: (planId, courseId, data) => axios.post(`${API_BASE}/plans/${planId}/courses/${courseId}/prereqs`, data),

    // Schedule 
    getStudentSchedule: (studentId) => axios.get(`${API_BASE}/student/schedule`, { params: { student_id: studentId } }),
    
    getStaffSchedule: (deptId) => axios.get(`${API_BASE}/sections`, { params: { dept_id: deptId } }),
    createSection: (data) => axios.post(`${API_BASE}/sections`, data),
    updateSection: (id, data) => axios.put(`${API_BASE}/sections/${id}`, data),
    deleteSection: (id, params) => axios.delete(`${API_BASE}/sections/${id}`, { params }),
    publishSchedule: () => axios.post(`${API_BASE}/sections/publish`),

    // Registration and Voting
createStudent: (data) => axios.post(`${API_BASE}/students`, data),
    loginStudent: (data) => axios.post(`${API_BASE}/student/login`, data),    
    submitVote: (voteData) => axios.post(`${API_BASE}/student/vote`, voteData),
    getStudentVotes: (studentId) => axios.get(`${API_BASE}/student/${studentId}/votes`),
    removeVote: (voteData) => axios.post(`${API_BASE}/student/vote/remove`, voteData),

   //admin
   
    //  قائمة الموظفين
getStaff: (uni_id) => axios.get(`${API_BASE}/admin/staff?uni_id=${uni_id}`),    
    // إضافة موظف جديد (أدمن، رئيس قسم، مدخل بيانات)
    addStaff: (staffData) => axios.post(`${API_BASE}/admin/add-staff`, staffData),
    
    // تحديث بيانات موظف 
    updateStaff: (staffId, data) => axios.put(`${API_BASE}/admin/staff/${staffId}`, data),
    
    // حذف موظف 
deleteStaff: (staffId) => axios.delete(`${API_BASE}/staff/${staffId}`),
    
getAdminStudents: (uni_id) => axios.get(`${API_BASE}/admin/students?uni_id=${uni_id}`),    
    updateStudent: (studentId, data) => axios.put(`${API_BASE}/admin/students/${studentId}`, data),

getDepartments: (uni_id) => axios.get(`${API_BASE}/admin/departments?uni_id=${uni_id}`),
//hod
getHODAnalytics: (deptId) => axios.get(`${API_BASE}/hod/analytics`, { params: { dept_id: deptId } }),
getHODFinalReport: (deptId) => axios.get(`${API_BASE}/hod/final_report`, { params: { dept_id: deptId } }), 



getUniversities: () => axios.get(`${API_BASE}/universities`),


loginStaff: (data) => axios.post(`${API_BASE}/staff/login`, data),




// Notifications 
    getNotifications: (studentId) => axios.get(`${API_BASE}/student/${studentId}/notifications`),
    markNotificationsRead: (studentId) => axios.post(`${API_BASE}/student/${studentId}/notifications/read`),
    publishSchedule: (data) => axios.post(`${API_BASE}/publish-schedule`, data),


// Waitlist 
    joinWaitlist: (data) => axios.post(`${API_BASE}/waitlist`, data),
    leaveWaitlist: (studentId, sectionId) => axios.delete(`${API_BASE}/waitlist`, { params: { student_id: studentId, section_id: sectionId } }),
    getWaitlist: (studentId) => axios.get(`${API_BASE}/waitlist/${studentId}`),



// Academic Structure
createUniversity: (data) => axios.post(`${API_BASE}/admin/universities`, data),
updateUniversity: (id, data) => axios.put(`${API_BASE}/admin/universities/${id}`, data),
deleteUniversity: (id) => axios.delete(`${API_BASE}/admin/universities/${id}`),

createFaculty: (data) => axios.post(`${API_BASE}/admin/faculties`, data),
updateFaculty: (id, data) => axios.put(`${API_BASE}/admin/faculties/${id}`, data),
deleteFaculty: (id) => axios.delete(`${API_BASE}/admin/faculties/${id}`),

createDepartment: (data) => axios.post(`${API_BASE}/admin/departments`, data),
updateDepartment: (id, data) => axios.put(`${API_BASE}/admin/departments/${id}`, data),
deleteDepartment: (id) => axios.delete(`${API_BASE}/admin/departments/${id}`),
















};