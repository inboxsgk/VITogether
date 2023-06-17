import firebase_admin
import pyrebase
import json
from firebase_admin import credentials, auth
from flask import Flask, request
from functools import wraps

app = Flask(__name__)

adm = credentials.Certificate('fbAdminConfig.json')
firebase = firebase_admin.initialize_app(adm)
pb = pyrebase.initialize_app(json.load(open('fbconfig.json')))


users = [{'uid': 1, 'uname':"wardude"}]
def check_token(f):
    @wraps(f)
    def wrap(*args,**kwargs):
        if not request.headers.get('auth'):
            return {'message': 'No token provided'},400
        try:
            user = auth.verify_id_token(request.headers['authorization'])
            request.user = user
        except:
            return {'message':'Invalid token provided.'},400
        return f(*args, **kwargs)
    return wrap

#@app.route('/api/getuid')
def get_uid(token):
    #token = request.form.to_dict()['auth']
    print(token)
    return auth.verify_id_token(token)['uid']

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return 'Resource cannot be found, check documentation', 200

@app.route('/api/test')
def test_head():
    response = request.form.to_dict()

    if ('email' and 'passwd') in response.keys():
        return {"success": 'true', 'response': 'parameters are parsed'}, 200
    else:
        return {"success": 'false', 'response': 'An error occured, check documentation'}, 400

#@check_token

@app.route('/api/userinfo')
def userinfo():
    print(auth.verify_id_token(id_token=request.form.get('auth')))
    return {'data': users}, 200

@app.route('/api/signup')
def newuser():
    uMail = request.form.to_dict()['email']
    uPass = request.form.to_dict()['passwd']
    #uPass = request.form.get('passwd')
    print(uMail)
    print(uPass)

    ###################################################333
    if (uMail==None or uPass==None):
        return {"success": 'false', 'error': 'Missing email or password'}, 400
    try:
        user = auth.create_user(email = uMail, password = uPass)
        return {"success": 'true', 'response': 'User creation success'}, 200
    except:
        return {"success": 'false', 'error': 'Error creating user'}, 400

@app.route('/api/login')
def login():
    uMail = request.form.get('email')
    uPass = request.form.get('passwd')
    print(uMail)
    print(uPass)
    try:
        user = pb.auth().sign_in_with_email_and_password(uMail, uPass)
        jwt = user['idToken']
        return {"success": 'true', 'token': jwt}, 200
    except:
        return {"success": 'false', 'error': 'There was an error logging in'},400

#Non user specific data is working
#Must do user specific data
@app.route('/api/dbpost')
def pst():
    #auth_tok = request.headers.get('auth')
    auth_tok = request.form.to_dict()['auth']
    try:
        print(get_uid(auth_tok))
        print({'users': {get_uid(auth_tok):{"update":"Hello world"}}})
        pb.database().update({'users': {get_uid(auth_tok):{"update":"Hello world"}}}, auth_tok)
        #pb.database().push({"update":"Hello"}, auth_tok)
    except:
        return {"success": "false"}
    else:
        return {"success":"true"}

#NOT-WORKING
@app.route('/api/logout')
def logout():
    token = request.form.get('auth')
    uId = get_uid(token)
    try:
        auth.revoke_refresh_tokens(uId)
    except:
        return {"success": 'false'}
    else:
        return {"success": 'true'}

if __name__ == '__main__':
    app.run(debug=True)