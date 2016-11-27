var app = angular.module('invoiceApp', ['ngRoute']);
app.controller('invoiceCtrl',['$scope', '$http', '$window', invoiceCtrl]);

function invoiceCtrl($scope, $http, $window) {
    var vm = $scope;    
    vm.jobId = $window.location.search.substring(1).split(",");
    vm.today = new Date();
    vm.loadingJob = true;
    vm.jobs= [];

    vm.totalNumberOfJobs = vm.jobId.length;
    vm.totalLoadedJobs = vm.jobs.length;
    vm.failedToLoadJobs = [];
    vm.failedToLoadJobFlag = false;

    vm.checkifAllCallsAreFinished = function () {
        if (vm.totalNumberOfJobs === (vm.totalLoadedJobs + vm.failedToLoadJobs.length)) {
            vm.loadingJob = false;                
        }
    }

    angular.forEach(vm.jobId, function (value, key) {
        console.log(key + " : " + value)         
        var url =  "http://fetchprod.gobd.co/api/job/" + value;        
        // var url =  "http://taskcatdev.azurewebsites.net/api/job/" + value;
        vm.loadingJob = true;
        $http({
            method: 'GET',
            url: url,
        }).then(function success(response){
            var job = response.data;
            console.log(response)
            vm.totalLoadedJobs += 1;
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
            vm.checkifAllCallsAreFinished();
        }, function error(error) {
            vm.failedToLoadJobFlag = true;
            vm.failedToLoadJobs.push(value);
            console.log(vm.failedToLoadJobs);
            vm.checkifAllCallsAreFinished();
        })      
    })
};