angular.module('app')
    .service('restaurant', ['$http', function ($http) {
        var url = "http://127.0.0.1:5001/"

        this.getAll = function (offset, limit) {
            return $http.get(url + 'restaurants').then(function (response) {
                if (response.status == '200') {
                    rests = response.data.restaurants;
                    return response.data;
                }
                else {
                    return false
                }

            }, function (error) {
                console.log(error);
                return false;
            });

        }
        this.search = function (name) {
            console.log(name);
            console.log(url + "restaurants/" + name)
            return $http.get(url + "restaurants/" + name).then(function (response) {
                if (response.status == '200') {
                    rests = response.data.restaurants;
                    return response.data;
                }
                else {
                    return false
                }

            }, function (error) {
                alert(error);
                return false;
            });

        }

        this.getRestaurant = function (id) {

            return rests[id];
        }
    }])
    .service('cart', ['$http','shared', function ($http,shared) {
        var items = {};
        var vm = this;
        
        var restaurant = {};
        this.itemCount = 0;
        var strurl = "http://127.0.0.1:5001/"
        var obs = [];

        var loginwatch = function(){
            if(shared.isloggedIn()){
                this.getItems(shared.getUser().id);
            }
            else{
                vm.itemCount = 0;
                notify();
            }
            
        }

        shared.registerobserver(loginwatch);

        this.registerobserver = function (cb) {
            obs.push(cb);

        }
        function notify() {
            for (var i = 0; i < obs.length; i++) {
                obs[i]();
            }
        }
        this.addItem = function (idx1, rest, custid, it1, qty1) {

            if (restaurant.rest_id != undefined && rest.rest_id != restaurant.rest_id) {
                alert("items from previous restaurant will be cleared");
                restaurant = rest;

                items = {};
                this.clearCart(custid).then(function (response) {
                    console.log(response);

                    if (response == "success"){
                        vm.itemCount = 0;
                        notify();
                        addtocart(it1, custid, qty1);
                    }
                        
                }, function (error) {
                    alert("server error,cart clear" + error)
                })
            }
            else if (restaurant.rest_id == undefined) {
                restaurant = rest;
                items = {};
                addtocart(it1, custid, qty1);
            }
            else {
                addtocart(it1, custid, qty1);

            }

            //console.log(items);
        }

        function addtocart(it1, custid, qty1) {
            $http({
                method: 'POST',
                url: strurl + 'cart/add',
                data: { "product_id": it1.item_id, "cust_id": custid, "quantity": qty1 }
            })
                .then(vm.addReponse,
                    function (error) {
                        alert(error);
                    }
                )
        }

        this.addReponse = function (response) {

            if (response.status == '200') {
                //console.log(items[idx])

                if (items[it.item_id]) {
                    items[it.item_id].quantity += qty;
                }
                else {
                    items[it.item_id] = { item: it, quantity: qty };
                    vm.itemCount += 1;

                    notify();
                }



            }
            else {
                alert("could not add item to cart");
            }

        }




        this.clearCart = function (id) {
            return $http({
                method: 'DELETE',
                url: strurl + "cart/" + id,

            })
                .then(function (response) {
                   
                    return response.data;

                }, function (error) {
                    //alert("server error" + error);
                    console.log("server error"+error);
                    return false;
                });
        }

        this.getCartItems = function () {
            return items;
        }


        this.removeItem = function (cust_id, product_id) {
            console.log(product_id);
            console.log(Object.keys(items));
            if (items[product_id]) {
                $http({
                    method: 'POST',
                    url: strurl + "cart/delete",
                    data: { "cust_id": cust_id, "product_id": product_id }
                })
                    .then(
                        function (response) {
                            if (response.status == "200") {
                                delete items[idx];
                                vm.itemCount -= 1;
                                notify();
                                if (items.length == 0) {
                                    restaurant = {};
                                }
                            }

                        },
                        function (error) {
                            alert(error);

                        }
                    )
                //console.log(items);
            }
        }

        

        this.getItems = function (id) {

            return $http.get(strurl + 'cart/' + id).then(function (response) {
                if (response.status == '200') {
                    restaurant = response.data.restaurant;

                    cartitems = response.data.items;
                    for (var i = 0; i < cartitems.length; i++) {
                        items[cartitems[i].item.item_id] = { item: cartitems[i].item, quantity: cartitems[i].quantity };
                    }
                    vm.itemCount = Object.keys(items).length;

                    notify();
                    return items;
                }
                else {

                    return false;
                }
            }, function (error) {
                alert(error);
                return false;
            })


        }

        this.getRestaurant = function () {
            return restaurant;
        }
    }])
    .service('orderservice', ['$http', function ($http) {
        this.id = 0;
        var strurl = "http://127.0.0.1:5001/"
        var orders = [{
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date": "12-12-2018",
            "time": "19:00",
            "orderItems": [{
                "id": "ORIT1",
                "itemId": "ITEM12",
                "qtyOrdered": 4,
                "items": [{
                    "id": "ITEM12",
                    "restId": "REST1234",
                    "name": "Item1",
                    "image": "images1.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "price": 100,
                    "availability": 10,
                    "rating": 4
                }]
            }, {
                "id": "ORIT2",
                "itemId": "ITEM13",
                "qtyOrdered": 5,
                "items": [{
                    "id": "ITEM124",
                    "restId": "REST1234",
                    "name": "Item 3",
                    "image": "images3.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "price": 120,
                    "availability": 8,
                    "rating": 5
                }]
            }]
        }, {
            "id": "ORDR2",
            "status": "Ordered",
            "userId": "USER1234",
            "date": "12-12-2018",
            "time": "19:00",
            "totalAmount": 500,
            "orderItems": [{
                "id": "OR2T1",
                "itemId": "ITEM12",
                "qtyOrdered": 2,
                "items": [{
                    "id": "ITEM12",
                    "restId": "REST1234",
                    "name": "Item1",
                    "image": "images1.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "price": 100,
                    "availability": 10,
                    "rating": 4
                }]
            }, {
                "id": "OR2T2",
                "itemId": "ITEM125",
                "qtyOrdered": 2,
                "items": [{
                    "id": "ITEM125",
                    "restId": "REST1234",
                    "name": "Item4",
                    "image": "images4.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "price": 150,
                    "availability": 7,
                    "rating": 2
                }]
            }]
        }
        ];

        this.getRestaurantOrders = function (id, offset, limit) {
            if (!id) {
                return false;
            }

            return $http.get(strurl + "orders/restaurant/" + id)
                .then(
                    function (response) {
                        if (response.status == '200') {
                            console.log(response);
                            return response.data;
                        }
                        else {
                            return false;
                        }
                    },
                    function (error) {
                        return false;
                    });

            //return {"count":orders.length,"orders":orders.slice(offset,offset+limit)};
        }

        this.getCustomerOrders = function (id, offset, limit) {

            return $http.get(strurl + "orders/customer/" + id)
                .then(
                    function (response) {
                        if (response.status == '200') {
                            console.log(response);
                            return response.data;
                        }
                        else {
                            return false;
                        }
                    },
                    function (error) {
                        return false;
                    });

        }

        this.placeOrder = function (custid, restid, cart) {
            cartitems = [];
            angular.forEach(cart, function (value, key) {
                cartitems.push({ item_id: key, quantity: value.quantity });
            })
            return $http({
                method: 'POST',
                url: strurl + 'order',
                data: { 'custId': custid, 'restId': restid, 'items': cartitems }
            }).then(
                function (response) {
                    console.log(response);
                    if (response.status == '200') {
                        return response.data;
                    }
                    else {

                        return false;
                    }
                },
                function (error) {
                    console.log("error");
                    return false;
                })

        }

        this.changeStatus = function (orderid, stat) {
            return $http({
                method: 'PUT',
                url: strurl + 'order/'+orderid,
                data: {status: stat }
            }).then(function (response) {
                if(response.status == '200')
                return response.data;
                else{
                    return false;
                }

            }, function (error) {
                alert(error);
            })
        }


        // var obs=[];

        // this.registerobserver = function(cb,rest_id){
        //     obs.push(cb);
        //     this.id = rest_id;
        //     $in
        // }

        // var errorcount=0;

        // function checkChange(){
        //     $http.get(strurl+'orders/restaurant/count')
        //     .then(function(response){

        //     },
        //     function(error){

        //     })
        // }

    }])
