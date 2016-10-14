app.factory('productServices', ['', productServices]);

function productServices(){
	
	var getProduct = function () {
		
		return {
			product: {
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
					{
					  Name: null,
					  Description: null,
					  CreateTime: null,
					  LastModified: null,
					  Id: null
					}
				],
				Id: null 
			}
		}
	}

	return {
		getProduct: getProduct
	}
}
