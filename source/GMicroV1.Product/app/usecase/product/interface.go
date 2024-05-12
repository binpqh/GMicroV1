package product

import (
	"GMicroV1/Product/domain"
	"context"
)

type UseCase interface {
	GetPaginate(ctx context.Context, size int64, page int64) ([]domain.ProductResponse, int64, int64, error)
	GetProductsByCategory(ctx context.Context, categoryId int64) ([]domain.Product, error)
	GetProductsBySubCategory(ctx context.Context, subCategoryId int64) ([]domain.Product, error)
	GetPaginateInactive(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error)
	GetPaginateDeleted(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error)
	GetById(ctx context.Context, productId int64) (*domain.Product, error)
	GetByProductCode(ctx context.Context, productCode string) (*domain.Product, error)
	GetByItemCode(ctx context.Context, itemCode string) (*domain.Product, error)
	GetItemsByProductCode(ctx context.Context, productCode string) ([]domain.ProductItem, error)
	ActiveProduct(ctx context.Context, productId int64) error
	InactiveProduct(ctx context.Context, productId int64) error
	SoftDeleteProduct(ctx context.Context, productId int64) error
	RemoveProductOutOfDatabase(ctx context.Context, ids []int64) error
}
