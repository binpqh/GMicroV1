package repository

// var ErrorProductNotFound = errors.New(`Product not found.`)

// type ProductRepository interface {
// 	IsExist(ctx context.Context, productId int64) (bool, error)
// 	Count(ctx context.Context) (int64, error)
// 	CountInactive(ctx context.Context) (int64, error)
// 	CountDeleted(ctx context.Context) (int64, error)
// 	GetPaginate(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error)
// 	GetPaginateInactive(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error)
// 	GetPaginateDeleted(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error)
// 	GetById(ctx context.Context, productId int64) (*domain.Product, error)
// 	GetByProductCode(ctx context.Context, code string) (*domain.Product, error)
// 	GetByItemCode(ctx context.Context, itemCode string) (*domain.Product, error)
// 	GetItemsByProductCode(ctx context.Context, productCode string) ([]domain.ProductItem, error)
// 	// GetActiveById(ctx context.Context, productId int64) (*Product, error)
// 	// GetActiveByProductCode(ctx context.Context, code string) (*Product, error)
// 	// GetActiveByItemCode(ctx context.Context, itemCode string) (*Product, error)
// 	// GetActiveItemsByProductCode(ctx context.Context, productCode string) ([]ProductItem, error)
// 	UpdateProduct(ctx context.Context, product *domain.Product) error
// 	UpdateItem(ctx context.Context, itemId string, item *domain.ProductItem) error
// 	UpdateItemProperty(ctx context.Context, productCode string, itemCode string, property *domain.Property) error
// 	DeleteProduct(ctx context.Context, productId int64) error
// }
