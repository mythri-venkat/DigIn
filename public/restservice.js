angular.module('app')
    .service('restaurant', function ($http) {
        var rests = [
            {
                id: 1,
                name: 'rest1',
                img: "imgs/1.jpg",
                description: "awesome pizzas",
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
            return rests;
        }
        this.getRestaurant = function (id) {
            return rests[id - 1];
        }
    })
    .service('cart', function () {
        var items = {};
        var restaurant={};
        this.addItem = function (it, qty) {
            if (items[it.id]) {
                items[it.id].quantity+=qty;
            }
            else{
                items[it.id] = { item: it, quantity: qty };
            }
            console.log(items);
        }
        this.removeItem = function(idx){
            if(items[idx]){
                delete items[idx];
                console.log(items);
            }
        }
    })