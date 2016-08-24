'use strict';
app.controller('usercreateC', ['$scope', 'userService', usercreateC]);

function usercreateC($scope,userService) {

  var vm = this;

  vm.gender = ["MALE", "FEMALE"];
  vm.type = ["USER", "CNG_DRIVER", "BIKE_MESSENGER", "ENTERPRISE"];

    vm.isAsset = false;
    vm.isEnterpriseUser = false;

    vm.asset = {
      UserName : "",
      Password : "",
      ConfirmPassword : "",
      Email : "",
      PhoneNumber : "",
        PicUri : "",
      Type : "",
        FirstName : "",
        LastName : "",
        Age : "",
        Gender : "",
        Address : "",      
      NationalId : "",
      DrivingLicenceId : "",
        ContactPersonName : "",
        Website : ""
    };

    vm.UserTypeChanged = function (type) {
        if (type == "BIKE_MESSENGER" || type == "CNG_DRIVER") {
            vm.isAsset = true;
            vm.isEnterpriseUser = false;
        } else if (type == "ENTERPRISE") {
            vm.isAsset = false;
            vm.isEnterpriseUser = true;
        }
        console.log(type)
    }
    
    vm.RegisterNewAsset = function () {
      userService.registerNewUser(vm.asset);
    } 
    
}