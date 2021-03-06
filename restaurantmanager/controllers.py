
from sqlalchemy import and_, func, between
from flask_login import login_required, current_user
from flask import Flask, render_template, redirect, url_for, session, g, Blueprint, request, jsonify, url_for,send_from_directory

import datetime
from datetime import datetime as dt
from datetime import timedelta
import json

from DigIn import db, app
import helper

from ..CartAndCheckout.models import Restaurant, FoodItem, Cart, Order, OrderItem,Notification
from ..authentication.models import Users

mod_manager = Blueprint('restaurantmanager', __name__)

def enum(**enums):
    return type('Enum', (), enums)

Orders = enum(ORDER_CREATED=1, ORDER_PROCESS=2, ORDER_FINISHED=3, ORDER_CANCEL=4)

# display the orders based or customerId but it needs login
@app.route("/orders/<cust_id>", methods=['GET'])
# @login_required
def retrieveOrders(cust_id):
    print ("In cart")
    user = Users.query.filter_by(id=cust_id).first()
    if user is not None and user.authenticated==True and user.role == 'admin':
        # cur_id = user.id
        orders = Order.query.order_by(Order.orderstatus).all()
        totalPrice = 0
        Ordersarr = []
        restid = None
        for order in orders:
            orderId = order.order_id
            curuser = Users.query.filter_by(id = order.custid).first()
            rest = Restaurant.query.filter_by(rest_id=order.rest_id).first()
            # print "cartid id", curcart.id," product id", curcart.product_id
            orderItems = OrderItem.query.filter_by(order_id=orderId).all()
            orderItemArr = []
            for orderItem in orderItems:
                orderItemJSON = orderItem.as_dict()
                fitem = FoodItem.query.filter_by(item_id=orderItem.fooditem_id).first()
                orderItemArr.append({"item":fitem.as_dict(),"quantity":orderItem.item_quantity})
            orderJSON = order.as_dict()
            orderJSON.update({'items': orderItemArr,'customer':curuser.as_dict(),'restaurant':rest.as_dict()})
            Ordersarr.append(orderJSON)
        return (json.dumps({"count": len(Ordersarr), "orderItems": Ordersarr, "role": 'admin'}, default=str), 200)
    else:
        # ask user to login before it is able to see the cart as cart is for any user
        return "Failed",400


# display the orders based or customerId but it needs login
@app.route("/orders/customer/<cust_id>", methods=['GET'])
# @login_required
def retrieveOrdersBasedOnCustomerId(cust_id):
    print ("In cart")
    user = Users.query.filter_by(id=cust_id).first()
    if user is not None and user.authenticated==True:
        # cur_id = user.id
        orders = Order.query.filter_by(custid=cust_id).order_by(Order.orderstatus).all()
        totalPrice = 0
        Ordersarr = []
        restid = None
        for order in orders:
            orderId = order.order_id
            # print "cartid id", curcart.id," product id", curcart.product_id
            orderItems = OrderItem.query.filter_by(order_id=orderId).all()
            orderItemArr = []
            for orderItem in orderItems:
                orderItemJSON = orderItem.as_dict()
                fitem = FoodItem.query.filter_by(item_id=orderItem.fooditem_id).first()
                orderItemArr.append({"item":fitem.as_dict(),"quantity":orderItem.item_quantity})

            restaurant = Restaurant.query.filter_by(rest_id=order.rest_id).first()
            rest=dict()
            if restaurant is not None:
                rest = restaurant.as_dict()

            orderJSON = order.as_dict()
            orderJSON.update({'items': orderItemArr,'customer':user.as_dict(),'restaurant':rest})
            Ordersarr.append(orderJSON)
        return (json.dumps({"count": len(Ordersarr), "orderItems": Ordersarr, "role": 'customer'}, default=str), 200)
    else:
        # ask user to login before it is able to see the cart as cart is for any user
        return "Failed",400



