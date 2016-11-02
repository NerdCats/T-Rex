app.factory('productServices', ['$http', '$window', 'ngAuthSettings', productServices]);

function  productServices($http, $window, ngAuthSettings){
	
	var getProduct = function () {
		
		var product = {
			data: {
				Name: null,
				ShortDescription: null,
				FullDescription: null,
				StoreId: null,
				IsFeatured: true,
				Tags: [],
				OrderMinimumQuantity: 0,
				OrderMaximumQuantity: 0,
				NotReturnable: true,
				IsDisabled: true,
				AvailableForPreOrder: true,
				Price: 0,
				OldPrice: 0,
				SpecialPrice: 0,
				SpecialPriceStartDateTimeUtc: null,
				SpecialPriceEndDateTimeUtc: null,
				IsMarkedAsNew: true,
				MarkAsNewStartDateTimeUtc: null,
				MarkAsNewEndDateTimeUtc: null,
				Weight: 0,
				Length: 0,
				Width: 0,
				Height: 0,
				AvailableStartDateTimeUtc: null,
				AvailableEndDateTimeUtc: null,
				DisplayOrder: 0,
				IsPublished: true,
				IsDeleted: true,
				CreateTime: null,
				ModifiedTime: null,
				PicUrl: null,
				Categories: [
				],
				Id: null
			},
			updateMode: false,
			isLoading: false,
			isCreatingOrUpdating: false,
			create: function () {
				this.isCreatingOrUpdating = true;
				var self = this;
				$http({
					method: 'POST',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product",
					data: this.data
				}).then(function (response) {
					self.isCreatingOrUpdating = false;
					$window.history.back();
				}, function (error) {
					self.isCreatingOrUpdating = false;
				})
			},
			loadProduct: function (id) {
				this.isLoading = true;
				var self = this;
				$http({
					method: 'GET',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product/" + id,					
				}).then(function (response) {
					self.isLoading = false;
					self.data = response.data;
				}, function (error) {
					self.isCreatingOrUpdating = false;
				})
			},
			update: function () {
				this.isCreatingOrUpdating = true;
				var self = this;
				$http({
					method: 'PUT',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product",
					data: this.data
				}).then(function (response) {
					self.isCreatingOrUpdating = false;
					$window.history.back();
				}, function (error) {
					self.isCreatingOrUpdating = false;
				})
			},
			addCatagory: function (catagory) {
				this.data.Categories.push(catagory);
			},
			removeCategory: function (index) {				
				this.data.Categories.splice(index, 1);
			},
			addTag: function (tag) {
				this.data.Tags.push(tag);
				console.log(this.data.Tags)
			},
			removeTag: function (index) {
				this.data.Tags.splice(index, 1);
			}
		}
		return product;
	}

	var getProducts = function () {
		var products = {
			data: [],
			loadingState: null,
			loadProducts: function (storeid) {
				this.loadingState = 'IN_PROGRESS';
				var self = this;
				$http({
					method: 'GET',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product/odata?" + "$filter=StoreId eq '"+ storeid + "'"
				}).then(function (response) {
					self.loadingState = null;
					angular.forEach(response.data.data, function (value, index) {
						self.data.push(value);
					})
					console.log(self.data)
				}, function (error) {
					self.loadingState = null;
					console.log(error);
				})
			},
			removeProduct: function (Id) {
				this.loadingState = 'DELETING';
				var self = this;
				console.log(Id)
				$http({
					method: 'DELETE',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product/" + Id
				}).then(function (response) {
					self.loadingState = null;
					self.loadProduct();
				}, function (error) {
					self.loadingState = null;
					console.log(error);
				})
			}
		}
		return products;
	}

	return {
		getProduct: getProduct,
		getProducts: getProducts
	}
}
