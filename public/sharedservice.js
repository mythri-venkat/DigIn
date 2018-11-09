angular.module('app')
    .service('shared', ['$cookies', '$http', function ($cookies, $http) {
        var strurl = "http://127.0.0.1:5001/"
        let _loggedin = false;
        var obs = [];
        this.user={};
        this.isloggedIn=function() {
            var usr = $cookies.getObject('usr');
            this.user=usr;
            if (usr) {
                _loggedin = true;

            }
            else {
                _loggedin = false;

            }
            return _loggedin;
        };
        this.login=function(usr) {
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
                        return [];
                    }
                },
                function (error) {
                    return [];
                })

        };

        this.getUser = function(){
            var usr = $cookies.getObject('usr');
            this.user = usr;
            return usr;
        }

        this.register =function(usr) {

        }

        this.logout=function(usr) {
            $cookies.remove('usr');
            _loggedin = false;
            notify();

        }
        this.registerobserver=function(cb) {
            obs.push(cb);
        };
        function notify() {
            angular.forEach(obs, function (cb) {
                cb();
            });
        };
       

    }])