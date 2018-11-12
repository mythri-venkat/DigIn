angular.module('app')
    .service('restaurant', ['$http', function ($http) {
        var url = "http://127.0.0.1:5001/"
        var rests = [
            {
                id: 1,
                name: 'rest1',
                img: "imgs/1.jpg",
                address: "wsvwe,wefc,wedf,wewevweddc.",
                description: "awesome pizzas",
                tags: "askj asjjk aslkl adcadc",
                "timing-start": "9:00 AM",
                "timing-end": "9:00 PM",
                items: [{
                    "id": "ITEM12",
                    "restId": "REST1234",
                    "name": "Item1",
                    "image": "imgs/3.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "cost": 100,
                    "availability": 10
                }, {
                    "id": "ITEM123",
                    "restId": "REST1234",
                    "name": "Item2",
                    "image": "imgs/4.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "cost": 190,
                    "availability": 5
                },
                {
                    "id": "ITEM124",
                    "restId": "REST1234",
                    "name": "Item 3",
                    "image": "imgs/11.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "cost": 120,
                    "availability": 8
                },
                {
                    "id": "ITEM125",
                    "restId": "REST1234",
                    "name": "Item4",
                    "image": "imgs/12.jpg",
                    "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                    "cost": 150,
                    "availability": 7
                }]
            },
            {
                id: 2,
                name: 'rest2',
                img: "imgs/2.jpg",
                address: "wsvwe,wefc,wedf,wewevweddc.",
                tags: "askj asjjk aslkl adcadc",
                "timing-start": "9:00 AM",
                "timing-end": "9:00 PM",
                description: "mouth watering burgers",
                items: [
                    {
                        "id": "ITEM124",
                        "restId": "REST1234",
                        "name": "Item 3",
                        "image": "imgs/11.jpg",
                        "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                        "cost": 120,
                        "availability": 8
                    },
                    {
                        "id": "ITEM125",
                        "restId": "REST1234",
                        "name": "Item4",
                        "image": "imgs/12.jpg",
                        "description": "sckn dlkcm a;cm;a, ;oo dcjn dwsc",
                        "cost": 150,
                        "availability": 7
                    }
                ]
            }
        ];
        this.getAll = function (offset, limit) {
            return $http.get(url+'restaurants').then(function (response) {
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
                console.log(error);
                return false;
            });

        }

        this.getRestaurant = function (id) {

            return rests[id];
        }
    }])
    .service('cart',['$http', function ($http) {
        var items = {};
        var restaurant = {};
        var strurl = "http://127.0.0.1:5001/"
        this.addItem = function (idx,rest, custid, it, qty) {
            // console.log(restaurant)
            // console.log(rest)
            if (restaurant.id != undefined && rest.id != restaurant.id) {
                alert("items from previous restaurant will be cleared");
                restaurant = rest;
                items = [];
                for(var i=0;i<rest.items.length;i++){
                    items.push({});
                }
            }
            if (restaurant.id == undefined) {
                restaurant = rest;
                items = [];
                for(var i=0;i<rest.items.length;i++){
                    items.push({});
                }
            }


            $http({
                method: 'POST',
                url: strurl + 'cart/add',
                data: { "product_id": it.id, "cust_id": custid, "quantity": qty }
            })
                .then(
                    function (response) {
                        if (response.status == '200') {
                            if (items[idx]) {
                                items[idx].quantity += qty;
                            }
                            else {
                                items[idx] = { item: it, quantity: qty };
                            }
                        }
                        else {
                            alert("could not add item to cart");
                        }
                    },
                    function (error) {
                        alert(error);
                    }
                )
            //console.log(items);
        }
        this.removeItem = function (idx,cust_id,product_id) {

            if (items[idx]) {
                $http({
                    method: 'POST',
                    url: strurl + "cart/delete",
                    data:{"cust_id":cust_id,"product_id":product_id}
                })
                    .then(
                        function (response) {
                            if (response.status == "200") {
                                items.splice(idx,1)
                                if (items.length==0) {
                                    restaurant = {};
                                }
                            }

                        },
                        function (error) {

                        }
                    )
                //console.log(items);
            }
        }
        this.getItems = function () {

            return $http.get(strurl + 'cart').then(function (response) {
                if (response.status == '200') {
                    items = response.data;
                    return response.data;
                }
                else {
                   
                    return false;
                }
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

        this.placeOrder = function (custid, restid, cartitems) {
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
