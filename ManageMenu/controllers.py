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


@app.route('/menu/<userid>',methods=['GET','POST'], endpoint='addToMenu')
#@login_required
def addToMenu(userid):
	# cur_user_id = request.get_json()[userid]
	curuser = Users.query.filter_by(id=userid).first()
	if curuser is not None:
		user_restid = curuser.rest_id
		restaurant = Restaurant.query.filter_by(rest_id = user_restid).first()
    	if restaurant is None:
        	return "Not authorized", 400
    	else:
			name = request.get_json()['name']
			price= request.get_json()['price']
			description =request.get_json()['description']
			cur_food =  FoodItem(name=name, price=price, description=description,rest_id=user_restid,quantity=1)
			db.session.add(cur_food)
			db.session.commit()
			return str(cur_food.item_id)
	return "Not authorized", 400

@app.route('/menu/<itemid>',methods=['DELETE'])
#@login_required
def deleteItem(itemid):
	#cur_user_id = request.get_json()[userid]
	curItem =  FoodItem.query.filter_by(item_id=itemid).first()
	#Users.query.filter_by(id=cur_user_id).first()
	if curItem is not None:
		try:
			db.session.delete(curItem)
			db.session.commit()
			return "SUCCESS", 200
		except Exception as e:
			print "EXCEPTION HAPPENED"
			db.session.rollback()
			return "failure", 404
	else:
		return "error", 404


@app.route('/menu/edit/<post_itemid>',methods=['GET','POST'], endpoint='edit_item_profile')
def edit_item_profile(post_itemid):
	#print cust_id, rest_id
	if request.method == 'POST':
		getJson = request.get_json()
		print "Recieved json" ,getJson
		if getJson is not None and post_itemid is not None:
			curItem = FoodItem.query.filter_by(item_id=post_itemid).first()
			#print "user name" , curuser.username
			if curItem is not None:
				print FoodItem.as_dict()
				if 'name' in getJson:
					editName = request.get_json()['name']
					if editName is not None:
						curItem.name = editName
				if 'price' in getJson:
					editprice = request.get_json()['price']
					if editprice is not None:
						curItem.price = editprice
				if 'quantity' in getJson:
					editquantity = request.get_json()['quantity']
					if editquantity is not None:
						curItem.quantity = editquantity
				if 'description' in getJson:
					description = request.get_json()['description']
					if description is not None:
						curItem.description = description
				if 'image_url' in getJson:
					cururl = request.get_json()['image_url']
					if cururl is not None:
						curItem.image_url = cururl
				db.session.commit()
				return "SUCCESS" , 200
			else:
				return "failed",400
		else:
			#give error message
			return "failed",400
	else:
		return "failed",400

