from sqlalchemy import and_, func, between
from flask_login import login_required, current_user
from flask import Flask, render_template, redirect, url_for, session, g, Blueprint, request, jsonify, url_for

import datetime
from datetime import datetime as dt
from datetime import timedelta

from DigIn import db, app
# import helper

from .models import Restaurant, FoodItem, Cart
import json
from ..authentication.models import Users

mod_client = Blueprint('client', __name__)

# To display the home page after retrieval from database
# , methods=['GET', 'POST']

def enum(**enums):
    return type('Enum', (), enums)

Orders = enum(ORDER_CREATED=1, ORDER_PROCESS=2, ORDER_FINISHED=3, ORDER_CANCEL=4)

print(Orders.ORDER_CREATED)

#To display the home page after retrieval from database
#, methods=['GET', 'POST']

@app.route('/restaurants', methods=['GET', 'POST'])
# @login_required
def show_home():
    print "Show Home"
    restaurant_objs = Restaurant.query.filter().all()
    rest_count = Restaurant.query.count()
    print rest_count
    s = json.dumps([r.as_dict() for r in restaurant_objs])
    #print (s)
    restaurants = []
    for restaurant in restaurant_objs:
        rest_json = restaurant.as_dict()
        cur_rest_id = restaurant.rest_id
        #print ("restaurant id : " , cur_rest_id)
        item_objets = FoodItem.query.filter_by(rest_id=cur_rest_id).all()
        count = FoodItem.query.filter_by(rest_id=cur_rest_id).count()
        #print ( "total items : " ,  count)
        Items = []
        for item in item_objets:
            #print ( "Item Name:" , item.name)
            item_json = item.as_dict()
            # print ( "item_json " , item_json)
            Items.append(item_json)
        # print ("all Items" ,Items)
        rest_json.update({'items': Items})

        restaurants.append(rest_json)
        # print (rest_json)
    # ret_Data
    return (json.dumps({"counts": len(restaurants), "restaurants": restaurants, "role": 'customer'}), 200)


# display the cart but it needs login
@app.route("/cart/<cur_id>", methods=['GET', 'POST'])
# @login_required
def cart(cur_id):
    print "In cart"
    #
    # return json.dumps({"restaurant":{"rest_id":1,"name":"Karachi Cafe","address":"gachibowli"},"items":[{"item": {
    #     "description": "Cake",
    #     "image_url": "images1.jpg",
    #     "item_id": 1,
    #     "name": "CupCake",
    #     "price": 100,
    #     "quantity": 10,
    #     "rest_id": 1,
    # }, "quantity": 4}]})
    print "cur_id"
    print cur_id
    print (request.get_json())
    user = Users.query.filter_by(id=cur_id).first()
    if user is not None:  # and user.authenticate(password):
        print user.email
        print (request.get_json())
        user.authenticated = True
        # cur_id = user.id
        carts = Cart.query.filter_by(user_id=cur_id).all()
        totalPrice = 0
        Items = []
        restid = None
        for curcart in carts:
            cur_prod = curcart.product_id
            print "cartid id", curcart.id," product id", curcart.product_id
            cur_item = FoodItem.query.filter_by(item_id=cur_prod).first()
            if restid is None:
                restid = cur_item.rest_id
            price = cur_item.price
            item_quantity = curcart.quantity
            totalPrice = totalPrice + (item_quantity * price)
            prod_json = cur_item.as_dict()
            Items.append({"item": prod_json, "quantity": item_quantity})
            print (Items)
        curRestaurant = Restaurant.query.filter_by(rest_id=restid).first()
        rest_json = curRestaurant.as_dict()
        resultJson = { "restaurant": rest_json,"items":Items}
        print resultJson
        return json.dumps({ "restaurant": rest_json,"items":Items} )
    else:
        # ask user to login before it is able to see the cart as cart is for any user
        render_template("login.html")




@app.route("/cart/add", methods=['GET', 'POST'])
# @login_required
def addToCart():
    from ..authentication.models import Users
    print "cart/add"
    print (request.get_json())
    cust_id = request.get_json()['cust_id']
    user = Users.query.filter_by(id=cust_id).first()
    if user is None:
        render_template("login.html")
    else:
        productId = int(request.get_json()['product_id'])
        product_count = request.get_json()['quantity']
        curid = user.id
        getProduct = Cart.query.filter_by(user_id=curid, product_id=productId).first()
        # if no product is present for given user id and product id
        # create a new cart and and add to it
        if(getProduct is None):
            cartNew = Cart(user_id=user.id, product_id=productId, quantity=product_count)
            db.session.add(cartNew)
            db.session.commit()
        else:
            # else increment the qunatity and commit the session
            getProduct.quantity += product_count
            db.session.commit()
    return "success"
    # return redirect(url_for('restaurants'))


# similarty write for removeFromCart


@app.route("/cart/delete", methods=['GET', 'POST'])
# @login_required
def removeFromCart():
    from ..authentication.models import Users
    cust_id = request.get_json()['cust_id']
    user = Users.query.filter_by(id=cust_id).first()
    if user is None:
        redirect(url_for('restaurants'))
    else:
        productId = int(request.get_json()['product_id'])
        # we are just deleting the product not decrearing quantity
        #hence we are able to find a product we will just remove it
        #decreasing quantity need to implement later
        #delet_prod_cnt = int(request.get_json()['quantity'])
        #id  = user.id
        getProduct = Cart.query.filter_by(user_id=cust_id, product_id=productId).first()
        # if no product is present for given user id and product id
        # create a new cart and and add to it
        if(getProduct is not None):
            # Print Error login
            #print "Error"
        #else:
            # else increment the qunatity and commit the session
            #getProduct.quantity = getProduct.quantity - delet_prod_cnt
            db.session.delete(getProduct)
            db.session.commit()

    return "SUCCESS"
