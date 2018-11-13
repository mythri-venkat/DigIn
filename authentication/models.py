from DigIn import db
from passlib.hash import argon2


class TOJSON():
    def as_dict(self):
        return { c.name: getattr(self, c.name) for c in self.__table__.columns }

class Users(db.Model, TOJSON ):

    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    authenticated = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(255),default="customer")
    restname = db.Column(db.String,default="")
    address = db.Column(db.String,nullable=True)

    def __init__(self, first_name, last_name, email,username,password,address,role,restname):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.username = username
        self.password = password
        self.address = address
        self.restname = restname
        self.role = role

    def authenticate(self, password):
        return argon2.verify(password, self.password)

    def change_password(self, old_password, new_password):
        if not argon2.verify(old_password, self.password):
            return False
        self.password = argon2.hash(new_password)
        self.save()
        return True

    @property
    def is_authenticated(self):
        return self.authenticated

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

#    def __repr__(self):
#        return '<User {0}>'.format(self.email)
