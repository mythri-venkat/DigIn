
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


#To display the home page after retrieval from database
#, methods=['GET', 'POST']
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

    if (len(restaurant_objs) == 0):
        item_objs = FoodItem.query.filter(FoodItem.name.contains(searchName)).all()
        if item_objs is None:
            return (json.dumps({"counts": 0, "restaurants": {}, "role": 'customer'}), 200)

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
                print ( "Item Name:" , item.name)
                item_json = item.as_dict()
                print ( "item_json " , item_json)
                Items.append(item_json)
                print ("all Items" ,Items)
                rest_json.update({'items': Items})
                print (rest_json)
            restaurants.append(rest_json)
    else:
        restaurant_dict = {}
        item_objs = FoodItem.query.filter(FoodItem.name.contains(searchName)).all()
        if item_objs is None:
            return
        for item in item_objs:
            print item.rest_id
            if item.rest_id in restaurant_dict:
                restaurant_dict[item.rest_id].append(item)
                #value.append(item)  #insertitem(item)
            else:
                items = []
                items.append(item)
                restaurant_dict[item.rest_id] = items
        print  "Restaurant dictionary" , restaurant_dict
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
        print "item search", restaurants
        #restaurants.append("Karachi Cake")
        #print item_objs

    return (json.dumps({"counts": len(restaurants), "restaurants": restaurants, "role": 'customer'}), 200)
