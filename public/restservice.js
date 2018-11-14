angular.module('app')
    .service('restaurant', ['$http', function ($http) {
        var strurl = "http://127.0.0.1:5001/";

        this.additem=function(custid,newitem){
            return $http({
                url:strurl+'menu/'+custid,
                method:'POST',
                data:newitem
            }).then(function(response){
                if(response.status =='200'){
                    
                    return response.data;
                }
                else{
                    alert("could not be added");
                    return false;
                }
       
            },function(error){
                alert(error);
            })
        }
       
        this.edititem=function(item_id,newitem){
            return $http({
                url:strurl+'menu/edit/'+item_id,
                method:'POST',
                data:newitem
            }).then(function(response){
                if(response.status =='200'){
                    return response.data;
                }
                else{
                    alert("could not be edited");
                    return false;
                }
       
            },function(error){
                alert(error);
            })
        }

        this.removeitem = function(item_id){
            return $http({
                url:strurl+'menu/'+item_id,
                method:'DELETE',
            }).then(function(response){
                if(response.status =='200'){
                    return response.data;
                }
                else{
                    alert("could not be edited");
                    return false;
                }
                
            },function(error){
                alert(error);
            })
        }
        
        this.editprofile = function(restid,custid,rest){
            console.log(rest);
            return $http({
                method:'POST',
                url: strurl + 'restaurant/edit/'+custid+"/"+restid,
                data:rest
            }).then(function(response){
                if(response.status =='200'){
                    return true;
                }
                else{
                    return false;
                }
            },function(error){
                return false;

            })
        };

        this.getAll = function (offset, limit) {
            return $http.get(strurl + 'restaurants').then(function (response) {
                if (response.status == '200') {
                    if (response.data.restaurants)
                        rests = response.data.restaurants;
                    cnt = 20
                    if (response.data.count)
                        cnt = response.data.count

                    
                    return { count: cnt, 'restaurants': rests.splice(offset, offset + limit) };
                    
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
            console.log(strurl + "restaurants/" + name)
            return $http.get(strurl + "restaurants/" + name).then(function (response) {
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

            return $http.get(strurl+'restaurant/'+id).then(
                function(response){
                    if(response.status == '200'){
                        return response.data;
                    }
                    else{
                        return false;
                    }
                },
                function(error){
                    console.log("error from server");
                    return false;
                }
            )
        }
    }])
    .service('cart', ['$http', 'shared', function ($http, shared) {
        var items = {};
        var vm = this;

        var restaurant = {};
        this.itemCount = 0;
        var strurl = "http://127.0.0.1:5001/"
        var obs = [];
        var it;
        var qty;
        var loginwatch = function () {
            if (shared.isloggedIn() && shared.getUser().role == 'customer') {
                vm.getItems(shared.getUser().id).then(function (response) {
                    console.log("items loaded");
                })
            }
            else {
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
            it = it1;
            qty = qty1;
            if (restaurant.rest_id != undefined && rest.rest_id != restaurant.rest_id) {
                alert("items from previous restaurant will be cleared");
                restaurant = rest;

                items = {};
                this.clearCart(custid).then(function (response) {
                    console.log(response);

                    if (response == "success") {

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
                    if (response.data == "success") {
                        items = {};
                        vm.itemCount = 0;
                        notify();
                    }
                    else {
                        return false;
                    }
                    return response.data;

                }, function (error) {
                    //alert("server error" + error);
                    console.log("server error" + error);
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
                                delete items[product_id];
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
                //alert(error);
                return false;
            })


        }

        this.getRestaurant = function () {
            return restaurant;
        }
    }])
    .service('orderservice', ['$http','shared', function ($http,shared) {
        this.id = 0;
        var strurl = "http://127.0.0.1:5001/"

        this.orders;
        var vm = this;

        this.revenue = function(){
        
            var revenue =0;
            if(vm.orders && vm.orders.length > 0){
                for(var i=0;i<vm.orders.length;i++){
                    if(vm.orders[i].orderstatus == '3')
                    revenue+=vm.orders[i].total_amount;
                }
            }
            else{
                vm.getRestaurantOrders(shared.getUser().id,shared.getUser().rest_id,0,10);
            }
            return revenue;
        }

        var obs=[];
        this.registerwatchrevenue = function(cb){
            obs.push(cb);
        }

        function notifyrevenue(){
            for(var i=0;i<obs.length;i++){
                obs[i]();
            }
        }

        this.getRestaurantOrders = function (uid,id, offset, limit) {

            
            return $http.get(strurl + "orders/restaurant/"+uid+"/"+ id)
                .then(
                    function (response) {
                        if (response.status == '200') {
                            console.log(response);
                            if (response.data.orderItems)
                            vm.orders = response.data.orderItems;
                            cnt = 20
                            if (response.data.count)
                                cnt = response.data.count

                            notifyrevenue();
                            return { count: cnt, 'orders': vm.orders.splice(offset, offset + limit) };
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
                            if (response.data.orderItems)
                            vm.orders = response.data.orderItems;
                            cnt = 20
                            if (response.data.count)
                                cnt = response.data.count


                            return { count: cnt, 'orders': vm.orders.splice(offset, offset + limit) };
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
            console.log({ 'custId': custid, 'restId': restid, 'items': cartitems });
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

        this.changeStatus = function (orderid, stat,cust_id) {
            return $http({
                method: 'POST',
                url: strurl + 'orders/' + orderid,
                data: { orderStatus: stat,custId:cust_id}
            }).then(function (response) {
                if (response.status == '200')
                {
                    for(var i=0;i<vm.orders.length;i++){
                        if(vm.orders[i].order_id == orderid){
                            vm.orders[i].orderstatus = stat;
                            
                        }
                    }
                    notifyrevenue();
                    return response.data;

                }
                    
                else {
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
