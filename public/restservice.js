angular.module('app')
    .service('restaurant',['$http', function ($http) {
        var url = "http://127.0.0.1:5001/"
        var rests = [
            {
                id: 1,
                name: 'rest1',
                img: "imgs/1.jpg",
                address:"wsvwe,wefc,wedf,wewevweddc.",
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
                address:"wsvwe,wefc,wedf,wewevweddc.",
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
        this.getAll = function () {
            return $http.get(url+"restaurants").then(function(response){
                rests=response.data;
                return rests;
            },function(error){
                console.log(error);
                return [];
            });
            
        }
        this.getRestaurant = function (id) {
            
            return rests[id];
        }
    }])
    .service('cart', function () {
        var items = {};
        var restaurant = {};
        this.addItem = function (it, qty) {
            if (items[it.id]) {
                items[it.id].quantity += qty;
            }
            else {
                items[it.id] = { item: it, quantity: qty };
            }
            console.log(items);
        }
        this.removeItem = function (idx) {
            if (items[idx]) {
                delete items[idx];
                console.log(items);
            }
        }
    })
    .service('orderservice', ['$http', function ($http) {
        this.id=0;
        var strurl = "http://127.0.0.1:5001/"
        var orders = [{
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        },
        {
            "id": "ORDR1",
            "status": "Paid",
            "userId": "USER1234",
            "totalAmount": 1000,
            "date":"12-12-2018",
            "time":"19:00",
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
        }
    ];

        this.getRestaurantOrders = function (id,offset,limit) {
            
            return $http.get(strurl + "orders/restaurant/" + id)
                .then(
                    function (response) {
                        if(response.status == '200'){
                            console.log(response);
                            return response.data;
                        }
                        else{
                            return false;
                        }                     
                    },
                    function (error) {
                        return false;
                    });

            //return {"count":orders.length,"orders":orders.slice(offset,offset+limit)};
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