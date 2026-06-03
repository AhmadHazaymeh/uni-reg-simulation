import pytest
import sys
import os
import json
from datetime import time, datetime, timedelta
from unittest.mock import patch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app, CustomJSONProvider

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['PROPAGATE_EXCEPTIONS'] = False
    with app.test_client() as client:
        yield client

# 1.    Custom JSON Provider  

def test_custom_json_provider():
    provider = CustomJSONProvider(app)
    assert provider.default(time(10, 30)) == "10:30:00"
    assert provider.default(timedelta(hours=1)) == "1:00:00"
    assert provider.default(datetime(2026, 1, 1, 12, 0)) == "2026-01-01T12:00:00"
    with pytest.raises(TypeError):
        provider.default(set([1, 2]))

def test_500_error_handler(client):
    with patch('app.validators.validate_login_data', side_effect=Exception("Test Error")):
        res = client.post('/api/staff/login', json={"uni_id": 1, "email": "test"})
        assert res.status_code == 500


# 2. login & register   

@patch('app.validators.validate_login_data')
@patch('app.services.login_staff_service')
def test_staff_login(mock_login, mock_val, client):
    assert client.post('/api/staff/login', json={}).status_code == 400
    mock_val.return_value = ["error"]
    assert client.post('/api/staff/login', json={"uni_id": 1}).status_code == 400
    mock_val.return_value = []
    mock_login.return_value = {"status": "success"}
    assert client.post('/api/staff/login', json={"uni_id": 1}).status_code == 200

@patch('app.services.login_student_service')
def test_student_login(mock_login, client):
    assert client.post('/api/student/login', json={}).status_code == 400
    mock_login.return_value = {"status": "error"}
    assert client.post('/api/student/login', json={"uni_id": 1}).status_code == 401
    mock_login.return_value = {"status": "success"}
    assert client.post('/api/student/login', json={"uni_id": 1}).status_code == 200

@patch('app.validators.validate_student_data')
@patch('app.services.get_university_settings')
@patch('app.services.create_student_service')
def test_register_student(mock_create, mock_settings, mock_val, client):
    assert client.post('/api/students', json={}).status_code == 400
    mock_settings.return_value = None
    assert client.post('/api/students', json={"uni_id": 1}).status_code == 404
    mock_settings.return_value = {"email_domain": "just", "id_pattern": "123"}
    mock_val.return_value = ["error"]
    assert client.post('/api/students', json={"uni_id": 1}).status_code == 400
    mock_val.return_value = []
    mock_create.return_value = {"status": "success"}
    assert client.post('/api/students', json={"uni_id": 1}).status_code == 201
    mock_create.return_value = {"status": "error"}
    assert client.post('/api/students', json={"uni_id": 1}).status_code == 400

# 3.Plans & Sections
@patch('app.validators.validate_plan_data')
@patch('app.services.create_study_plan_service')
@patch('app.services.get_all_plans_service')
def test_manage_plans(mock_get, mock_create, mock_val, client):
    mock_get.return_value = [] 
    assert client.get('/api/plans?dept_id=1').status_code == 200
    mock_val.return_value = ["error"]
    assert client.post('/api/plans', json={}).status_code == 400
    mock_val.return_value = []
    mock_create.return_value = {"status": "success"}
    assert client.post('/api/plans', json={}).status_code == 201

@patch('app.validators.validate_section_data')
@patch('app.services.create_section_service')
@patch('app.services.get_all_sections_service')
def test_manage_sections(mock_get, mock_create, mock_val, client):
    mock_get.return_value = [] 
    assert client.get('/api/sections?dept_id=1').status_code == 200
    mock_val.return_value = ["error"]
    assert client.post('/api/sections', json={}).status_code == 400
    mock_val.return_value = []
    mock_create.return_value = {"status": "conflict"}
    assert client.post('/api/sections', json={}).status_code == 409
    mock_create.return_value = {"status": "success"}
    assert client.post('/api/sections', json={}).status_code == 201

@patch('app.services.update_section_service')
def test_update_section_route(mock_update, client):
    mock_update.return_value = {"status": "conflict"}
    assert client.put('/api/sections/1', json={}).status_code == 409
    mock_update.return_value = {"status": "success"}
    assert client.put('/api/sections/1', json={}).status_code == 200

@patch('app.services.delete_section_service')
def test_delete_section_route(mock_del, client):
    mock_del.return_value = {"status": "success"}
    assert client.delete('/api/sections/1?keep_votes=true').status_code == 200

# 4. student schedule & voting  
@patch('app.services.get_student_schedule_service')
def test_get_student_schedule(mock_sch, client):
    assert client.get('/api/student/schedule').status_code == 400
    mock_sch.return_value = []
    assert client.get('/api/student/schedule?student_id=1').status_code == 200

@patch('app.validators.validate_vote_data')
@patch('app.services.submit_student_vote_service')
def test_student_vote(mock_submit, mock_val, client):
    mock_val.return_value = ["error"]
    assert client.post('/api/student/vote', json={}).status_code == 400
    mock_val.return_value = []
    mock_submit.return_value = {"status": "success"}
    assert client.post('/api/student/vote', json={}).status_code == 201
    mock_submit.return_value = {"status": "error"}
    assert client.post('/api/student/vote', json={}).status_code == 400

# 5. course prerequisites management

