app.factory('productServices', ['$http', 'ngAuthSettings', productServices]);

function productServices($http, ngAuthSettings){
	
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
				$http({
					method: 'POST',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product",
					data: this.data
				}).then(function (response) {
					this.isCreatingOrUpdating = false;
				}, function (error) {
					this.isCreatingOrUpdating = false;
				})
			},
			loadProduct: function (id) {
				this.isLoading = true;
				$http({
					method: 'GET',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product/" + id,
					data: this.data
				}).then(function (response) {
					this.isLoading = false;
				}, function (error) {
					this.isCreatingOrUpdating = false;
				})
			},
			update: function () {
				this.isCreatingOrUpdating = true;
				$http({
					method: 'PUT',
					url: ngAuthSettings.apiServiceBaseUri + "api/Product",
					data: this.data
				}).then(function (response) {
					this.isCreatingOrUpdating = false;
				}, function (error) {
					this.isCreatingOrUpdating = false;
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

	return {
		getProduct: getProduct
	}
}
