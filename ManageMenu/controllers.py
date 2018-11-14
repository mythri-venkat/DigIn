from sqlalchemy import and_, func, between
from flask_login import login_required, current_user
from flask import Flask, render_template, redirect, url_for, session, g, Blueprint, request, jsonify, url_for, send_from_directory

import datetime
from datetime import datetime as dt
from datetime import timedelta
import json

from DigIn import db, app
from ..CartAndCheckout.models import Restaurant, FoodItem, Cart, Order, OrderItem
from ..authentication.models import Users

mod_menu = Blueprint('ManageMenu', __name__)

# @app.route('/restaurant/edit/<cust_id>/<rest_id>')#,methods=['GET','POST'])
# def edit_profile(cust_id,rest_id):
# 	print cust_id, rest_id
# 	if request.method == 'POST':
# 		getJson = request.get_json()
# 		print getJson
# 		if getJson is not None:
# 			user = Users.query.filter_by(id=cust_id).first()
# 			if user is not None and user.authenticated==True:
# 				restid=user.rest_id
# 				restaurant = Restaurant.query.filter_by(rest_id=restid).first()
# 				if restaurant is not None:
# 					print restaurant.as_dict()
# 					print "Restaurant details:"
# 					print request.get_json()['name']
# 					# restaurant.address = request.get_json()['address']
# 					# restaurant.description = request.get_json()['description']
# 					# restaurant.open_time = request.get_json()['open_time']
# 					# restaurant.end_time = request.get_json()['end_time']
# 					# restaurant.image_url = request.get_json()['image_url']
# 					# restaurant.name = request.get_json()['name']
# 					# restaurant.address = request.get_json()['address']
# 					# restaurant.description = request.get_json()['description']
# 					# restaurant.open_time = request.get_json()['open_time']
# 					# restaurant.end_time = request.get_json()['end_time']
# 					# restaurant.image_url = request.get_json()['image_url']
				
# 					db.session.commit()


# 	else:
# 		print "Did not get post request"
# 		return "SUCCESS"










@app.route('/restaurant/edit/<cust_id>/<rest_id>',methods=['GET','POST'])
def edit_profile(cust_id,rest_id): 
	#print cust_id, rest_id
	if request.method == 'POST':
		getJson = request.get_json()
		#print "Recieved json" ,getJson
		if getJson is not None:
			curuser = Users.query.filter_by(id=cust_id).first()
			#print "user name" , curuser.username
			if curuser is not None:
				restid =curuser.rest_id
				#print "Restaurant ID" , curuser.rest_id, rest_id
				restaurant = Restaurant.query.filter_by(rest_id=restid).first()
				if restaurant is not None:
					#print restaurant.as_dict()
					#print "Restaurant details:"
					restaurant.name = request.get_json()['name']
					restaurant.address = request.get_json()['address']
					restaurant.description = request.get_json()['description']
					restaurant.open_time = request.get_json()['open_time']
					restaurant.end_time = request.get_json()['end_time']
					restaurant.image_url = request.get_json()['image_url']
					db.session.commit()
					return "SUCCESS" , 200
				else:
					return "failed",400
			else:
				return "failed",400
		else:
			#give error message
			return "failed",400
	else:
		return "failed",400