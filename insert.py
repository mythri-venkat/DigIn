
import sqlite3
from sqlite3 import Error



 #res1 =  Restaurant(name= "Karachi cafe" , address ="Hyderabad, 12,Gachibowli" ,description="cafe", open_time="9.00 AM",end_time="9:00 PM" ,image_url="imgs/15.jpg")

# Restaurant( "Dominos" ,"Hyderabad, 10,Gachibowli.", "Pizza", "9.00 AM", "9:00 PM" , "imgs/11.jpg"),

# Restaurant("Paradise" ,"Hyderabad, 11,Gachibowli", "Biryani","9.00 AM","9:00 PM" , "imgs/1.jpg"),


	#INSERT INTO Restaurant(name,address ,description,open_time,end_time, image_url) VALUES("Paradise" ,"Hyderabad, 11,Gachibowli", "Biryani","9.00 AM","9:00 PM" , "imgs/1.jpg");
	
	#INSERT INTO Restaurant(name,address ,description,open_time,end_time, image_url) VALUES( "Dominos" ,"Hyderabad, 10,Gachibowli.", "Pizza", "9.00 AM", "9:00 PM" , "imgs/11.jpg");

	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("CupCake", 100, 10 , "Cake", "images1.jpg",1);
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Carrot Cake", 100, 5 , "Cake", "images2.jpg",1);
        #INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Brownie", 100, 5 , "Cake", "images3.jpg",1);	
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Brownie", 100, 5 , "Cake", "images3.jpg",1);	

	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Veg Biryani", 300, 15 , "Meal", "images21.jpg",2);	
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Mutton Biryani", 200, 15 , "Very spicy", "images22.jpg",2);
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Chicken Biryani", 200, 15 , "Very spicy", "images23.jpg",2);		
	
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Cheese Pizza", 100, 15 , "Small Size", "images31.jpg",3);	
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Farmhouse Pizza", 200, 15 , "Medium Size", "images31.jpg",3);
	#INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Chicken Biryani", 300, 15 , "large size", "images23.jpg",3);						



def create_connection():
    try:
	conn = sqlite3.connect("Restaurant.sqlite")
      
	conn.execute('''INSERT INTO Restaurant(name,address,description,open_time,end_time, image_url) VALUES ("Karachi Cafe","Hyderabad, 12,Gachibowli.", "Bakery", "9.00 AM", "9:00 PM","imgs/15.jpg");''')	
	conn.execute('''INSERT INTO Restaurant(name,address ,description,open_time,end_time, image_url) VALUES("Paradise" ,"Hyderabad, 11,Gachibowli", "Biryani","9.00 AM","9:00 PM" , "imgs/1.jpg");''')
	conn.execute('''INSERT INTO Restaurant(name,address,description,open_time,end_time, image_url) VALUES ("Dominos","Hyderabad, 10,Gachibowli.", "Pizza", "9.00 AM", "9:00 PM","imgs/11.jpg");''')	
	conn.execute('''INSERT INTO Restaurant(name,address ,description,open_time,end_time, image_url) VALUES("Agra sweets" ,"Hyderabad, 13,Gachibowli", "Sweets","9.00 AM","9:00 PM" , "imgs/4.jpg");''')
	
#	conn.execute('''CREATE TABLE FoodItem (ID INT PRIMARY KEY NOT NULL,
#         					name           TEXT    NOT NULL,
#					        price            INT     NOT NULL,
#						quantity 	 INT 	 NOT NULL,
#						description      TEXT,
#						image_url        TEXT    NOT NULL,
#        					rest_id 	INT   NOT NULL);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("CupCake", 100, 10 , "Cake", "images1.jpg",1);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES  ("Carrot Cake", 100, 5 , "Carrot Cake", "images2.jpg",1);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Brownie", 100, 5 , "Chocolate Cake", "images3.jpg",1);''')		

	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Veg Biryani", 300, 15 , "Meal", "images21.jpg",2);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES  ("Mutton Biryani", 200, 15 , "Very spicy", "images22.jpg",2);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Chicken Biryani", 200, 15 , "Chicken Biryani", "images23.jpg",2);''')	

	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES  ("Cheese Pizza", 100, 15 , "Small Size", "images31.jpg",3);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES  ("Farmhouse Pizza", 200, 15 , "Medium Size", "images31.jpg",3);''')
	conn.execute('''INSERT INTO FoodItem( name,price,quantity,description, image_url , rest_id) VALUES ("Chicken Biryani", 300, 15 , "large size", "images23.jpg",3);''')			

		
	print(sqlite3.version)
	conn.commit()
   	conn.close()
    except Error as e:
	print(e)  


if __name__ == '__main__':
    create_connection()

