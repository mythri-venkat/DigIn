from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
import copy 
app = Flask(__name__)
api = Api(app)
orders = [{
		"id":"ORDR1",
		"status":"Paid",
		"userId":"USER1234",
		"totalAmount":1000,
		"orderItems":[{
			"id":"ORIT1",
			"itemId":"ITEM12",
			"qtyOrdered":4,
			"items":[{
				"id":"ITEM12",
				"restId":"REST1234",
				"name":"Item1",
				"image":"images1.jpg",
				"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
				"price":100,	
				"availability":10,	
				"rating":4
			}]
		},{
			"id":"ORIT2",
			"itemId":"ITEM13",
			"qtyOrdered":5,
			"items":[{
				"id":"ITEM124",
				"restId":"REST1234",
				"name":"Item 3",
				"image":"images3.jpg",
				"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
				"price":120,	
				"availability":8,	
				"rating":5	
			}]
		}]
	},{
		"id":"ORDR2",
		"status":"Ordered",
		"userId":"USER1234",
		"totalAmount":500,
		"orderItems":[{
			"id":"OR2T1",
			"itemId":"ITEM12",
			"qtyOrdered":2,
			"items":[{
				"id":"ITEM12",
				"restId":"REST1234",
				"name":"Item1",
				"image":"images1.jpg",
				"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
				"price":100,	
				"availability":10,	
				"rating":4
			}]
		},{
			"id":"OR2T2",
			"itemId":"ITEM125",
			"qtyOrdered":2,
			"items":[{
				"id":"ITEM125",
				"restId":"REST1234",
				"name":"Item4",
				"image":"images4.jpg",
				"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
				"price":150,	
				"availability":7,	
				"rating":2	
			}]
		}]
}]
restaurants = [
	{
		"id":"REST1234",
		"name":"Paradise",
		"address":"Chennai,wsvwe,wefc,wedf,wewevweddc.",
		"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",
		"tags":"askj asjjk aslkl adcadc",
		"timing-start":"9:00 AM",
		"timing-end":"9:00 PM",
		"image":"imgs/1.jpg",
		"rating":4,
		"items":[{
			"id":"ITEM12",
			"restId":"REST1234",
			"name":"Item1",
			"image":"imgs/1.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":100,	
			"availability":10,	
			"rating":4
		},{
			"id":"ITEM123",
			"restId":"REST1234",
			"name":"Item2",
			"image":"imgs/2.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":190,	
			"availability":5,	
			"rating":4	
		},{
			"id":"ITEM124",
			"restId":"REST1234",
			"name":"Item 3",
			"image":"imgs/3.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":120,	
			"availability":8,	
			"rating":5	
		},{
			"id":"ITEM125",
			"restId":"REST1234",
			"name":"Item4",
			"image":"imgs/4.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":150,	
			"availability":7,	
			"rating":2	
		}]
	},
	{
		"id":"REST22345",
		"name":"Dominos",
		"address":"Chennai,wsvwe,wefc,wedf,wewevweddc.",
		"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",
		"tags":"askj asjjk aslkl adcadc",
		"timing-start":"9:00 AM",
		"timing-end":"9:00 PM",
		"image":"imgs/11.jpg",
		"rating":3,
		"items":[{
			"id":"ITEM22",
			"restId":"REST22345",
			"name":"Item1",
			"image":"imgs/11.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":100,	
			"availability":10,	
			"rating":5	
		},{
			"id":"ITEM223",
			"restId":"REST22345",
			"name":"Item2",
			"image":"imgs/12.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":190,	
			"availability":5,	
			"rating":3	
		},{
			"id":"ITEM224",
			"restId":"REST22345",
			"name":"Item 3",
			"image":"imgs/13.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":120,	
			"availability":8,	
			"rating":4	
		},{
			"id":"ITEM225",
			"restId":"REST22345",
			"name":"Item4",
			"image":"imgs/14.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":150,	
			"availability":7,	
			"rating":3	
		}]
	},
	{
		"id":"REST22346",
		"name":"Pizza Hut",
		"address":"Hyderabad",
		"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",
		"tags":"askj asjjk aslkl adcadc",
		"timing-start":"9:00 AM",
		"timing-end":"9:00 PM",
		"image":"imgs/15.jpg",
		"rating":4,
		"items":[{
			"id":"ITEM32",
			"restId":"REST22346",
			"name":"Item1",
			"image":"imgs/1.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":100,	
			"availability":10,	
			"rating":4	
		},{
			"id":"ITEM323",
			"restId":"REST22346",
			"name":"Item2",
			"image":"imgs/16.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":190,	
			"availability":5,	
			"rating":3	
		},{
			"id":"ITEM324",
			"restId":"REST22346",
			"name":"Item 3",
			"image":"imgs/2.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":120,	
			"availability":8,	
			"rating":2	
		},{
			"id":"ITEM325",
			"restId":"REST22346",
			"name":"Item4",
			"image":"imgs/3.jpg",
			"description":"sckn dlkcm a;cm;a, ;oo dcjn dwsc",	
			"price":150,	
			"availability":7,	
			"rating":4	
		}]
	}
]

users = [
	{
		"id":"user1",
		"first_name":"f_name",
		"last_name":"l_name",
		"role":"customer",
		"username":"username1",
		"password":"username1",
		"email":"madslfj@akdfjh.com",
		"phone":"154545",
		"address":"akdsfajsdfjjd",
	},
	{
		"id":"user2",
		"first_name":"f_name2",
		"last_name":"l_name2",
		"role":"customer",
		"username":"username2",
		"password":"username2",
		"email":"madslfj@akdfjh.com",
		"phone":"154545",
		"address":"akdsfajsdfjjd",
	},
	{
		"id":"user3",
		"first_name":"f_name3",
		"last_name":"l_name3",
		"role":"restaurant",
		"username":"username3",
		"password":"username3",
		"email":"madslfj@akdfjh.com",
		"phone":"154545",
		"address":"akdsfajsdfjjd",
	}
]
class Restaurants(Resource):
	def get(self, name=None):
		if (name is None):
			return restaurants
		else:
			restaurantsTemp =  copy.deepcopy(restaurants) 
			searchedRestaurants = []
			for restaurant in restaurantsTemp:
				if(name == restaurant["name"]):
					searchedRestaurants.append(restaurant)
				else:
					searchedItems = []
					for item in restaurant["items"]:
						if(name.lower() in item["name"].lower()):
							searchedItems.append(item)
					if(len(searchedItems)>0):
						restaurant["items"] = searchedItems
						searchedRestaurants.append(restaurant)
			return searchedRestaurants,200
		return "Restaurant not found", 404	
			
class Orders(Resource):
	def get(self, id=None):
		if(id==None):
			return orders
		else:
			for order in orders:
				if(id == order["id"]):
					return order,200
			return "Restaurant not found", 404
	def post(self):
		json_data = request.get_json(force=True)
		return json_data,200

class Login(Resource):
	def post(self):
		args = request.get_json(force=True)
		for user in users:
			if(args["username"] == user["username"]):
				return user,200
		return "user not found",404


api.add_resource(Restaurants, "/restaurants/<string:name>","/restaurants")
api.add_resource(Orders, "/orders/<string:id>","/orders")
api.add_resource(Login,"/login")
app.run(debug=True, port=5001)