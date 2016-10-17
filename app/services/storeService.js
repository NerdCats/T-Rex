app.factory('storeService', ['$http', 'ngAuthSettings', storeService]);

function storeService($http, ngAuthSettings) {
	

	var getStore = function storeService(userid){
		var stores = {
			getNewStore: function () {
				return {
					Name: null,
					Url: null,
					DisplayOrder: 0,
					EnterpriseUserId: userid,
					ProductCategories: [

					],
					CoverPicUrl: null			  
				}
			},
			userid: userid,
			singleStore: {},
			stores : [],		
			editingMode: false,
			loadingStores: false,
			errmsg: null,
			loadStores: function () {
				this.loadingStores = true;
				var self = this;
				var url = null;
				if (!this.userid) {
					url = ngAuthSettings.apiServiceBaseUri + "api/Store/odata";
				} else {
					//i dont think we will ever need pagination here
					url = ngAuthSettings.apiServiceBaseUri + "api/Store/odata?$filter=EnterpriseUserId eq '" + userid + "'";
				}
				$http({
					method: 'GET',
					url: url
				}).then(function (response) {
					self.loadingStores = false;
					self.stores = response.data.data;
					console.log(self.stores)
				}, function (error) {
					self.loadingStores = false;
					console.log(error);
				})
			},
			editModeOn: function (_store) {
				this.editingMode = true;
				this.singleStore = _store;
			},
			editStore: function () {
				var self = this;
				$http({
					method: 'PUT',
					url: ngAuthSettings.apiServiceBaseUri + "api/Store",
					data: self.singleStore
				}).then(function (response) {
					self.singleStore = self.getNewStore();
					self.editModeOn = false;
					self.loadStores();
				}, function (error) {
					self.errmsg = error.Message;
				})
			},
			clearEdit: function () {
				this.editingMode = false;			
			},
			deleteStore: function (_store) {
				var self = this;
				$http({
					method: 'DELETE',
					url: ngAuthSettings.apiServiceBaseUri + "api/Store/" + _store.Id,			
				}).then(function (response) {			
					self.loadStores();
				}, function (error) {
					self.errmsg = error.Message;
				})
			},
			 

			removeCategory: function (index) {
				this.singleStore.ProductCategories.splice(index, 1);
			},

			createStore: function () {
				var self = this;
				this.creatingStore = true;
				this.errmsg = null;
				$http({
					method: 'POST',
					url: ngAuthSettings.apiServiceBaseUri + "api/Store",
					data: self.singleStore
				}).then(function (response) {
					self.singleStore = self.getNewStore();
					self.creatingStore = false;
					self.loadStores();
				}, function (error) {
					self.errmsg = error.Message;
					self.creatingStore = false; 
				});
			}
		}
		return stores;
		
	}
	return {
			getStore: getStore
		}
}