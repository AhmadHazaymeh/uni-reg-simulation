import pytest
from unittest.mock import patch, MagicMock
from datetime import timedelta
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import services

@pytest.fixture
def mock_db():
    with patch('services.get_db_connection') as mock_conn_func:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn_func.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = None
        mock_cursor.fetchall.return_value = []
        yield mock_conn, mock_cursor

# 1. Auth & Registration
def test_login_staff(mock_db):
    conn, cursor = mock_db
    assert services.login_staff_service("e", "p", None)['status'] == 'error'
    
    cursor.fetchone.return_value = None
    assert services.login_staff_service("e", "p", 1)['status'] == 'error'
    
    cursor.fetchone.return_value = {'staff_id': 1, 'role': 'admin', 'uni_id': 1, 'name': 'A', 'dept_id': 1}
    assert services.login_staff_service("e", "p", 1)['status'] == 'success'

def test_login_student(mock_db):
    conn, cursor = mock_db
    assert services.login_student_service("1", "p", None)['status'] == 'error'
    
    cursor.fetchone.return_value = None
    assert services.login_student_service("1", "p", 1)['status'] == 'error'
    
    cursor.fetchone.return_value = {'student_id': '1', 'name': 'A', 'plan_id': 1, 'dept_id': 1, 'uni_id': 1}
    assert services.login_student_service("1", "p", 1)['status'] == 'success'

def test_create_student_service(mock_db):
    conn, cursor = mock_db
    assert services.create_student_service({'student_id': '1', 'email': 'e'})['status'] == 'error' # missing uni_id
    
    cursor.fetchone.return_value = {'student_id': '1', 'email': 'other'}
    assert services.create_student_service({'uni_id': 1, 'student_id': '1', 'email': 'e', 'password':'p'})['status'] == 'error'
    
    cursor.fetchone.return_value = {'student_id': '2', 'email': 'e'}
    assert services.create_student_service({'uni_id': 1, 'student_id': '1', 'email': 'e', 'password':'p'})['status'] == 'error'
    
    cursor.fetchone.return_value = None
    assert services.create_student_service({'uni_id': 1, 'student_id': '1', 'email': 'e', 'password':'p'})['status'] == 'success'

# 2. Plans & Courses
def test_get_all_plans(mock_db):
    conn, cursor = mock_db
    assert isinstance(services.get_all_plans_service(1), list)
    assert isinstance(services.get_all_plans_service(None), list)

def test_get_courses_by_plan(mock_db):
    conn, cursor = mock_db
    cursor.fetchall.side_effect = [[{'course_id': 1}], [{'course_id': 1, 'prereq_id': 2}]]
    assert len(services.get_courses_by_plan_service(1)[0]['prerequisites']) == 1

