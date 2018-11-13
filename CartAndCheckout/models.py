from DigIn import db

import json

def to_json(inst, cls):
    """
    Jsonify the sql alchemy query result.
    """
    convert = dict()
    # add your coversions for things like datetime's
    # and what-not that aren't serializable.
    d = dict()
    for c in cls.__table__.columns:
        v = getattr(inst, c.name)
        print c.name
        print v
        print c.type
        print convert[c.type]
        if c.type in convert.keys() and v is not None:
            try:
                d[c.name] = convert[c.type](v)
            except:
                d[c.name] = "Error:  Failed to covert using ", str(convert[c.type])
        elif v is None:
            d[c.name] = str()
        else:
            d[c.name] = v
    return json.dumps(d)

class TOJSON():
    def as_dict(self):
        return { c.name: getattr(self, c.name) for c in self.__table__.columns }

class Restaurant(db.Model, TOJSON):
    __tablename__ = "Restaurant"

#Restaurant(name="Karachi cafe" , address ="Hyderabad, 12,Gachibowli", description="cafe", open_time="9.00 AM",end_time="9:00 PM" ,image_url="imgs/15.jpg")
    rest_id =  db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255) ) #,  nullable=False)
    address = db.Column(db.String(255) )#,  nullable=False)
    #contact = db.Column(db.String(255),  nullable=False)
    description = db.Column(db.String(500) , index=True)
    open_time = db.Column(db.String(255) ) #, nullable=False)
    end_time = db.Column(db.String(255)) #,nullable=True)
    image_url = db.Column(db.String(255))
    @property
    def json(self):
        return to_json(self, self.__class__)


class FoodItem(db.Model, TOJSON):
    __tablename__ = "FoodItem"

    item_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer , nullable=False)
    description = db.Column(db.Unicode(500), index=True, unique=True)
    image_url = db.Column(db.Unicode(128))
    rest_id = db.Column(db.Integer, db.ForeignKey('Restaurant.rest_id'))

    #https://github.com/psthomas/crud-restaurant/blob/master/database_setup.py

    @property
    def json(self):
        return to_json(self, self.__class__)




#from ..authentication.models import Users

class Cart(db.Model, TOJSON):
    __tablename__ = 'cart'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('FoodItem.item_id'))
    quantity = db.Column(db.Integer)

    @property
    def json(self):
        return to_json(self, self.__class__)

class Order(db.Model, TOJSON):
    __tablename__ = 'order'

    order_id = db.Column(db.Integer, primary_key=True)
    custid =  db.Column(db.Integer, db.ForeignKey('user.id'))
    #delivery address
    address = db.Column(db.String(255))
    #order purchase date
    date_purchased = db.Column(db.DateTime )
    orderstatus = db.Column(db.Integer, nullable = False)
    date_finished = db.Column(db.DateTime )

    @property
    def json(self):
        return to_json(self, self.__class__)

class OrderItem(db.Model, TOJSON):
    __tablename__ = 'orderitem'

    orderitem_id = db.Column(db.Integer, primary_key=True)
    order_id =  db.Column(db.Integer, db.ForeignKey('order.order_id'))
    fooditem_id = db.Column(db.Integer, db.ForeignKey('FoodItem.item_id'))
    #delivery address
    item_name = db.Column(db.String(255), nullable=False)
    #order purchase date
    item_description =  db.Column(db.String(255) )

    @property
    def json(self):
        return to_json(self, self.__class__)
