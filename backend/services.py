import jwt
import datetime
import mysql.connector
from database import get_db_connection

SECRET_KEY = "JUST_SECRET_2025"



def check_schedule_conflict(cursor, days, start_time, end_time, room_id=None, instructor_name=None, exclude_id=None):
    room_id = str(room_id).strip() if room_id else "" 
    instructor_name = str(instructor_name).strip() if instructor_name else ""   
    
    query = """
        SELECT s.section_id, c.course_code, s.room_id, s.instructor_name, s.days
        FROM section s
        JOIN course c ON s.course_id = c.course_id
        WHERE (s.start_time < %s AND s.end_time > %s)
    """
    params = [end_time, start_time]

    if exclude_id:
        query += " AND s.section_id != %s"
        params.append(exclude_id)

    cursor.execute(query, params)
    potential_conflicts = cursor.fetchall()

    for row in potential_conflicts:
        if any(day in row['days'] for day in days):
            if room_id != "" and row['room_id'] == room_id:
                return {"type": "error", "message": f"تعارض مكاني: القاعة ({room_id}) محجوزة لمساق {row['course_code']}."}
            if instructor_name != "" and row['instructor_name'] == instructor_name:
                return {"type": "error", "message": f"تعارض بشري: المدرس ({instructor_name}) لديه شعبة أخرى في هذا الوقت."}
    return None