# display the orders based on customer and restaurant but it needs login
@app.route("/orders/restaurant/<cur_id>/<rest_id>", methods=['GET'])
# @login_required
def retrieveOrdersBasedOnRestaurantId(cur_id,rest_id):
    print( "In cart")
    user = Users.query.filter_by(id=cur_id).first()
    if user is not None and user.authenticated == True:
        
        restaurant = Restaurant.query.filter_by(rest_id=rest_id).first()
        if restaurant is not None:
            orders = Order.query.filter_by(rest_id=rest_id).order_by(Order.orderstatus).all()
            totalPrice = 0
            Ordersarr = []
            restid = None
            for order in orders:
                orderId = order.order_id
                user = Users.query.filter_by(id=order.custid).first()
                # print "cartid id", curcart.id," product id", curcart.product_id
                orderItems = OrderItem.query.filter_by(order_id=orderId).all()
                orderItemArr = []
                for orderItem in orderItems:
                    orderItemJSON = orderItem.as_dict()
                    fitem = FoodItem.query.filter_by(item_id=orderItem.fooditem_id).first()
                    orderItemArr.append({"item":fitem.as_dict(),"quantity":orderItem.item_quantity})

                orderJSON = order.as_dict()
                orderJSON.update({'items': orderItemArr,'restaurant':restaurant.as_dict(),'customer':user.as_dict()})
                Ordersarr.append(orderJSON)
            return (json.dumps({"count": len(Ordersarr), "orderItems": Ordersarr, "role": 'customer'}, default=str), 200)
        else:
            return (json.dumps({"count": 0, "orderItems": [], "role": 'customer'}, default=str), 200)
    else:
        # ask user to login before it is able to see the cart as cart is for any user
        return "failed"


# UPDATE the order confirmation of status
@app.route("/orders/<order_id>", methods=['POST'])
# @login_required
def updateConfirmationOrderStatus(order_id):
    if request.method == 'POST':
        getJson = request.get_json()
        custId = request.get_json()['custId']
        orderStatus = request.get_json()['orderStatus']
        user = Users.query.filter_by(id=custId).first()
        if user is not None and user.authenticated == True:
            order = Order.query.filter_by(order_id=order_id).first()
            orderItemArr = []
            if order is not None:
                order.orderstatus = orderStatus
                db.session.commit()
                dctstat = { 1:"Order Placed",2:"Processing",3:"Delivered",4:"Cancelled"}
                msgstat = 'Status of your order '+str(order.order_id)+' is '+dctstat[int(orderStatus)]
                msg = Notification(user_id=order.custid,n_type=1,read_status=0,message=msgstat)
                db.session.add(msg)
                db.session.commit()
                return "success"
            else:
                return "no order present",400
        else:
            return "falied",400

@app.route('/rating/<id>',methods=['GET','POST'])
def rateorder(id):
    user = Users.query.filter_by(id=id).first()
    if user is not None and user.authenticated == True:
        restid = request.get_json()['rest_id']
        orderid = request.get_json()['order_id']
        rating = request.get_json()['rating']
        order = Order.query.filter_by(order_id=orderid).first()
        order.rating = int(rating)
        db.session.commit()
        
        avg = db.session.query(func.avg(Order.rating)).filter(Order.rest_id==restid,Order.orderstatus == 3).scalar()
        print avg
        
        rest = Restaurant.query.filter_by(rest_id = restid).first()
        rest.rating = avg
        db.session.commit()
        return "success"

@app.route('/notifications/<id>',methods=['GET'])
def getNotifications(id):
    user = Users.query.filter_by(id=id).first()
    if user is not None: #and user.authenticated == True:
        if user.role == 'restaurant':
            restid = user.rest_id
            msgs = Notification.query.filter_by(rest_id=restid,read_status=0).all()
            msgarr =[]
            for msg in msgs:
                msgarr.append(msg.message)
            return json.dumps({'count':len(msgarr),'messages':msgarr})
        elif user.role == 'customer':
            msgs = Notification.query.filter_by(user_id=user.id,read_status=0).all()
            msgarr =[]
            for msg in msgs:
                msgarr.append(msg.message)
            return json.dumps({'count':len(msgarr),'messages':msgarr})
        elif user.role=='admin':
            msgs = Notification.query.filter_by(read_status=0).all()
            msgarr =[]
            for msg in msgs:
                msgarr.append(msg.message)
            return json.dumps({'count':len(msgarr),'messages':msgarr})
    return "failed",400

@app.route('/notifications/read/<id>')
def updatestatusnotification(id):
    user = Users.query.filter_by(id=id).first()
    if user is not None and user.authenticated == True:
        if user.role == 'restaurant':
            restid = user.rest_id
            msgs = Notification.query.filter_by(rest_id=restid,read_status=0).all()
            
            for msg in msgs:
                msg.read_status=1
            db.session.commit()
            # return json.dumps({'count':len(msgarr),'messages':msgarr})
        elif user.role == 'customer':
            msgs = Notification.query.filter_by(user_id=user.id,read_status=0).all()
            for msg in msgs:
                msg.read_status=1
            db.session.commit()
        elif user.role=='admin':
            msgs = Notification.query.filter_by(read_status=0).all()
            for msg in msgs:
                msg.read_status=1
            db.session.commit()
        return "success"
    return "failure",400
            



