angular.module('app')
    .service('shared',['$cookies', function ($cookies) {
        let _loggedin = false;
        var obs = []
        function isloggedIn() {
            var usr = $cookies.getObject('usr');

            if (usr) {
                _loggedin = true;
                
            }
            else {
                _loggedin = false;

            }
            return _loggedin;
        };
        function login (usr) {
            $cookies.putObject('usr',usr);
            _loggedin = true;
            this.notify();
        };
        function logout (usr) {
            $cookies.remove('usr');
            _loggedin = false;
            this.notify();

        }
        function registerobserver (cb) {
            obs.push(cb);
        };
        function notify () {
            angular.forEach(obs, function (cb) {
                cb();
            });
        };
        return{
            login:login,
            logout:logout,
            registerobserver:registerobserver,
            notify:notify,
            isloggedIn:isloggedIn

        }

    }])