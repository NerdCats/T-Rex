var app = angular.module('invoiceApp', ['ngRoute']);
app.controller('invoiceCtrl',['$scope', '$http', '$window', invoiceCtrl]);

function invoiceCtrl($scope, $http, $window) {
    var vm = $scope;
    vm.loadingJob = true;
    var jobId = $window.location.search.substring(1).split(",");
    vm.today = new Date();
    // vm.job = {};
    vm.jobs= [];

    angular.forEach(jobId, function (value, key) {
        console.log(key + " : " + value) 
        var prod = "http://fetchprod.gobd.co/api/job/";
        // var dev = "http://taskcatdev.azurewebsites.net/api/job/";
        var url =  prod + value;

        $http({
            method: 'GET',
            url: url,
        }).then(function success(response){
            vm.loadingJob = false;
            var job = response.data;            
            if (job.User.UserName === "B2C") {
                if (job.Order.OrderCart.SubTotal === 0) {
                    job.Order.OrderCart.SubTotal = "";
                    job.Order.OrderCart.TotalToPay = "";
                }

                for (var i = job.Order.OrderCart.PackageList.length - 1; i >= 0; i--) {
                    if (job.Order.OrderCart.PackageList[i].Price === 0) {
                        job.Order.OrderCart.PackageList[i].Price = "";
                        job.Order.OrderCart.TotalToPay = "";                                                    
                    }
                    if (job.Order.OrderCart.PackageList[i].Weight === 0) {
                        job.Order.OrderCart.PackageList[i].Weight = "";
                    }
                    if (job.Order.OrderCart.PackageList[i].Total === 0) {
                        job.Order.OrderCart.PackageList[i].Total = "";
                    }
                    
                }
            }
            vm.jobs.push(job);
            console.log(job);            
        }, function error(error) {
            alert(error.Message)
        })      
    })

    
};