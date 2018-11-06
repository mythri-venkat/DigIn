angular.module('app')
    .service('shared', function ($http) {
        var _loggedin = false;
        var obs = []
        function isloggedIn() {
            return _loggedin;
        };
        function login (usr) {
            _loggedin = true;
            this.notify();
        };
        function logout (usr) {
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

    })