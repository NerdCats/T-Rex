var app = angular.module('invoiceApp', ['ngRoute']);
app.controller('invoiceCtrl',['$scope', '$http', '$window', invoiceCtrl]);

function invoiceCtrl($scope, $http, $window) {
    var vm = $scope;
    vm.loadingJob = true;
    var jobId = $window.location.search.substring(1);
    vm.today = new Date();
    vm.job = {};

    var prod = "http://fetchprod.gobd.co/api/job/";
    // var dev = "http://taskcatdev.azurewebsites.net/api/job/";
    var url =  prod + jobId;

    $http({
        method: 'GET',
        url: url,                
    }).then(function success(response){
        vm.loadingJob = false;
        vm.job = response.data;
        //// FIXME: unveil this piece of code when bulk order creation is done
        $( function() {
            $( "#dialog-confirm" ).dialog({
              resizable: false,
              height: "auto",
              width: 400,
              modal: true,
              buttons: {
                "Reciever Will Pay": function() {
                  $( this ).dialog( "close" );
                },
                "Vendor Will Pay": function() {
                    
                    if (vm.job.Order.OrderCart.TotalToPay !== "") {
                        vm.job.Order.OrderCart.TotalToPay -= vm.job.Order.OrderCart.ServiceCharge;                        
                    }
                    vm.job.Order.OrderCart.ServiceCharge = 0;
                    vm.$apply();
                    $( this ).dialog( "close" );
                }
              }
            });
        } );

        // FIXME: if user is B2C, then we might not know product price in advance
        // hence keeping a blank space on the invoice to write product price later
        // by hand
        if (vm.job.User.UserName === "B2C") {
            if (vm.job.Order.OrderCart.SubTotal === 0) {
                vm.job.Order.OrderCart.SubTotal = "";
                vm.job.Order.OrderCart.TotalToPay = "";
            }

            for (var i = vm.job.Order.OrderCart.PackageList.length - 1; i >= 0; i--) {
                if (vm.job.Order.OrderCart.PackageList[i].Price === 0) {
                    vm.job.Order.OrderCart.PackageList[i].Price = "";
                    vm.job.Order.OrderCart.TotalToPay = "";                                                    
                }
                if (vm.job.Order.OrderCart.PackageList[i].Weight === 0) {
                    vm.job.Order.OrderCart.PackageList[i].Weight = "";
                }
                if (vm.job.Order.OrderCart.PackageList[i].Total === 0) {
                    vm.job.Order.OrderCart.PackageList[i].Total = "";
                }
                
            }

        }        
    }, function error(error) {
        alert(error.Message)
    })
};