from flask import url_for, render_template, redirect, flash, g, Blueprint, request, jsonify
from flask_login import login_required, logout_user, login_user, current_user
from FoodOrderClient import app, db
from .models import Users
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
        user = Users.query.filter_by(email=user_name).first()
        print ( user_name, user_pwd)
        if user is not None :#and user.authenticate(password):
            user.authenticated = True
            db.session.add(user)
            db.session.commit()
            login_user(user)
            #flash('Thanks for logging in, {}'.format(current_user.email))
            print (user.as_dict())
            result = json.dumps( user.as_dict())
            result["role"]="customer"
            return result
        else:
            errorMsg = 'Invalid Login! Try Again.'
    return render_template('register.html', headerTitle='DigIn - Login', errorMessage=errorMsg)


@app.route('/register', methods=['GET', 'POST'])
def register():
    print ("register")
    if request.method == 'GET':
        return render_template('register.html')
    print (request.get_json())
    email_id   =  request.get_json()['email']
    user_name = request.get_json()['username']
    pwd  =  request.get_json()['password']
    f_Name     = request.get_json()['firstname']
    l_name     =  request.get_json()['lastname']
    print ( "emailid" , email_id)
    print ("user : " , user_name)
    cur_user = Users(f_Name , l_name, user_name, pwd)
    db.session.add(cur_user)
    db.session.commit()
    #flash('User successfully registered')
    return "SUCCESS"


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