def test_plan_course_link(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = {'id': 1}
    assert services.link_course_to_plan_service(1, {'course_id': 1})['status'] == 'error'
    
    cursor.fetchone.return_value = None
    assert services.link_course_to_plan_service(1, {'course_id': 1, 'year_level': 1, 'semester': 1, 'category': 'A'})['status'] == 'success'

def test_remove_course_from_plan(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = (5,)
    assert services.remove_course_from_plan_service(1, 1)['status'] == 'error'
    
    cursor.fetchone.return_value = (0,)
    assert services.remove_course_from_plan_service(1, 1)['status'] == 'success'

def test_update_plan_course_details(mock_db):
    conn, cursor = mock_db
    cursor.rowcount = 0
    assert services.update_plan_course_details_service(1, 1, {})['status'] == 'error'
    cursor.rowcount = 1
    assert services.update_plan_course_details_service(1, 1, {})['status'] == 'success'

# 3. Sections & Conflicts
def test_check_schedule_conflict(mock_db):
    conn, cursor = mock_db
    cursor.fetchall.return_value = [{'section_id': 1, 'course_code': 'C1', 'room_id': 'R1', 'instructor_name': 'I1', 'days': 'MW'}]
    assert services.check_schedule_conflict(cursor, "M", "10", "11", room_id="R1")['type'] == 'error'
    assert services.check_schedule_conflict(cursor, "M", "10", "11", instructor_name="I1")['type'] == 'error'
    assert services.check_schedule_conflict(cursor, "UT", "10", "11", room_id="R1") is None

def test_create_section(mock_db):
    conn, cursor = mock_db
    cursor.fetchall.side_effect = [[], [{'student_id': '1', 'title': 'T', 'dept_id': 1}]]
    cursor.fetchone.return_value = {'next_num': 1}
    assert services.create_section_service({'course_id': 1, 'days': 'M', 'start_time': '10', 'end_time': '11', 'delivery_mode': 'O'})['status'] == 'success'
    
    cursor.fetchall.side_effect = [[{'section_id': 1, 'course_code': 'C1', 'room_id': 'R1', 'instructor_name': 'I1', 'days': 'M'}]]
    assert services.create_section_service({'course_id': 1, 'days': 'M', 'start_time': '10', 'end_time': '11', 'room_id': 'R1', 'delivery_mode': 'O'})['status'] == 'conflict'

def test_update_section(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = None
    assert services.update_section_service(1, {})['status'] == 'error'
    
    cursor.fetchone.return_value = {'capacity': 40, 'section_num': 1}
    cursor.fetchall.side_effect = [[], [{'student_id': '1', 'title': 'T', 'section_num': 1, 'dept_id': 1}]]
    assert services.update_section_service(1, {'days': 'M', 'start_time': '10', 'end_time': '11', 'capacity': 50})['status'] == 'success'

def test_get_all_sections(mock_db):
    conn, cursor = mock_db
    assert services.get_all_sections_service(None) == []
    cursor.fetchall.return_value = [{'start_time': '10:00', 'end_time': '11:00'}]
    assert len(services.get_all_sections_service(1)) == 1

def test_get_student_schedule(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = None
    assert services.get_student_schedule_service(1)['status'] == 'error'
    cursor.fetchone.return_value = {'plan_id': 1}
    cursor.fetchall.return_value = [{'start_time': '10:00', 'end_time': '11:00'}]
    assert isinstance(services.get_student_schedule_service(1), list)

def test_delete_section(mock_db):
    conn, cursor = mock_db
    cursor.fetchall.return_value = [{'student_id': '1', 'title': 'T', 'section_num': 1, 'dept_id': 1}]
    assert services.delete_section_service(1, keep_votes=False)['status'] == 'success'
    assert services.delete_section_service(1, keep_votes=True)['status'] == 'success'

# 4. Voting & Waitlist

def test_submit_student_vote(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = {'vote_id': 1}
    assert services.submit_student_vote_service({'student_id': '1', 'course_id': 1})['status'] == 'error'
    
    cursor.fetchone.return_value = None
    assert services.submit_student_vote_service({'student_id': '1', 'course_id': 1})['status'] == 'success'

def test_remove_vote(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.side_effect = [{'student_id': '2', 'waitlist_id': 1}, {'title': 'T', 'section_num': 1, 'dept_id': 1}]
    assert services.remove_vote_service('1', 1)['status'] == 'success'

def test_waitlist(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = {'count': 10}
    assert services.join_waitlist_service(1, 1)['status'] == 'error'
    cursor.fetchone.return_value = {'count': 5}
    assert services.join_waitlist_service(1, 1)['status'] == 'success'
    
    cursor.execute.side_effect = Exception("Duplicate")
    assert services.join_waitlist_service(1, 1)['status'] == 'error'

# 5. HoD Analytics

def test_hod_analytics(mock_db):
    conn, cursor = mock_db
    cursor.fetchall.return_value = [
        {'section_id': 1, 'capacity': 50, 'vote_count': 50, 'course_code': 'A', 'title': 'B', 'section_num': 1, 'days': 'M', 'start_time': '1', 'end_time': '2'},
        {'section_id': 2, 'capacity': 0, 'vote_count': 5, 'course_code': 'A', 'title': 'B', 'section_num': 2, 'days': 'M', 'start_time': '1', 'end_time': '2'}
    ]
    res = services.get_hod_analytics_service(1)
    assert res[0]['status'] == 'critical'
    assert res[1]['status'] == 'warning'

def test_check_time_overlap():
    assert services.check_time_overlap("MW", "10:00", "11:00", "UT", "10:00", "11:00") == False
    assert services.check_time_overlap("M", timedelta(hours=10), timedelta(hours=11), "M", timedelta(hours=10, minutes=30), timedelta(hours=11, minutes=30)) == True

def test_hod_final_report(mock_db):
    conn, cursor = mock_db
    cursor.fetchall.return_value = [
        {'course_id': 1, 'course_code': 'C1', 'title': 'T1', 'section_id': 1, 'section_num': 1, 'days': 'M', 'start_time': '10', 'end_time': '11', 'capacity': 50, 'course_category': 'إجباري', 'course_year_level': 4, 'vote_count': 50, 'waitlist_count': 5},
        {'course_id': 1, 'course_code': 'C1', 'title': 'T1', 'section_id': 2, 'section_num': 2, 'days': 'M', 'start_time': '12', 'end_time': '13', 'capacity': 50, 'course_category': 'إجباري', 'course_year_level': 4, 'vote_count': 30, 'waitlist_count': 0},
        {'course_id': 2, 'course_code': 'C2', 'title': 'T2', 'section_id': 3, 'section_num': 3, 'days': 'M', 'start_time': '10', 'end_time': '11', 'capacity': 50, 'course_category': 'إجباري', 'course_year_level': 4, 'vote_count': 5, 'waitlist_count': 0},
        {'course_id': 3, 'course_code': 'C3', 'title': 'T3', 'section_id': 4, 'section_num': 4, 'days': 'UT', 'start_time': '10', 'end_time': '11', 'capacity': 50, 'course_category': 'اختياري', 'course_year_level': 2, 'vote_count': 5, 'waitlist_count': 0}
    ]
    res = services.get_hod_final_report_service(1)
    assert res['status'] == 'success'

# 6.Database Exceptions 100%
def test_all_services_exceptions(mock_db):
    conn, cursor = mock_db
    cursor.execute.side_effect = Exception("Database Crash")
    
    assert services.create_study_plan_service("N", 1, 130)['status'] == 'error'
    assert services.delete_study_plan_service(1)['status'] == 'error'
    assert services.update_plan_course_details_service(1, 1, {})['status'] == 'error'
    assert services.link_course_to_plan_service(1, {'course_id':1, 'year_level':1, 'semester':1, 'category':'A'})['status'] == 'error'
    assert services.remove_course_from_plan_service(1, 1)['status'] == 'error'
    assert services.create_section_service({'course_id':1, 'days':'M', 'start_time':'1', 'end_time':'2', 'delivery_mode':'O'})['status'] == 'error'
    assert services.update_section_service(1, {})['status'] == 'error'
    assert services.delete_section_service(1)['status'] == 'error'
    assert services.mark_notifications_read_service(1)['status'] == 'error'
    assert services.publish_schedule_service(1)['status'] == 'error'
    assert services.submit_student_vote_service({'student_id':'1', 'course_id':1})['status'] == 'error'
    assert services.remove_vote_service(1, 1)['status'] == 'error'
    assert services.add_prerequisite_service(1, 1, 1, 'Success')['status'] == 'error'
    assert services.delete_prerequisite_service(1, 1, 1, 'Success')['status'] == 'error'
    assert services.admin_add_staff_service({'uni_id':1, 'email':'e', 'official_id':'o', 'name':'n', 'password':'p', 'role':'r'})['status'] == 'error'
    assert services.admin_update_staff_service(1, {'email':'e', 'official_id':'o', 'name':'n', 'role':'r', 'dept_id':1})['status'] == 'error'
    assert services.admin_update_student_service(1, {'name':'n', 'email':'e', 'plan_id':1})['status'] == 'error'
    assert services.delete_staff_service(1)['status'] == 'error'
    assert services.add_new_course_service({})['status'] == 'error'
    assert services.update_course_service(1, {})['status'] == 'error'
    assert services.delete_course_service(1)['status'] == 'error'
    assert services.admin_add_university_service({})['status'] == 'error'
    assert services.admin_update_university_service(1, {})['status'] == 'error'
    assert services.admin_delete_university_service(1)['status'] == 'error'
    assert services.admin_add_faculty_service({})['status'] == 'error'
    assert services.admin_update_faculty_service(1, {})['status'] == 'error'
    assert services.admin_delete_faculty_service(1)['status'] == 'error'
    assert services.admin_add_department_service({})['status'] == 'error'
    assert services.admin_update_department_service(1, {})['status'] == 'error'
    assert services.admin_delete_department_service(1)['status'] == 'error'
    assert services.get_hod_final_report_service(1)['status'] == 'error'
    assert conn.rollback.called

# 7 Admin & General GETs
def test_simple_crud_and_gets(mock_db):
    conn, cursor = mock_db
    cursor.fetchone.return_value = None
    
    # GETs
    services.get_all_courses_catalog_service(1)
    services.get_student_notifications_service(1)
    services.get_student_votes_service(1)
    services.get_course_prereqs_service(1, 1)
    services.admin_get_all_staff_service(1)
    services.admin_get_all_students_service(1)
    services.admin_get_all_departments_service(1)
    services.get_university_settings(1)
    services.get_student_waitlist_service(1)
    
    # POST/PUT/DELETE
    assert services.admin_add_staff_service({'uni_id':1, 'email':'e', 'official_id':'o', 'name':'n', 'password':'p', 'role':'r'})['status'] == 'success'
    assert services.admin_update_staff_service(1, {'email':'e', 'official_id':'o', 'name':'n', 'role':'r', 'dept_id':1})['status'] == 'success'
    assert services.admin_update_student_service(1, {'name':'n', 'email':'e', 'plan_id':1})['status'] == 'success'
    assert services.delete_staff_service(1)['status'] == 'success'
    assert services.add_new_course_service({})['status'] == 'success'
    assert services.update_course_service(1, {})['status'] == 'success'
    assert services.delete_course_service(1)['status'] == 'success'
    assert services.admin_add_university_service({})['status'] == 'success'
    assert services.admin_update_university_service(1, {})['status'] == 'success'
    assert services.admin_delete_university_service(1)['status'] == 'success'
    assert services.admin_add_faculty_service({})['status'] == 'success'
    assert services.admin_update_faculty_service(1, {})['status'] == 'success'
    assert services.admin_delete_faculty_service(1)['status'] == 'success'
    assert services.admin_add_department_service({})['status'] == 'success'
    assert services.admin_update_department_service(1, {})['status'] == 'success'
    assert services.admin_delete_department_service(1)['status'] == 'success'
    assert services.publish_schedule_service(1)['status'] == 'success'
    assert services.leave_waitlist_service(1, 1)['status'] == 'success'