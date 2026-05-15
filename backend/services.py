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
def login_staff_service(email, password, uni_id): # التعديل 1: إضافة uni_id
    if not uni_id:
        return {"status": "error", "message": "يجب تحديد الجامعة أولاً"}

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # التعديل 2: إضافة uni_id للبحث لضمان العزل التام
        query = """
            SELECT staff_id, name, email, role, dept_id, uni_id 
            FROM staff 
            WHERE (email = %s OR official_id = %s) AND password = %s AND uni_id = %s
        """
        
        # تمرير uni_id في الـ parameters
        cursor.execute(query, (email, email, password, uni_id))
        user = cursor.fetchone()

        if user:
            # التعديل 3: تضمين رقم الجامعة في التوكن لزيادة الأمان
            token = jwt.encode({
                'staff_id': user['staff_id'],
                'role': user['role'],
                'uni_id': user['uni_id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")
            
            return {
                "status": "success", 
                "token": token, 
                "user": {
                    "name": user['name'], 
                    "role": user['role'], 
                    "dept_id": user['dept_id'], # مفتاح واجهة رئيس القسم ومدخل البيانات
                    "uni_id": user['uni_id']    # إرجاع رقم الجامعة للفرونت إند
                }
            }
        
        return {"status": "error", "message": "بيانات الدخول غير صحيحة أو لا تنتمي لهذه الجامعة"}
    finally:
        cursor.close()
        conn.close()


def login_student_service(student_id, password, uni_id): # التعديل: تمرير uni_id
    if not uni_id:
        return {"status": "error", "message": "يجب تحديد الجامعة أولاً"}

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # التعديل: التحقق من بيانات الدخول مدموجة مع رقم الجامعة المختارة
        query = "SELECT student_id, name, email, plan_id, dept_id, uni_id FROM student WHERE student_id = %s AND password = %s AND uni_id = %s"
        cursor.execute(query, (student_id, password, uni_id))
        student = cursor.fetchone()
        
        if student:
            # التعديل: تضمين uni_id داخل التوكن لزيادة الأمان
            token = jwt.encode({
                'student_id': student['student_id'], 
                'uni_id': student['uni_id'], 
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")
            
            return {
                "status": "success",
                "token": token,
                "user": {
                    "name": student['name'], 
                    "id": student['student_id'],
                    "plan_id": student['plan_id'],
                    "dept_id": student['dept_id'],
                    "uni_id": student['uni_id'] # إرجاع رقم الجامعة للفرونت إند
                }
            }
        return {"status": "error", "message": "الرقم الجامعي أو كلمة المرور غير صحيحة لهذه الجامعة"}
    finally:
        cursor.close()
        conn.close()
        

def get_all_plans_service(dept_id=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if dept_id:
            cursor.execute("SELECT * FROM studyplan WHERE dept_id = %s", (dept_id,))
        else:
            cursor.execute("SELECT * FROM studyplan")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()



def create_study_plan_service(plan_name, dept_id, total_hours):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # قمنا بتغيير specialization إلى dept_id في الاستعلام
        query = "INSERT INTO studyplan (plan_name, dept_id, total_hours) VALUES (%s, %s, %s)"
        cursor.execute(query, (plan_name, dept_id, total_hours))
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


def get_all_courses_catalog_service(dept_id=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if dept_id and str(dept_id).lower() not in ['null', 'undefined', '']:
            cursor.execute("SELECT * FROM course WHERE dept_id = %s ORDER BY course_code ASC", (dept_id,))
        else:
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

        # --- كود الإشعارات: إعلام الطلاب بطرح شعبة جديدة لمادة بخطتهم ---
        cursor.execute("""
            SELECT s.student_id, c.title, c.dept_id
            FROM student s
            JOIN plan_course pc ON s.plan_id = pc.plan_id
            JOIN course c ON pc.course_id = c.course_id
            WHERE pc.course_id = %s
        """, (data['course_id'],))
        students = cursor.fetchall()
        if students:
            course_title = students[0]['title']
            dept_id = students[0]['dept_id']
            msg = f"تم طرح شعبة جديدة رقم #{next_num} لمادة ({course_title}) ضمن خطتك الدراسية."
            notif_data = [(st['student_id'], msg, dept_id, 0) for st in students]
            cursor.executemany("INSERT INTO student_notification (student_id, message, dept_id, is_published) VALUES (%s, %s, %s, %s)", notif_data)

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
        # 1. جلب البيانات القديمة قبل التحديث للمقارنة
        cursor.execute("SELECT capacity, section_num FROM section WHERE section_id = %s", (section_id,))
        old_data = cursor.fetchone()
        if not old_data:
            return {"status": "error", "message": "الشعبة غير موجودة"}

        # 2. التحقق من التعارضات (Conflicts)
        conflict = check_schedule_conflict(
            cursor, data['days'], data['start_time'], data['end_time'],
            data.get('room_id'), data.get('instructor_name'), exclude_id=section_id
        )

        if conflict and not data.get('ignore_warning'):
            return {"status": "conflict", "type": conflict['type'], "message": conflict['message']}

        # 3. تحديث بيانات الشعبة
        query = """
            UPDATE section
            SET days=%s, start_time=%s, end_time=%s, room_id=%s, instructor_name=%s, delivery_mode=%s, capacity=%s
            WHERE section_id=%s
        """
        cursor.execute(query, (
            data['days'], data['start_time'], data['end_time'], data.get('room_id'),
            data.get('instructor_name'), data.get('delivery_mode'), data.get('capacity', 50), section_id
        ))

        # 4. --- منطق الإشعارات الذكي ---
        cursor.execute("""
            SELECT st.student_id, c.title, s.section_num, c.dept_id
            FROM section s
            JOIN course c ON s.course_id = c.course_id
            JOIN plan_course pc ON c.course_id = pc.course_id
            JOIN student st ON pc.plan_id = st.plan_id
            WHERE s.section_id = %s
        """, (section_id,))
        
        affected_students = cursor.fetchall()
        
        if affected_students:
            course_title = affected_students[0]['title']
            sec_num = affected_students[0]['section_num']
            dept_id = affected_students[0]['dept_id']
            
            new_capacity = int(data.get('capacity', 0))
            old_capacity = int(old_data['capacity'])

            # صياغة الرسالة بناءً على نوع التعديل
            if new_capacity > old_capacity:
                msg = f"بشرى سارة: تم زيادة سعة الشعبة #{sec_num} لمادة ({course_title}) لتستوعب عدداً أكبر من الطلاب."
            else:
                msg = f"تنبيه: تم تحديث بيانات الشعبة #{sec_num} (الموعد/القاعة/السعة) لمادة ({course_title}) المتاحة في خطتك."
            
            # تخزين الإشعارات كمسودة (غير منشورة) بانتظار زر الاعتماد
            notif_data = [(st['student_id'], msg, dept_id, 0) for st in affected_students]
            
            cursor.executemany(
                "INSERT INTO student_notification (student_id, message, dept_id, is_published) VALUES (%s, %s, %s, %s)", 
                notif_data
            )

        conn.commit()
        return {"status": "success", "message": "تم تحديث بيانات الشعبة وتجهيز الإشعارات"}
        
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def get_all_sections_service(dept_id=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
       
        if not dept_id or str(dept_id).lower() in ['null', 'undefined', '']:
            return [] 

        query = """
            SELECT s.*, c.title as course_name, c.course_code, c.credit_hours,
            (SELECT COUNT(*) FROM vote v WHERE v.section_id = s.section_id) as current_votes
            FROM section s 
            JOIN course c ON s.course_id = c.course_id
            WHERE c.dept_id = %s
            ORDER BY c.course_code ASC, s.section_num ASC
        """
        cursor.execute(query, (dept_id,))
        results = cursor.fetchall()
        
        for row in results:
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
    cursor = conn.cursor(dictionary=True)
    try:
        # --- كود الإشعارات المحدث ---
        # قمنا بتغيير الاستعلام ليجلب كل الطلاب الذين لديهم المادة في خطتهم
        # لضمان إنشاء الإشعار حتى لو لم يصوت أحد على الشعبة بعد
        cursor.execute("""
            SELECT st.student_id, c.title, s.section_num, c.dept_id
            FROM section s
            JOIN course c ON s.course_id = c.course_id
            JOIN plan_course pc ON c.course_id = pc.course_id
            JOIN student st ON pc.plan_id = st.plan_id
            WHERE s.section_id = %s
        """, (section_id,))
        students = cursor.fetchall()
        
        if students:
            course_title = students[0]['title']
            sec_num = students[0]['section_num']
            dept_id = students[0]['dept_id']
            msg = f"تنبيه: تم إلغاء وحذف الشعبة #{sec_num} في مادة ({course_title}) من الجدول الدراسي."
            # تخزين الإشعار كمسودة (is_published = 0) بانتظار زر الاعتماد
            notif_data = [(st['student_id'], msg, dept_id, 0) for st in students]
            cursor.executemany("INSERT INTO student_notification (student_id, message, dept_id, is_published) VALUES (%s, %s, %s, %s)", notif_data)

        # متابعة الحذف الطبيعي من قاعدة البيانات
        if keep_votes:
            cursor.execute("UPDATE vote SET section_id = NULL WHERE section_id = %s", (section_id,))
        else:
            cursor.execute("DELETE FROM vote WHERE section_id = %s", (section_id,))

        cursor.execute("DELETE FROM section WHERE section_id = %s", (section_id,))
        
        conn.commit()
        return {"status": "success", "message": "تم الحذف بنجاح وتجهيز الإشعار للطلاب"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

# --- دوال الإشعارات الجديدة للطلاب ---
def get_student_notifications_service(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM student_notification WHERE student_id = %s AND is_published = 1 ORDER BY created_at DESC", (student_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()


def mark_notifications_read_service(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE student_notification SET is_read = 1 WHERE student_id = %s AND is_read = 0", (student_id,))
        conn.commit()
        return {"status": "success"}
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

def create_student_service(data):   # sign up
    uni_id = data.get('uni_id')
    if not uni_id:
        return {"status": "error", "message": "يجب تحديد الجامعة أولاً"}

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) 
    try:
        # التعديل الأول: التحقق من التكرار داخل نفس الجامعة فقط (باستخدام uni_id)
        query_check = "SELECT student_id, email FROM student WHERE (student_id = %s OR email = %s) AND uni_id = %s"
        cursor.execute(query_check, (data['student_id'], data['email'], uni_id))
        existing_student = cursor.fetchone()

        if existing_student:
            if existing_student['student_id'] == data['student_id']:
                return {"status": "error", "message": "عذراً، هذا الرقم الجامعي مسجل مسبقاً في هذه الجامعة"}
            if existing_student['email'] == data['email']:
                return {"status": "error", "message": "عذراً، هذا البريد الإلكتروني مستخدم بالفعل في هذه الجامعة"}

        # التعديل الثاني: إضافة uni_id لعملية الإدخال
        query_insert = "INSERT INTO student (student_id, name, email, password, uni_id) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query_insert, (
            data['student_id'], 
            data.get('full_name', 'طالب جديد'),
            data['email'], 
            data['password'],
            uni_id
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
    cursor = conn.cursor(dictionary=True)
    try:
        # 1. حذف صوت الطالب المنسحب
        cursor.execute("DELETE FROM vote WHERE student_id = %s AND section_id = %s", (student_id, section_id))
        
        # 2. البحث عن أول طالب في قائمة الانتظار (FIFO)
        cursor.execute("SELECT * FROM waitlist WHERE section_id = %s ORDER BY created_at ASC LIMIT 1", (section_id,))
        first_in_line = cursor.fetchone()
        
        if first_in_line:
            lucky_student = first_in_line['student_id']
            
            # سحبه من قائمة الانتظار وتسجيل صوته رسمياً
            cursor.execute("DELETE FROM waitlist WHERE waitlist_id = %s", (first_in_line['waitlist_id'],))
            cursor.execute("INSERT INTO vote (student_id, section_id) VALUES (%s, %s)", (lucky_student, section_id))
            
            # جلب بيانات المادة لإرسال إشعار للطالب المحظوظ
            cursor.execute("""
                SELECT c.title, s.section_num, c.dept_id 
                FROM section s JOIN course c ON s.course_id = c.course_id 
                WHERE s.section_id = %s
            """, (section_id,))
            sec_info = cursor.fetchone()
            
            if sec_info:
                msg = f"مبروك! توفر مقعد وتم تسجيلك تلقائياً في الشعبة #{sec_info['section_num']} لمادة ({sec_info['title']}) من قائمة الانتظار."
                cursor.execute("INSERT INTO student_notification (student_id, message, dept_id, is_published) VALUES (%s, %s, %s, 1)", 
                               (lucky_student, msg, sec_info['dept_id']))

        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
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



#admin
def admin_get_all_staff_service(uni_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT 
                s.staff_id, 
                s.official_id, 
                s.name, 
                s.email, 
                s.role, 
                s.dept_id,  
                d.dept_name 
            FROM staff s
            LEFT JOIN department d ON s.dept_id = d.dept_id
            WHERE s.uni_id = %s
        """
        cursor.execute(query, (uni_id,))
        return cursor.fetchall() 
    finally:
        cursor.close()
        conn.close()


def admin_get_all_students_service(uni_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary = True)
    try:
        query = """
            SELECT s.student_id, s.name, s.email, p.plan_name 
            FROM student s
            LEFT JOIN studyplan p ON s.plan_id = p.plan_id
            WHERE s.uni_id = %s
        """
        cursor.execute(query, (uni_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()





def admin_add_staff_service(data):
    # جلب رقم الجامعة من البيانات المرسلة من الفرونت إند
    uni_id = data.get('uni_id')
    
    if not uni_id:
        return {"status": "error", "message": "عذراً، يجب تحديد الجامعة لإتمام عملية الإضافة"}

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # التحقق من أن الموظف غير مسجل مسبقاً في هذه الجامعة
        cursor.execute("SELECT * FROM staff WHERE (email = %s OR official_id = %s) AND uni_id = %s", 
                       (data['email'], data['official_id'], uni_id))
        
        if cursor.fetchone():
            return {"status": "error", "message": "الإيميل أو الرقم الوظيفي موجود مسبقاً في هذه الجامعة"}

        # إضافة الموظف مع ربطه برقم الجامعة (uni_id)
        query = """
            INSERT INTO staff (official_id, name, email, password, role, dept_id, uni_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['official_id'], 
            data['name'], 
            data['email'], 
            data['password'], 
            data['role'], 
            data.get('dept_id'),
            uni_id # القيمة الجديدة التي تضمن العزل
        ))
        
        conn.commit()
        return {"status": "success", "message": "تمت إضافة الموظف وربطه بالجامعة بنجاح"}
    
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def admin_update_staff_service(staff_id, data):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        check_query = """
            SELECT * FROM staff 
            WHERE (email = %s OR official_id = %s) AND staff_id != %s
        """
        cursor.execute(check_query, (data['email'], data['official_id'], staff_id))
        if cursor.fetchone():
            return {"status": "error", "message": "الإيميل أو الرقم الوظيفي مستخدم من قبل موظف آخر"}

        update_query = """
            UPDATE staff 
            SET name = %s, email = %s, official_id = %s, role = %s, dept_id = %s
            WHERE staff_id = %s
        """
        cursor.execute(update_query, (
            data['name'], data['email'], data['official_id'], 
            data['role'], data['dept_id'], staff_id
        ))
        
        conn.commit()
        return {"status": "success", "message": "تم تحديث بيانات الموظف بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def admin_update_student_service(student_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        update_query = """
            UPDATE student 
            SET name = %s, email = %s, plan_id = %s 
            WHERE student_id = %s
        """
        cursor.execute(update_query, (data['name'], data['email'], data['plan_id'], student_id))
        conn.commit()
        return {"status": "success", "message": "تم تحديث بيانات الطالب بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()



# Your current services.py code
def admin_get_all_departments_service(uni_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Use JOIN to filter departments based on the faculty's uni_id
        query = """
            SELECT d.dept_id, d.dept_name, d.fac_id 
            FROM department d
            JOIN faculty f ON d.fac_id = f.fac_id
            WHERE f.uni_id = %s
        """
        cursor.execute(query, (uni_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()


def delete_staff_service(staff_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # هون بنفذ أمر الحذف بناءً على الـ ID اللي وصلنا من الفرونت
        cursor.execute("DELETE FROM staff WHERE staff_id = %s", (staff_id,))
        conn.commit()
        
        # إذا كلشي تمام، بنرجع رسالة نجاح
        return {"status": "success", "message": "تم حذف الموظف من السيستم بنجاح"}
    except Exception as e:
        # إذا صار أي مشكلة (مثلاً الموظف اله روابط ثانية)، بنعمل رول باك
        conn.rollback()
        return {"status": "error", "message": f"في مشكلة بالحذف: {str(e)}"}
    finally:
        cursor.close()
        conn.close()

        


#hod
def get_hod_analytics_service(dept_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # أضفنا شرط الفلترة WHERE c.dept_id = %s
        query = """
            SELECT s.section_id, c.course_code, c.title, s.section_num, s.capacity, s.days, s.start_time, s.end_time,
            (SELECT COUNT(*) FROM vote v WHERE v.section_id = s.section_id) as vote_count
            FROM section s
            JOIN course c ON s.course_id = c.course_id
            WHERE c.dept_id = %s
        """
        # تمرير dept_id مع الاستعلام
        cursor.execute(query, (dept_id,))
        sections = cursor.fetchall()
        
        reports = []
        for sec in sections:
            # حساب نسبة الإقبال (تجنب القسمة على صفر إذا السعة مش مدخلة صح)
            capacity = sec['capacity'] if sec['capacity'] > 0 else 50
            demand_pct = (sec['vote_count'] / capacity) * 100
            
            # منطق النصائح الذكية
            advice = "الوضع مستقر."
            status = "success"
            if demand_pct > 90:
                advice = "إقبال هائل! افتح شعبة جديدة فوراً."
                status = "critical"
            elif demand_pct < 15:
                advice = "إقبال ضعيف، فكر بدمج الشعبة أو تغيير وقتها."
                status = "warning"

            reports.append({
                **sec,
                "demand_pct": round(demand_pct, 1),
                "advice": advice,
                "status": status
            })
        return reports
    finally:
        cursor.close()
        conn.close()



# ---  ميزة التقرير النهائي لرئيس القسم ---
def get_hod_final_report_service(dept_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT c.course_id, c.course_code, c.title,
                   s.section_id, s.section_num, s.days, s.start_time, s.end_time, s.capacity,
                   (SELECT COUNT(*) FROM vote v WHERE v.section_id = s.section_id) as vote_count
            FROM course c
            JOIN section s ON c.course_id = s.course_id
            WHERE c.dept_id = %s
            ORDER BY c.course_code, s.section_num
        """
        cursor.execute(query, (dept_id,))
        data = cursor.fetchall()

        courses_summary = {}
        for row in data:
            cid = row['course_id']
            if cid not in courses_summary:
                courses_summary[cid] = {
                    'course_code': row['course_code'],
                    'title': row['title'],
                    'total_votes': 0,
                    'sections': []
                }
            courses_summary[cid]['total_votes'] += row['vote_count']
            courses_summary[cid]['sections'].append(row)

        final_report = []
        for cid, info in courses_summary.items():
            total_votes = info['total_votes']
            if total_votes == 0:
                continue 

            sorted_sections = sorted(info['sections'], key=lambda x: x['vote_count'], reverse=True)
            
            proposed_sections = []
            insights = []
            dropped_sections_count = 0
            full_sections_count = 0

            for sec in sorted_sections:
                actual_capacity = sec['capacity'] if sec['capacity'] else 50
                
                if sec['vote_count'] > 0:
                    proposed_sections.append({
                        'days': sec['days'],
                        'start_time': str(sec['start_time']),
                        'end_time': str(sec['end_time']),
                        'capacity': actual_capacity, 
                        'vote_count': sec['vote_count']
                    })
                    
                    if sec['vote_count'] >= actual_capacity:
                        full_sections_count += 1
                else:
                    dropped_sections_count += 1

            recommended_sections_count = len(proposed_sections)
            
            if recommended_sections_count == 0:
                continue

            if full_sections_count > 0:
                insights.append(f"تنبيه: هناك {full_sections_count} شُعب امتلأت بالكامل ووصلت لسعتها القصوى. يُرجح وجود طلاب آخرين لم يتمكنوا من التصويت، يُنصح بفتح شُعب موازية لها.")
            
            if dropped_sections_count > 0:
                insights.append(f"تم استبعاد {dropped_sections_count} شُعب من الجدول المقترح لعدم وجود أي إقبال عليها. يُفضل إلغاؤها لتوفير القاعات.")

            final_report.append({
                'course_code': info['course_code'],
                'title': info['title'],
                'total_votes': total_votes,
                'recommended_count': recommended_sections_count,
                'proposed_sections': proposed_sections,
                'insights': insights
            })

        return {"status": "success", "report": final_report}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()





def add_new_course_service(data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # استخراج البيانات من الريكويست
        course_code = data.get('course_code')
        title = data.get('title')
        line_number = data.get('line_number') # ممكن يكون Null
        credit_hours = data.get('credit_hours', 3)
        theory_hours = data.get('theory_hours', 0) # افتراضي 0
        practical_hours = data.get('practical_hours', 0) # افتراضي 0
        dept_id = data.get('dept_id')

        # استعلام الإدخال
        query = """
            INSERT INTO course 
            (course_code, title, line_number, credit_hours, theory_hours, practical_hours, dept_id) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (course_code, title, line_number, credit_hours, theory_hours, practical_hours, dept_id)
        
        cursor.execute(query, values)
        conn.commit()
        
        return {"status": "success", "message": "تم إضافة المادة بنجاح"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
        

def update_course_service(course_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            UPDATE course 
            SET course_code = %s, title = %s, line_number = %s, 
                credit_hours = %s, theory_hours = %s, practical_hours = %s
            WHERE course_id = %s
        """
        cursor.execute(query, (
            data.get('course_code'), data.get('title'), data.get('line_number'),
            data.get('credit_hours'), data.get('theory_hours', 0), 
            data.get('practical_hours', 0), course_id
        ))
        conn.commit()
        return {"status": "success", "message": "تم تحديث بيانات المادة بنجاح"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def delete_course_service(course_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 1. حذف الارتباط بالخطط الدراسية (plan_course) أولاً
        cursor.execute("DELETE FROM plan_course WHERE course_id = %s", (course_id,))
        
        # 2. حذف المادة من جدول المتطلبات (سواء كانت مادة أساسية أو متطلباً لمادة أخرى)
        cursor.execute("DELETE FROM prerequisites WHERE course_id = %s OR prereq_id = %s", (course_id, course_id))
        
        # 3. حذف أي تصويتات مرتبطة بهذه المادة لضمان تكامل البيانات
        cursor.execute("DELETE FROM vote WHERE course_id = %s", (course_id,))
        
        # 4. حذف أي شعب دراسية مطروحة لهذه المادة
        cursor.execute("DELETE FROM section WHERE course_id = %s", (course_id,))

        # 5. الآن يمكن حذف المادة نفسها من جدول المواد (المكتبة) بدون أي قيود
        cursor.execute("DELETE FROM course WHERE course_id = %s", (course_id,))
        
        conn.commit()
        return {"status": "success", "message": "تم حذف المادة نهائياً من المكتبة ومن كافة الخطط والشعب المرتبطة بها بنجاح."}
    except Exception as e:
        # في حال حدوث أي خطأ، يتم التراجع عن كل العمليات السابقة (Rollback)
        conn.rollback()
        return {"status": "error", "message": f"حدث خطأ أثناء عملية الحذف المتسلسل: {str(e)}"}
    finally:
        cursor.close()
        conn.close()




def get_university_settings(uni_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT email_domain, id_pattern FROM university WHERE uni_id = %s", (uni_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()
        

def publish_schedule_service(dept_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # نشر كافة الإشعارات المعلقة الخاصة بهذا القسم
        cursor.execute("""
            UPDATE student_notification 
            SET is_published = 1 
            WHERE dept_id = %s AND is_published = 0
        """, (dept_id,))
        
        # يمكنك أيضاً نشر الشعب نفسها (is_published = 1) إذا كنت تستخدم هذا الحقل
        cursor.execute("""
            UPDATE section s
            JOIN course c ON s.course_id = c.course_id
            SET s.is_published = 1
            WHERE c.dept_id = %s AND s.is_published = 0
        """, (dept_id,))
        
        conn.commit()
        return {"status": "success", "message": "تم نشر الجدول وإرسال الإشعارات للطلاب بنجاح."}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()



def join_waitlist_service(student_id, section_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # 1. التحقق من سعة الوايت ليست (الحد الأقصى 10)
        cursor.execute("SELECT COUNT(*) as count FROM waitlist WHERE section_id = %s", (section_id,))
        if cursor.fetchone()['count'] >= 10:
            return {"status": "error", "message": "قائمة الانتظار ممتلئة (10 طلاب كحد أقصى)."}

        # 2. إضافة الطالب
        cursor.execute("INSERT INTO waitlist (student_id, section_id) VALUES (%s, %s)", (student_id, section_id))
        conn.commit()
        return {"status": "success", "message": "تم إضافتك لقائمة الانتظار بنجاح"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": "أنت موجود مسبقاً في قائمة الانتظار لهذه الشعبة"}
    finally:
        cursor.close()
        conn.close()

def leave_waitlist_service(student_id, section_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM waitlist WHERE student_id = %s AND section_id = %s", (student_id, section_id))
        conn.commit()
        return {"status": "success"}
    finally:
        cursor.close()
        conn.close()

def get_student_waitlist_service(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT section_id FROM waitlist WHERE student_id = %s", (student_id,))
        return [row['section_id'] for row in cursor.fetchall()]
    finally:
        cursor.close()
        conn.close()