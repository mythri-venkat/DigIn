from sqlalchemy import and_, func, between
from flask_login import login_required, current_user
from flask import Flask, render_template, redirect, url_for, session, g, Blueprint, request, jsonify, url_for,send_from_directory

import datetime
from datetime import datetime as dt
from datetime import timedelta
import json

from DigIn import db, app
from .models import Restaurant, FoodItem, Cart, Order, OrderItem
from ..authentication.models import Users
import helper

mod_client = Blueprint('CartAndCheckout', __name__)

# To display the home page after retrieval from database
# , methods=['GET', 'POST']


#To display the home page after retrieval from database
#, methods=['GET', 'POST']

@app.route('/<path:path>')
def send_html(path):
    print path
    return send_from_directory(app.static_folder, path)



#searchName
@app.route('/restaurants/', methods=['GET', 'POST'])
@app.route('/restaurants/<searchName>', methods=['GET', 'POST'])
# @login_required
def show_home(searchName=None):
    print "Show Home"
    restaurant_objs = None
    item_objs = None
    print searchName
    if searchName is None:
        #print "SearchName is None"
        restaurant_objs = Restaurant.query.filter().all()
    else :
        #print "SearchName is not none"
        restaurant_objs = Restaurant.query.filter(Restaurant.name.contains(searchName)).all()
        rest_count = Restaurant.query.filter(Restaurant.name.contains(searchName)).count()
        print len(restaurant_objs)

    restaurants = []
    if (len(restaurant_objs) > 0) :# restaurant_objs is not None:
        #print "Restaurant is not none"
        for restaurant in restaurant_objs:
            rest_json = restaurant.as_dict()
            cur_rest_id = restaurant.rest_id
            #print ("restaurant id : " , cur_rest_id)
            item_objets = FoodItem.query.filter_by(rest_id=cur_rest_id).all()
            count = FoodItem.query.filter_by(rest_id=cur_rest_id).count()
            #print ( "total items : " ,  count)
            Items = []
            for item in item_objets:
                # print ( "Item Name:" , item.name)
                item_json = item.as_dict()
                # print ( "item_json " , item_json)
                Items.append(item_json)
                # print ("all Items" ,Items)
                rest_json.update({'items': Items})
                # print (rest_json)
            restaurants.append(rest_json)
    else:
        restaurant_dict = {}
        item_objs = FoodItem.query.filter(FoodItem.name.contains(searchName)).all()
        if item_objs is None:
            return (json.dumps({"counts": 0, "restaurants": {}, "role": 'customer'}), 200)
        for item in item_objs:
            # print item.rest_id
            if item.rest_id in restaurant_dict:
                restaurant_dict[item.rest_id].append(item)
                #value.append(item)  #insertitem(item)
            else:
                items = []
                items.append(item)
                restaurant_dict[item.rest_id] = items
        # print  "Restaurant dictionary" , restaurant_dict
        for curid in restaurant_dict:
            print curid
            restaurant_obj = Restaurant.query.filter_by(rest_id = curid).first()
            rest_json = restaurant_obj.as_dict()
            items = restaurant_dict[curid]
            Items = []
            for item in items:
                cur_item_json = item.as_dict()
                Items.append(cur_item_json)
                rest_json.update({'items': Items})
            restaurants.append(rest_json)
        # print "item search", restaurants
        #restaurants.append("Karachi Cake")
        #print item_objs
    return (json.dumps({"count": len(restaurants), "restaurants": restaurants, "role": 'customer'}), 200)


@app.route("/cart/<id>",methods=['DELETE'])
def clearCart(id):
    print request.method

    if(request.method ==  'DELETE'):
        try:
            db.session.query(Cart).filter(Cart.user_id==id).delete()
            db.session.commit()
            return "success",200
        except Exception as e:
            print eif
            db.session.rollback()
            return "failure",404
    else:
        return "wrong method",404


# display the cart but it needs login
@app.route("/cart/<cur_id>", methods=['GET', 'POST'])
# @login_required
def cart(cur_id):
    user = Users.query.filter_by(id=cur_id).first()
    if user is not None:  # and user.authenticate(password):
        # print user.email
        # print (request.get_json())
        user.authenticated = True
        # cur_id = user.id
        carts = Cart.query.filter_by(user_id=cur_id).all()
        totalPrice = 0
        Items = []
        restid = None
        for curcart in carts:
            cur_prod = curcart.product_id
            # print "cartid id", curcart.id," product id", curcart.product_id
            cur_item = FoodItem.query.filter_by(item_id=cur_prod).first()
            if restid is None:
                restid = cur_item.rest_id
            price = cur_item.price
            item_quantity = curcart.quantity
            totalPrice = totalPrice + (item_quantity * price)
            prod_json = cur_item.as_dict()
            Items.append({"item": prod_json, "quantity": item_quantity})
            # print (Items)
        curRestaurant = Restaurant.query.filter_by(rest_id=restid).first()
        rest_json = curRestaurant.as_dict()
        resultJson = { "restaurant": rest_json,"items":Items}
        # print resultJson
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



@app.route("/order", methods=['GET', 'POST'])
# @login_required
def OrderAdd():
    if request.method == 'POST':
        getJson = request.get_json()
        print ("order " ,getJson)
        cur_cust_id = request.get_json()['custId']
        #cur_rest_id = request.get_json()['rest_id']
        allItemslist = request.get_json()['items']
        purchase_dtime = dt.now()
        purchase_dtime = dt.strptime(purchase_dtime.strftime('%Y-%m-%d %H:%M'), '%Y-%m-%d %H:%M')
        orderCur = None
        orderCur = Order(custid=cur_cust_id, date_purchased= purchase_dtime , orderstatus=Orders.ORDER_CREATED)
        if orderCur is None:
            print "Creation failed"
        db.session.add(orderCur)
        db.session.flush()
        print "orderId" , orderCur.order_id
        cur_order_id = orderCur.order_id
        for cartItem in allItemslist:
            cur_item_id  =  cartItem['item_id']
            cur_item_quantity  =  cartItem['quantity']
            curItem = OrderItem( order_id = cur_order_id, fooditem_id = cur_item_id, item_quantity = cur_item_quantity)
            db.session.add(curItem)
    db.session.commit()
    return str(cur_order_id)

@app.route("/orders/rest=<id>",methods=['GET'])
def getorders(id):
    order = {
        "count":5,
        "orders":[{
            "rest_id":1,
            "cust_id":5,
            "date":"2-12-2018"
        }]
    }
    return json.dumps(order)
