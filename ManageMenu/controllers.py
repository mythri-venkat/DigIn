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


@app.route('/menu/<userid>',methods=['GET','POST'])
#@login_required
def addToMenu(userid):
	cur_user_id = request.get_json()[userid]
	curuser = Users.query.filter_by(id=cur_user_id).first()
	if curuser is not None:
		user_restid = curuser.rest_id
		restaurant = Restaurant.query.filter_by(rest_id = user_restid).first()
    	if restaurant is None:
        	return "Not authorized", 400
    	else:
			name = request.get_json()['name']
			price= request.get_json()['price']
			quantity =request.get_json()['quantity']
			description =request.get_json()['description']
			cur_food =  FoodItem(name=name, price=price, quantity=quantity,description=description,rest_id=cur_rest_id)
			db.session.add(cur_food)
			db.session.commit()
			return str(cur_food.item_id)
	return "Not authorized", 400



# #@login_required
# def delete_menu_item(rest_id):
#     if request.method == 'POST':
#         getJson = request.get_json()
#         if getJson is not None:
#             try:
#                 db.session.query(FoodItem).filter(FoodItem.item_id==request.get_json()['item_id']).delete()
#                 print "Inside delete"
#                 db.session.commit()
#                 return "success", 200
#             except Exception as e:
#                 print eif
#                 print "EXCEPTION HAPPENED"
#                 db.session.rollback()
#                 return "failure", 404
#         else:
#             return "error", 404
#
#
#
# #sends count of orders of the restraunt
# #@login_required
# def get_count(rest_id):
#     orders = Order.query.filter_by(rest_id=rest_id).all()
#     count=0
#     for order in orders:
#         count=count+1
#     return count
