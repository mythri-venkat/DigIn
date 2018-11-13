angular.module('app')
    .service('shared', ['$cookies', '$http', function ($cookies, $http) {
        var strurl = "http://127.0.0.1:5001/"
        let _loggedin = false;
        var obs = [];
        this.user = {};
        this.isloggedIn = function () {
            var usr = $cookies.getObject('usr');
            this.user = usr;
            if (usr) {
                _loggedin = true;

            }
            else {
                _loggedin = false;

            }
            return _loggedin;
        };
        this.login = function (usr) {
            return $http({
                method: 'POST',
                url: strurl + 'login',
                data: usr
            }).then(
                function (response) {
                    console.log(response);
                    if (response.status == '200') {
                        this.user = response.data;
                        $cookies.putObject('usr', response.data);
                        _loggedin = true;
                        notify();
                        console.log(response);
                        return response.data;
                    }
                    else {
                        return false;
                    }
                },
                function (error) {
                    return false;
                })

        };

        this.getUser = function () {

            var usr = $cookies.getObject('usr');
            //console.log(usr);
            this.user = usr;
            return usr;
        }

        this.register = function (usr) {
            return $http({
                method: 'POST',
                url: strurl + 'register',
                data: usr
            }).then(
                function (response) {
                    return response;
                },
                function (error) {
                    return error;
                })

        }
        this.changepassword = function (id,pass) {
            
            return $http({
                method: 'POST',
                url: strurl + 'change/'+id,
                data: pass
            }).then(function (response) {
                if (response.status == '200') {
                    this.user = response.data;
                    $cookies.putObject('usr', response.data);
                    _loggedin = true;
                    notify();
                    return true;
                }
                else {
                    alert(response.data);
                    return false;
                }

            }, function (error) {
                alert("server error:" + error);
                console.log("server error:" + error);
                return false;
            })
        }

        this.logout = function (usr) {

            $cookies.remove('usr');
            _loggedin = false;
            notify();

        }
        this.registerobserver = function (cb) {
            obs.push(cb);
        };
        function notify() {
            angular.forEach(obs, function (cb) {
                cb();
            });
        };


    }])