import re

def validate_login_data(data):  #staff
    errors = []
    if not data.get('email'): 
        errors.append("البريد الإلكتروني مطلوب")
    if not data.get('password'): 
        errors.append("كلمة المرور مطلوبة")
    return errors

def validate_student_login_data(data):
    errors = []
    if not data.get('student_id'):
        errors.append("الرقم الجامعي مطلوب للدخول")
    if not data.get('password'):
        errors.append("كلمة المرور مطلوبة")
    return errors

def validate_student_data(data): #register 
    errors = []
    student_id = str(data.get('student_id', '')).strip()
    email = str(data.get('email', '')).strip()
    password = str(data.get('password', '')).strip()
    
    if not student_id:
        errors.append("الرقم الجامعي مطلوب")
    elif not re.match(r'^1[0-9]{5}$', student_id):
        errors.append("يجب أن يتكون الرقم الجامعي من 6 خانات ويبدأ بالرقم 1")
    if not email:
        errors.append("البريد الإلكتروني مطلوب")
    elif not email.endswith('@just.edu.jo'):
        errors.append("يجب استخدام البريد الإلكتروني الجامعي الرسمي (@just.edu.jo)")
    if not password:
        errors.append("كلمة المرور مطلوبة")
    elif len(password) < 6:
        errors.append("كلمة المرور يجب أن تكون 6 خانات على الأقل")
    return errors

def validate_course_data(data):
    errors = []
    required_fields = ['course_code', 'line_number', 'title', 'credit_hours', 'theory_hours', 'practical_hours']
    
    for field in required_fields:
        if not data.get(field) and data.get(field) != 0:
            errors.append(f"الحقل '{field}' مطلوب")
            
    try:
        if data.get('line_number') and int(data.get('line_number')) <= 0:
            errors.append("رقم السطر يجب أن يكون قيمة موجبة")
        if int(data.get('credit_hours', 0)) <= 0:
            errors.append("يجب أن يكون عدد الساعات المعتمدة أكبر من 0")
    except ValueError:
        errors.append("يجب إدخال قيم عددية صحيحة في حقول الأرقام والساعات")
    return errors



def validate_plan_data(data):
    errors = []
    if not data.get('plan_name'): 
        errors.append("اسم الخطة مطلوب")
    if not data.get('specialization'): 
        errors.append("التخصص مطلوب")

    total_hours = data.get('total_hours')
    if total_hours is None or str(total_hours).strip() == "":
        errors.append("عدد الساعات الكلية مطلوب")
    else:
        try:
            if int(total_hours) <= 0:
                errors.append("يجب أن يكون عدد الساعات الكلية أكبر من صفر")
        except ValueError:
            errors.append("يجب إدخال قيمة عددية صحيحة للساعات الكلية")
    return errors

def validate_section_data(data):
    errors = []
    required = ['course_id', 'days', 'start_time', 'end_time', 'delivery_mode']
    
    for field in required:
        if not data.get(field):
            errors.append(f"الحقل '{field}' مطلوب لإنشاء الشعبة")
    
    if data.get('capacity'):
        try:
            if int(data.get('capacity')) <= 0:
                errors.append("سعة الشعبة يجب أن تكون أكبر من صفر")
        except ValueError:
            errors.append("السعة يجب أن تكون قيمة عددية")
            
    return errors


def validate_vote_data(data):
    errors = []
    if not data.get('student_id'): 
        errors.append("رقم الطالب مطلوب")
    if not data.get('course_id'): 
        errors.append("رقم المادة مطلوب")
    return errors




def validate_plan_course_link(data):
    errors = []
    if not data.get('course_id'): errors.append("يجب اختيار مادة لربطها")
    if not data.get('year_level'): errors.append("يجب تحديد السنة الدراسية (1-4)")
    if not data.get('semester'): errors.append("يجب تحديد الفصل الدراسي")
    if not data.get('category'): errors.append("يجب تحديد تصنيف المادة (إجباري/اختياري)")
    
    try:
        if data.get('year_level') and (int(data.get('year_level')) < 1 or int(data.get('year_level')) > 5):
            errors.append("السنة الدراسية يجب أن تكون بين 1 و 5")
        if data.get('semester') and int(data.get('semester')) not in [1, 2, 3]:
            errors.append("الفصل الدراسي يجب أن يكون 1 (أول)، 2 (ثاني)، أو 3 (صيفي)")
    except ValueError:
        errors.append("قيم السنة والفصل يجب أن تكون أرقاماً")
        
    return errors