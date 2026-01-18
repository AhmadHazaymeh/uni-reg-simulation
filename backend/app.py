from flask import Flask, jsonify, request
from flask.json.provider import DefaultJSONProvider
from flask_cors import CORS
import services
import validators
from datetime import time, timedelta, datetime

class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, (time, timedelta)):
            return str(obj)  
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

app = Flask(__name__)
app.json = CustomJSONProvider(app)    
CORS(app)



@app.errorhandler(500)
def handle_internal_server_error(e):
    return jsonify({
        "status": "error", 
        "message": "Internal Server Error - مشكلة في البيانات أو الاتصال",
        "details": str(e)
    }), 500





@app.route('/api/staff/login', methods=['POST'])
def staff_login():
    data = request.json or {}
    errors = validators.validate_login_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    return jsonify(services.login_staff_service(data.get('email'), data.get('password')))

@app.route('/api/student/login', methods=['POST'])
def student_login():
    data = request.json or {}
    result = services.login_student_service(data.get('student_id'), data.get('password'))
    status_code = 200 if result.get('status') == 'success' else 401
    return jsonify(result), status_code



@app.route('/api/students', methods=['POST'])
def register_student():
    data = request.json or {}
    errors = validators.validate_student_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    result = services.create_student_service(data)
    status_code = 201 if result.get('status') == 'success' else 400
    return jsonify(result), status_code


@app.route('/api/catalog/courses', methods=['GET'])
def manage_catalog():
    if request.method == 'GET':
        return jsonify(services.get_all_courses_catalog_service())
    
    



@app.route('/api/plans', methods=['GET', 'POST'])
def manage_plans():
    if request.method == 'GET':
        return jsonify(services.get_all_plans_service())
    
    data = request.json or {}
    errors = validators.validate_plan_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    result = services.create_study_plan_service(
        data.get('plan_name'), 
        data.get('specialization'), 
        data.get('total_hours')
    )
    return jsonify(result), 201

@app.route('/api/plans/<int:plan_id>', methods=['DELETE'])
def delete_study_plan(plan_id):
    return jsonify(services.delete_study_plan_service(plan_id))


@app.route('/api/plans/<int:plan_id>/courses', methods=['GET'])
def get_plan_courses(plan_id):
    return jsonify(services.get_courses_by_plan_service(plan_id))

@app.route('/api/plans/<int:plan_id>/courses/link', methods=['POST'])
def link_course_to_plan(plan_id):
    data = request.json or {}
    return jsonify(services.link_course_to_plan_service(plan_id, data))

@app.route('/api/plans/<int:plan_id>/courses/<int:course_id>', methods=['PUT'])
def update_plan_course_details(plan_id, course_id):
    data = request.json or {}
    return jsonify(services.update_plan_course_details_service(plan_id, course_id, data))

@app.route('/api/plans/<int:plan_id>/courses/<int:course_id>', methods=['DELETE'])
def unlink_course_from_plan(plan_id, course_id):
    return jsonify(services.remove_course_from_plan_service(plan_id, course_id))

#   المتطلبات السابقة 

@app.route('/api/plans/<int:plan_id>/courses/<int:course_id>/prereqs', methods=['GET', 'POST'])
def manage_plan_prerequisites(plan_id, course_id):
    if request.method == 'GET':
        return jsonify(services.get_course_prereqs_service(plan_id, course_id))
    
    data = request.json or {}
    prereq_id = data.get('prereq_id')
    req_type = data.get('req_type', 'Success') 
    
    result = services.add_prerequisite_service(plan_id, course_id, prereq_id, req_type)
    return jsonify(result), 201 if result.get('status') == 'success' else 400


@app.route('/api/plans/<int:plan_id>/courses/<int:course_id>/prereqs/delete', methods=['POST'])
def delete_plan_prerequisite(plan_id, course_id):
    data = request.json or {}
    return jsonify(services.delete_prerequisite_service(
        plan_id, 
        course_id, 
        data.get('prereq_id'), 
        data.get('req_type')
    ))


# Sections

@app.route('/api/sections', methods=['GET', 'POST'])
def manage_sections():
    if request.method == 'GET':
        return jsonify(services.get_all_sections_service()) 
    
    data = request.json or {}
    errors = validators.validate_section_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    result = services.create_section_service(data)
    if result.get('status') == 'conflict':
        return jsonify(result), 409
    return jsonify(result), 201

@app.route('/api/sections/<int:sid>', methods=['PUT', 'DELETE'])
def manage_section_item(sid):
    if request.method == 'PUT':
        result = services.update_section_service(sid, request.json)
        if result.get('status') == 'conflict':
            return jsonify(result), 409
        return jsonify(result)
    
    keep_votes = request.args.get('keep_votes') == 'true'
    return jsonify(services.delete_section_service(sid, keep_votes))

@app.route('/api/sections/publish', methods=['POST'])
def publish_schedule():
    result = services.publish_schedule_service()
    status_code = 200 if result.get('status') == 'success' else 500
    return jsonify(result), status_code


#  الطالب والتصويت  

@app.route('/api/student/schedule', methods=['GET'])
def get_student_schedule():
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({"status": "error", "message": "يجب تسجيل الدخول أولاً (رقم الطالب مفقود)"}), 400
    return jsonify(services.get_student_schedule_service(student_id))




@app.route('/api/student/vote', methods=['POST'])
def student_vote():
    data = request.json or {}
    errors = validators.validate_vote_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    result = services.submit_student_vote_service(data)
    status_code = 201 if result.get('status') == 'success' else 400
    return jsonify(result), status_code



@app.route('/api/student/vote/remove', methods=['POST'])
def remove_vote():
    data = request.json or {}
    result = services.remove_vote_service(
        data.get('student_id'), 
        data.get('section_id')
    )
    return jsonify(result)

@app.route('/api/student/<int:student_id>/votes', methods=['GET'])
def get_student_votes(student_id):
    return jsonify(services.get_student_votes_service(student_id))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)