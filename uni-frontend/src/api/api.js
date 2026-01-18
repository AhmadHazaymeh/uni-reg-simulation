import axios from 'axios';

const API_BASE = "http://127.0.0.1:5000/api";

export const api = {
    //  Plans
    getPlans: () => axios.get(`${API_BASE}/plans`),
    createPlan: (planData) => axios.post(`${API_BASE}/plans`, planData),
    deletePlan: (planId) => axios.delete(`${API_BASE}/plans/${planId}`),
    deletePlanCoursePrereq: (planId, courseId, data) => axios.post(`${API_BASE}/plans/${planId}/courses/${courseId}/prereqs/delete`, data),
        

    // Catalog
    getCatalog: () => axios.get(`${API_BASE}/catalog/courses`),
    

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
    
    getStaffSchedule: () => axios.get(`${API_BASE}/sections`),
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
    
};