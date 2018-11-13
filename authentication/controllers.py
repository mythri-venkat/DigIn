from flask import url_for, render_template, redirect, flash, g, Blueprint, request, jsonify
from flask_login import login_required, logout_user, login_user, current_user
from DigIn import app, db
from .models import Users
from ..CartAndCheckout.models import Restaurant
import json

mod_auth = Blueprint('authentication', __name__)


@app.route('/login', methods=['GET','POST'])
def login():
    errorMsg = ''
    if request.method == 'POST':
        print ("login")
        print (request.get_json())
        user_name = request.get_json()['username']
        user_pwd = request.get_json()['password']
        user = Users.query.filter_by(username=user_name).first()
        print ( user_name, user_pwd)
        print user.as_dict()
        if user is not None and user.authenticate(user_pwd):
            user.authenticated = True
            db.session.add(user)
            db.session.commit()
            login_user(user)
            #flash('Thanks for logging in, {}'.format(current_user.email))
            print (user.role)
            result = user.as_dict()
            return json.dumps(result)
        else:
            errorMsg = 'Invalid Login! Try Again.'
            return "invalid credentials",400
    # return render_template('register.html', headerTitle='DigIn - Login', errorMessage=errorMsg)


@app.route('/register', methods=['GET', 'POST'])
def register():
    print ("register")
    if request.method == 'GET':
        return render_template('register.html')
    data = request.get_json()
    print (request.get_json())
    l_name =""
    restname = ""
    address = ""
    role = ""
    email_id   =  data['email']
    user_name = data['username']
    pwd  =  data['password']
    f_Name     = data['firstname']
    if 'lastname' in data:
        l_name     =  data['lastname']
    if 'address' in data:
        address = request.get_json()['address']
    if 'restname' in data:
        restname = request.get_json()['restname']
    if 'role' in data:
        role = request.get_json()['role']
    print ( "emailid" , email_id)
    print ("user : " , user_name)
    cur_user = Users(f_Name , l_name, email_id,user_name, pwd,address,role,restname)
    db.session.add(cur_user)
    db.session.commit()
    if role == 'restaurant':
        rest = Restaurant(restname,address)
        db.session.add(rest)
        db.session.commit()
    #flash('User successfully registered')
    return "SUCCESS"

@app.route('/change/<user_id>',methods=['POST'])
def changepwd(user_id):
    curr = Users.query.filter_by(id=user_id).first()
    curpwd = request.get_json()['curr']
    newpwd = request.get_json()['new']
    if(curr.change_password(curpwd,newpwd)):
        return json.dumps(curr.as_dict())
    else:
        return "Password incorrect",400


@mod_auth.route('/logout')
@login_required
def logout():
    user = current_user
    user.authenticated = False
    db.session.add(user)
    db.session.commit()
    logout_user()
    flash('Goodbye!', 'info')
    return redirect(url_for('authentication.login'))
