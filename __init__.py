from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

import atexit
from datetime import datetime, timedelta
import logging, requests
import os
from flask.ext.bcrypt import Bcrypt




project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "Restaurant.sqlite"))


def init_db(db):
    from authentication.models import Users
    from .CartAndCheckout.models import Restaurant, FoodItem, Cart , Order,OrderItem

   # db.drop_all()

    db.create_all()

    def save(model):
        db.session.add(model)
        db.session.commit()

    db.Model.save = save


app = Flask(__name__,static_folder='public')
app.config["SQLALCHEMY_DATABASE_URI"] = database_file
app.secret_key = os.urandom(24)
bcrypt = Bcrypt(app)
#app.config.from_object('client_config')
db = SQLAlchemy(app)

init_db(db)
migrate = Migrate(app, db)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'authentication.login'

#from authentication.models import Users


#@login_manager.user_loader
#def load_user(user_id):
    #print user_id
#    return Users.query.filter(Users.id == int(user_id)).first()


log = logging.getLogger('apscheduler.executors.default')
log.setLevel(logging.INFO)  # DEBUG

fmt = logging.Formatter('%(levelname)s:%(name)s:%(message)s')
h = logging.StreamHandler()
h.setFormatter(fmt)
log.addHandler(h)

from .authentication.controllers import mod_auth
from .CartAndCheckout.controllers import mod_client
from .restaurantmanager.controllers import mod_manager
from .ManageMenu.controllers import mod_menu
#from .client.controllers import mod_client


app.register_blueprint(mod_auth )#, url_prefix='/auth')
app.register_blueprint(mod_client ) #, url_prefix='/client')
app.register_blueprint(mod_manager)
app.register_blueprint(mod_menu)

if __name__=="__main__":
    app.run(host='127.0.0.1', port=5001)




#def init_restaurant_db():
 #   from CartAndCheckout.models import Restaurant
    #restaurant_objs = [
    #    Restaurant(rest_id="REST22345", name= "Dominos" , address ="Hyderabad, 10,Gachibowli.", description="Pizza", open_time="9.00 AM",end_time="9:00 PM" , image_url="imgs/11.jpg"),
    #    Restaurant(rest_id="REST1234", name= "Paradise" , address ="Hyderabad, 11,Gachibowli", description="Biryani", open_time="9.00 AM",end_time="9:00 PM" , image_url="imgs/1.jpg"),
    #res1 =  Restaurant(name= "Karachi cafe" , address ="Hyderabad, 12,Gachibowli", contact="986675678" ,description="cafe", open_time="9.00 AM",end_time="9:00 PM" ,image_url="imgs/15.jpg")
    #res1 =  Restaurant(name= "Karachi cafe" , address ="Hyderabad, 12,Gachibowli" ,description="cafe", open_time="9.00 AM",end_time="9:00 PM" ,image_url="imgs/15.jpg")
    #]
    #db.session().add(res1)
    #db.session.commit()

#init_restaurant_db()
