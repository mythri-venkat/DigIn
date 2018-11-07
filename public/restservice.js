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