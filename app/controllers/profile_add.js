var app = angular.module('App').controller('ProfileAddController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services, $routeParams) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    $rootScope.pagetitle = 'Add New Profile';
    
    self.loading = true;
    self.add = $routeParams.add;
    self.permission = [];
    // thisForm.username.$setValidity('validationError', false);

    self.toggle = function(item,list){
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
      self.permission = list;
    }

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    services.getAllPages().then(function(data){
      self.pages = data.data;
    });

    self.submit = function (user) {
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      self.loader = true;
      user.permission = self.permission.join() +',';
      services.insertUser(user).then(function (resp) {
        self.afterSubmit(resp);
      });
    };

    self.afterSubmit = function (resp) {
      if (resp.data.status == 'success') {
        $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.data.msg).position('bottom right'))
          .then(function () {
            $mdDialog.hide();
            window.location.reload();
          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.data.msg).position('bottom right'))
      }
    };
  });