#login_staff
def login_staff_service(email, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM staff WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()

        if user:
            token = jwt.encode({
                'staff_id': user['staff_id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")
            return {"status": "success", "token": token, "user": {"name": user['name'], "role": user['role']}}
        
        return {"status": "error", "message": "البريد أو كلمة المرور غير صحيحة"}
    finally:
        cursor.close()
        conn.close()


def login_student_service(student_id, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT student_id, name, email, plan_id FROM student WHERE student_id = %s AND password = %s"
        cursor.execute(query, (student_id, password))
        student = cursor.fetchone()

        if student:
            token = jwt.encode({
                'student_id': student['student_id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")
            
            return {
                "status": "success",
                "token": token,
                "user": {
                    "name": student['name'], 
                    "id": student['student_id'],
                    "plan_id": student['plan_id'] 
                }
            }
        
        return {"status": "error", "message": "الرقم الجامعي أو كلمة المرور غير صحيحة"}
    finally:
        cursor.close()
        conn.close()
        

def get_all_plans_service():
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM studyplan")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()



def create_study_plan_service(plan_name, specialization, total_hours):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO studyplan (plan_name, specialization, total_hours) VALUES (%s, %s, %s)"
        cursor.execute(query, (plan_name, specialization, total_hours))
        conn.commit()
        return {"status": "success", "plan_id": cursor.lastrowid}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def delete_study_plan_service(plan_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM plan_course WHERE plan_id = %s", (plan_id,))   #delete the links first (foreign key problems) (plan_course: pivote table)
        cursor.execute("DELETE FROM studyplan WHERE plan_id = %s", (plan_id,))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def get_all_courses_catalog_service():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM course ORDER BY course_code ASC")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()





  
def get_courses_by_plan_service(plan_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT c.course_id, c.course_code, c.line_number,
                   pc.category, pc.year_level, pc.semester, pc.delivery_mode,
                   COALESCE(pc.custom_title, c.title) as title,
                   COALESCE(pc.custom_credit_hours, c.credit_hours) as credit_hours
            FROM course c
            JOIN plan_course pc ON c.course_id = pc.course_id
            WHERE pc.plan_id = %s
            ORDER BY pc.year_level ASC, pc.semester ASC
        """
        cursor.execute(query, (plan_id,))
        courses = cursor.fetchall()

        prereq_query = """
            SELECT p.course_id, p.prereq_id, p.req_type, c.course_code
            FROM prerequisites p
            JOIN course c ON p.prereq_id = c.course_id
            WHERE p.plan_id = %s
        """
        cursor.execute(prereq_query, (plan_id,))
        all_prereqs = cursor.fetchall()

        for course in courses:
            course['prerequisites'] = [
                p for p in all_prereqs if p['course_id'] == course['course_id']
            ]

        return courses
    finally:
        cursor.close()
        conn.close()

def update_plan_course_details_service(plan_id, course_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            UPDATE plan_course
            SET custom_title = %s, 
                custom_credit_hours = %s, 
                custom_theory_hours = %s,
                custom_practical_hours = %s, 
                delivery_mode = %s,
                is_confirmed = 1
            WHERE plan_id = %s AND course_id = %s
        """
        
        cursor.execute(query, (
            data.get('title'), 
            data.get('credit_hours'), 
            data.get('theory_hours', 0),   
            data.get('practical_hours', 0), 
            data.get('delivery_mode'),  
            plan_id, 
            course_id
        ))
        
        conn.commit()

        if cursor.rowcount == 0:
            return {"status": "error", "message": "لم يتم العثور على المادة المطلوبة لتحديثها"}

        return {"status": "success"}

    except Exception as e:
        conn.rollback()
        print(f"Database Error: {str(e)}") 
        return {"status": "error", "message": "فشل في تحديث قاعدة البيانات"}
    finally:
        cursor.close()
        conn.close()


def link_course_to_plan_service(plan_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM plan_course WHERE plan_id = %s AND course_id = %s", (plan_id, data['course_id']))
        if cursor.fetchone():
            return {"status": "error", "message": "هذه المادة مرتبطة بهذه الخطة مسبقاً"}

        query = """
            INSERT INTO plan_course (plan_id, course_id, year_level, semester, category) 
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            plan_id, data['course_id'], data['year_level'], 
            data['semester'], data['category']
        ))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def remove_course_from_plan_service(plan_id, course_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM vote WHERE course_id = %s", (course_id,))
        if cursor.fetchone()[0] > 0:
            return {"status": "error", "message": "لا يمكن الإزالة؛ المادة تمتلك تصويتات نشطة من الطلاب"}

        cursor.execute("DELETE FROM plan_course WHERE plan_id = %s AND course_id = %s", (plan_id, course_id))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


# sections adn Scheduling

def create_section_service(data):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # check conflict before add the section
        conflict = check_schedule_conflict(
            cursor, data['days'], data['start_time'], data['end_time'],
            data.get('room_id'), data.get('instructor_name')
        )
        
        if conflict and not data.get('ignore_warning'):
            return {"status": "conflict", "type": conflict['type'], "message": conflict['message']}

        cursor.execute("SELECT COALESCE(MAX(section_num), 0) + 1 as next_num FROM section WHERE course_id = %s", (data['course_id'],))
        next_num = cursor.fetchone()['next_num']

        query = """
            INSERT INTO section (course_id, section_num, days, start_time, end_time,
                               instructor_name, room_id, delivery_mode, capacity, is_published)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 0)
        """
        cursor.execute(query, (
            data['course_id'], next_num, data['days'], data['start_time'], data['end_time'],
            data.get('instructor_name'), data.get('room_id'), data['delivery_mode'], data.get('capacity', 50)
        ))
        conn.commit()
        return {"status": "success", "section_num": next_num, "message": "تمت إضافة الشعبة بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": f"Database Error: {str(e)}"}
    finally:
        cursor.close()
        conn.close()


def update_section_service(section_id, data):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        conflict = check_schedule_conflict(
            cursor, data['days'], data['start_time'], data['end_time'],
            data.get('room_id'), data.get('instructor_name'), exclude_id=section_id
        )

        if conflict and not data.get('ignore_warning'):
            return {"status": "conflict", "type": conflict['type'], "message": conflict['message']}

        query = """
            UPDATE section
            SET days=%s, start_time=%s, end_time=%s, room_id=%s, instructor_name=%s, delivery_mode=%s, capacity=%s
            WHERE section_id=%s
        """
        cursor.execute(query, (
            data['days'], data['start_time'], data['end_time'], data.get('room_id'),
            data.get('instructor_name'), data.get('delivery_mode'), data.get('capacity', 50), section_id
        ))

    finally:
        cursor.close()
        conn.close()


def get_all_sections_service(): #to be presented for staff 
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT s.*, c.title as course_name, c.course_code, c.credit_hours,
            (SELECT COUNT(*) FROM vote v WHERE v.section_id = s.section_id) as current_votes
            FROM section s JOIN course c ON s.course_id = c.course_id
            ORDER BY c.course_code ASC, s.section_num ASC
        """
        cursor.execute(query)
        results = cursor.fetchall()
        for row in results:    # Before this an error was appearing)obj >> time ) json to react 
            if row['start_time']: row['start_time'] = str(row['start_time'])
            if row['end_time']: row['end_time'] = str(row['end_time'])
        return results
    finally:
        cursor.close()
        conn.close()


def get_student_schedule_service(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT plan_id FROM student WHERE student_id = %s", (student_id,))
        student = cursor.fetchone()
        
        if not student or not student['plan_id']:
            return {"status": "error", "message": "الطالب غير مرتبط بخطة دراسية حالياً"}
            
        plan_id = student['plan_id']

        query = """
            SELECT s.*, c.title as course_name, c.course_code, c.credit_hours,
            (SELECT COUNT(*) FROM vote v WHERE v.section_id = s.section_id) as current_votes
            FROM section s 
            JOIN course c ON s.course_id = c.course_id
            JOIN plan_course pc ON c.course_id = pc.course_id
            WHERE pc.plan_id = %s AND s.is_published = 1
            ORDER BY c.course_code ASC, s.section_num ASC
        """
        cursor.execute(query, (plan_id,))
        results = cursor.fetchall()

        for row in results:
            if row['start_time']: row['start_time'] = str(row['start_time'])
            if row['end_time']: row['end_time'] = str(row['end_time'])
            
        return results
    finally:
        cursor.close()
        conn.close()


def delete_section_service(section_id, keep_votes=True):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if keep_votes:
            cursor.execute("UPDATE vote SET section_id = NULL WHERE section_id = %s", (section_id,))
        else:
            cursor.execute("DELETE FROM vote WHERE section_id = %s", (section_id,))

        cursor.execute("DELETE FROM section WHERE section_id = %s", (section_id,))
        conn.commit()
        return {"status": "success", "message": "تم الحذف بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def publish_schedule_service():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE section SET is_published = 1")
        conn.commit()
        return {"status": "success", "message": "تم اعتماد ونشر الجدول بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": f"خطأ في الحفظ: {str(e)}"}
    finally:
        cursor.close()
        conn.close()


# Registration st

def create_student_service(data):   #sign up
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) 
    try:
        query_check = "SELECT student_id, email FROM student WHERE student_id = %s OR email = %s"
        cursor.execute(query_check, (data['student_id'], data['email']))
        existing_student = cursor.fetchone()

        if existing_student:
            if existing_student['student_id'] == data['student_id']:
                return {"status": "error", "message": "عذراً، هذا الرقم الجامعي مسجل مسبقاً"}
            if existing_student['email'] == data['email']:
                return {"status": "error", "message": "عذراً، هذا البريد الإلكتروني مستخدم بالفعل"}

        query_insert = "INSERT INTO student (student_id, name, email, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query_insert, (
            data['student_id'], 
            data.get('full_name', 'طالب جديد'),
            data['email'], 
            data['password']
        ))
        
        conn.commit()
        return {"status": "success", "message": "تم إنشاء حسابك بنجاح! يمكنك تسجيل الدخول الآن"}

    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": f"حدث خطأ فني في قاعدة البيانات: {str(e)}"}
    finally:
        cursor.close()
        conn.close()


def submit_student_vote_service(data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM vote WHERE student_id = %s AND course_id = %s", (data['student_id'], data['course_id']))
        if cursor.fetchone():
            return {"status": "error", "message": "لقد قمت بالتصويت لهذه المادة مسبقاً"}

        query = "INSERT INTO vote (student_id, course_id, section_id) VALUES (%s, %s, %s)"
        cursor.execute(query, (data['student_id'], data['course_id'], data.get('section_id')))
        conn.commit()
        return {"status": "success", "message": "تم تسجيل صوتك بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def get_student_votes_service(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT section_id FROM vote WHERE student_id = %s", (student_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()


def remove_vote_service(student_id, section_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = "DELETE FROM vote WHERE student_id = %s AND section_id = %s"
        cursor.execute(query, (student_id, section_id))
        conn.commit()
        return {"status": "success", "message": "تم سحب التصويت بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": f"خطأ في قاعدة البيانات: {str(e)}"}
    finally:
        cursor.close()
        conn.close()

def add_prerequisite_service(plan_id, course_id, prereq_id, req_type):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO prerequisites (plan_id, course_id, prereq_id, req_type) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (plan_id, course_id, prereq_id, req_type))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def get_course_prereqs_service(plan_id, course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT p.prereq_id, p.req_type, c.course_code, c.title
            FROM prerequisites p
            JOIN course c ON p.prereq_id = c.course_id
            WHERE p.plan_id = %s AND p.course_id = %s
        """
        cursor.execute(query, (plan_id, course_id))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

def delete_prerequisite_service(plan_id, course_id, prereq_id, req_type):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            DELETE FROM prerequisites 
            WHERE plan_id = %s AND course_id = %s AND prereq_id = %s AND req_type = %s
        """
        cursor.execute(query, (plan_id, course_id, prereq_id, req_type))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()