@patch('app.services.get_course_prereqs_service')
@patch('app.services.add_prerequisite_service')
def test_manage_prereqs(mock_add, mock_get, client):
    mock_get.return_value = []  
    assert client.get('/api/plans/1/courses/1/prereqs').status_code == 200
    mock_add.return_value = {"status": "error"}
    assert client.post('/api/plans/1/courses/1/prereqs', json={}).status_code == 400
    mock_add.return_value = {"status": "success"}
    assert client.post('/api/plans/1/courses/1/prereqs', json={}).status_code == 201

@patch('app.services.add_new_course_service')
def test_add_course(mock_srv, client):
    mock_srv.return_value = {"status": "error"}
    assert client.post('/api/add-course', json={}).status_code == 400
    mock_srv.return_value = {"status": "success"}
    assert client.post('/api/add-course', json={}).status_code == 201

@patch('app.services.get_db_connection')
def test_get_universities_tree(mock_db, client):
    mock_cursor = mock_db.return_value.cursor.return_value
    mock_cursor.fetchall.side_effect = [[{'id':1, 'name':'A'}], [{'id':1, 'uni_id':1}], [{'id':1, 'fac_id':1}]]
    assert client.get('/api/universities').status_code == 200

@patch('app.services.admin_add_staff_service')
def test_add_staff(mock_srv, client):
    mock_srv.return_value = {"status": "error"}
    assert client.post('/api/admin/add-staff', json={}).status_code == 400
    mock_srv.return_value = {"status": "success"}
    assert client.post('/api/admin/add-staff', json={}).status_code == 201

# 6. Test all other simple routes with mocked services 
@pytest.mark.parametrize("method, route, mock_func", [
    ('GET', '/api/catalog/courses', 'app.services.get_all_courses_catalog_service'),
    ('DELETE', '/api/plans/1', 'app.services.delete_study_plan_service'),
    ('GET', '/api/plans/1/courses', 'app.services.get_courses_by_plan_service'),
    ('POST', '/api/plans/1/courses/link', 'app.services.link_course_to_plan_service'),
    ('PUT', '/api/plans/1/courses/1', 'app.services.update_plan_course_details_service'),
    ('DELETE', '/api/plans/1/courses/1', 'app.services.remove_course_from_plan_service'),
    ('POST', '/api/plans/1/courses/1/prereqs/delete', 'app.services.delete_prerequisite_service'),
    ('POST', '/api/publish-schedule', 'app.services.publish_schedule_service'),
    ('POST', '/api/student/vote/remove', 'app.services.remove_vote_service'),
    ('GET', '/api/student/1/votes', 'app.services.get_student_votes_service'),
    ('DELETE', '/api/staff/1', 'app.services.delete_staff_service'),
    ('PUT', '/api/admin/staff/1', 'app.services.admin_update_staff_service'),
    ('PUT', '/api/admin/students/1', 'app.services.admin_update_student_service'),
    ('GET', '/api/hod/final_report', 'app.services.get_hod_final_report_service'),
    ('PUT', '/api/courses/1', 'app.services.update_course_service'),
    ('DELETE', '/api/courses/1', 'app.services.delete_course_service'),
    ('GET', '/api/student/1/notifications', 'app.services.get_student_notifications_service'),
    ('POST', '/api/student/1/notifications/read', 'app.services.mark_notifications_read_service'),
    ('POST', '/api/waitlist', 'app.services.join_waitlist_service'),
    ('DELETE', '/api/waitlist?student_id=1&section_id=1', 'app.services.leave_waitlist_service'),
    ('GET', '/api/waitlist/1', 'app.services.get_student_waitlist_service'),
    ('POST', '/api/admin/universities', 'app.services.admin_add_university_service'),
    ('PUT', '/api/admin/universities/1', 'app.services.admin_update_university_service'),
    ('DELETE', '/api/admin/universities/1', 'app.services.admin_delete_university_service'),
    ('POST', '/api/admin/faculties', 'app.services.admin_add_faculty_service'),
    ('PUT', '/api/admin/faculties/1', 'app.services.admin_update_faculty_service'),
    ('DELETE', '/api/admin/faculties/1', 'app.services.admin_delete_faculty_service'),
    ('POST', '/api/admin/departments', 'app.services.admin_add_department_service'),
    ('PUT', '/api/admin/departments/1', 'app.services.admin_update_department_service'),
    ('DELETE', '/api/admin/departments/1', 'app.services.admin_delete_department_service'),
    ('GET', '/api/admin/staff?uni_id=1', 'app.services.admin_get_all_staff_service'),
    ('GET', '/api/admin/students?uni_id=1', 'app.services.admin_get_all_students_service'),
    ('GET', '/api/admin/departments?uni_id=1', 'app.services.admin_get_all_departments_service'),
    ('GET', '/api/hod/analytics?dept_id=1', 'app.services.get_hod_analytics_service'),
])
def test_all_simple_routes(client, method, route, mock_func):
    with patch(mock_func) as mock_srv:
        mock_srv.return_value = []  
        
        payload = {"student_id": "1", "section_id": 1, "course_id": 1, "uni_id": 1}
        
        if method == 'GET': res = client.get(route)
        elif method == 'POST': res = client.post(route, json=payload)
        elif method == 'PUT': res = client.put(route, json=payload)
        elif method == 'DELETE': res = client.delete(route)
        
        assert res.status_code in [200, 201]