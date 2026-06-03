import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import validators

@pytest.mark.parametrize("data, expected_error", [
    ({}, "البريد الإلكتروني أو الرقم الوظيفي مطلوب"),
    ({"email": "admin"}, "كلمة المرور مطلوبة"),
    ({"email": "admin", "password": "123"}, None)
], ids=["empty_data", "missing_password", "valid_login"])
def test_validate_login_data(data, expected_error):
    errors = validators.validate_login_data(data)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, id_pattern, expected_error", [
    ({}, r"^\d{6}$", "الرقم الجامعي مطلوب للدخول"),
    ({"student_id": "158A38", "password": "123"}, r"^\d{6}$", "لا يتبع تنسيق الأرقام الجامعية"),
    ({"student_id": "158138"}, r"^\d{6}$", "كلمة المرور مطلوبة"),
    ({"student_id": "158138", "password": "123"}, r"^\d{6}$", None)
], ids=["missing_id", "invalid_format", "missing_password", "valid_student"])
def test_validate_student_login_data(data, id_pattern, expected_error):
    errors = validators.validate_student_login_data(data, id_pattern)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, email_domain, id_pattern, expected_error", [
    ({}, "just.edu.jo", r"^\d{6}$", "الرقم الجامعي مطلوب"),
    ({"student_id": "158A38"}, "just.edu.jo", r"^\d{6}$", "صيغة الرقم الجامعي غير صحيحة"),
    ({"student_id": "158138"}, "just.edu.jo", r"^\d{6}$", "البريد الإلكتروني مطلوب"),
    ({"student_id": "158138", "email": "test@gmail.com"}, "just.edu.jo", r"^\d{6}$", "يجب استخدام البريد"),
    ({"student_id": "158138", "email": "t@just.edu.jo"}, "just.edu.jo", r"^\d{6}$", "كلمة المرور مطلوبة"),
    ({"student_id": "158138", "email": "t@just.edu.jo", "password": "123"}, "just.edu.jo", r"^\d{6}$", "6 خانات على الأقل"),
    ({"student_id": "158138", "email": "t@just.edu.jo", "password": "password"}, "just.edu.jo", r"^\d{6}$", None)
], ids=["missing_id", "invalid_id", "missing_email", "invalid_email", "missing_pass", "short_pass", "valid_reg"])
def test_validate_student_data(data, email_domain, id_pattern, expected_error):
    errors = validators.validate_student_data(data, email_domain, id_pattern)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, expected_error", [
    ({}, "الحقل 'course_code' مطلوب"),
    ({"course_code": "CS101", "line_number": -5, "title": "A", "credit_hours": 3, "theory_hours": 3, "practical_hours": 0}, "رقم السطر يجب أن يكون قيمة موجبة"),
    ({"course_code": "CS101", "line_number": 1, "title": "A", "credit_hours": -1, "theory_hours": 3, "practical_hours": 0}, "يجب أن يكون عدد الساعات المعتمدة أكبر من 0"),
    ({"course_code": "CS101", "line_number": 1, "title": "A", "credit_hours": "abc", "theory_hours": 3, "practical_hours": 0}, "يجب إدخال قيم عددية صحيحة في حقول الأرقام والساعات"),
    ({"course_code": "CS101", "line_number": 1, "title": "A", "credit_hours": 3, "theory_hours": 3, "practical_hours": 0}, None)
], ids=["missing_code", "negative_line", "negative_credits", "invalid_credits", "valid_course"])
def test_validate_course_data(data, expected_error):
    errors = validators.validate_course_data(data)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, expected_error", [
    ({}, "اسم الخطة مطلوب"),
    ({"plan_name": "A"}, "القسم مطلوب لإنشاء الخطة"),
    ({"plan_name": "A", "dept_id": 1}, "عدد الساعات الكلية مطلوب"),
    ({"plan_name": "A", "dept_id": 1, "total_hours": -5}, "يجب أن يكون عدد الساعات الكلية أكبر من صفر"),
    ({"plan_name": "A", "dept_id": 1, "total_hours": "abc"}, "يجب إدخال قيمة عددية صحيحة للساعات الكلية"),
    ({"plan_name": "A", "dept_id": 1, "total_hours": 132}, None)
], ids=["missing_plan_name", "missing_dept", "missing_hours", "negative_hours", "invalid_hours", "valid_plan"])
def test_validate_plan_data(data, expected_error):
    errors = validators.validate_plan_data(data)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, expected_error", [
    ({"course_id": 1}, "الحقل 'days' مطلوب"),
    ({"course_id": 1, "days": "MW", "start_time": "1", "end_time": "2", "delivery_mode": "On-site", "capacity": -5}, "أكبر من صفر"),
    ({"course_id": 1, "days": "MW", "start_time": "1", "end_time": "2", "delivery_mode": "On-site", "capacity": "abc"}, "قيمة عددية"),
    ({"course_id": 1, "days": "MW", "start_time": "1", "end_time": "2", "delivery_mode": "On-site", "capacity": 50}, None)
], ids=["missing_days", "negative_cap", "invalid_cap", "valid_section"])
def test_validate_section_data(data, expected_error):
    errors = validators.validate_section_data(data)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, expected_error", [
    ({}, "رقم الطالب مطلوب"),
    ({"student_id": 1}, "رقم المادة مطلوب"),
    ({"student_id": 1, "course_id": 1}, None)
], ids=["missing_student", "missing_course", "valid_vote"])
def test_validate_vote_data(data, expected_error):
    errors = validators.validate_vote_data(data)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0

@pytest.mark.parametrize("data, expected_error", [
    ({}, "يجب اختيار مادة"),
    ({"course_id": 1}, "يجب تحديد السنة الدراسية"),
    ({"course_id": 1, "year_level": 1}, "يجب تحديد الفصل الدراسي"),
    ({"course_id": 1, "year_level": 1, "semester": 1}, "يجب تحديد تصنيف المادة"),
    ({"course_id": 1, "year_level": 6, "semester": 1, "category": "Mandatory"}, "السنة الدراسية يجب أن تكون بين 1 و 5"),
    ({"course_id": 1, "year_level": 4, "semester": 5, "category": "Mandatory"}, "الفصل الدراسي يجب أن يكون 1"),
    ({"course_id": 1, "year_level": "a", "semester": 1, "category": "Mandatory"}, "أرقاماً"),
    ({"course_id": 1, "year_level": 2, "semester": 1, "category": "Mandatory"}, None)
], ids=["missing_course", "missing_year", "missing_semester", "missing_category", "invalid_year", "invalid_semester", "not_numbers", "valid_link"])
def test_validate_plan_course_link(data, expected_error):
    errors = validators.validate_plan_course_link(data)
    if expected_error: assert any(expected_error in e for e in errors)
    else: assert len(errors) == 0