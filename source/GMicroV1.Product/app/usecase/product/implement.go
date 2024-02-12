package product

import (
	"GMicroV1/Product/domain"
	"context"
	"time"
)

func GetProductUseCaseInstance(productRepository domain.ProductRepository, timeout time.Duration) UseCase {
	return &useCase{productRepository, timeout}
}

type useCase struct {
	productRepo    domain.ProductRepository
	contextTimeout time.Duration
	// categoryRepo domain.CategoryRepository
}

// GetById implements UseCase.
func (puc *useCase) GetById(ctx context.Context, productId int64) (*domain.Product, error) {
	product, err := puc.productRepo.GetById(ctx, productId)
	if err != nil {
		return nil, err
	}
	return product, nil
}

// GetByItemCode implements UseCase.
func (puc *useCase) GetByItemCode(ctx context.Context, itemCode string) (*domain.Product, error) {
	product, err := puc.productRepo.GetByItemCode(ctx, itemCode)
	if err != nil {
		return nil, err
	}
	return product, nil
}

// GetByProductCode implements UseCase.
func (puc *useCase) GetByProductCode(ctx context.Context, productCode string) (*domain.Product, error) {
	product, err := puc.productRepo.GetByProductCode(ctx, productCode)
	if err != nil {
		return nil, err
	}
	return product, nil
}

// GetItemsByProductCode implements UseCase.
func (puc *useCase) GetItemsByProductCode(ctx context.Context, productCode string) ([]domain.ProductItem, error) {
	productItems, err := puc.productRepo.GetItemsByProductCode(ctx, productCode)
	if err != nil {
		return nil, err
	}
	return productItems, nil
}

// GetPaginate implements UseCase.
func (puc *useCase) GetPaginate(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error) {
	productItems, totalCount, totalPages, err := puc.productRepo.GetPaginate(ctx, size, page)
	if err != nil {
		return nil, 0, 0, err
	}
	return productItems, totalCount, totalPages, nil
}

// GetPaginateDeleted implements UseCase.
func (puc *useCase) GetPaginateDeleted(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error) {
	productItems, totalCount, totalPages, err := puc.productRepo.GetPaginateDeleted(ctx, size, page)
	if err != nil {
		return nil, 0, 0, err
	}
	return productItems, totalCount, totalPages, nil
}

// GetPaginateInactive implements UseCase.
func (puc *useCase) GetPaginateInactive(ctx context.Context, size int64, page int64) ([]domain.Product, int64, int64, error) {
	productItems, totalCount, totalPages, err := puc.productRepo.GetPaginateInactive(ctx, size, page)
	if err != nil {
		return nil, 0, 0, err
	}
	return productItems, totalCount, totalPages, nil
}

// GetProductsByCategory implements UseCase.
func (puc *useCase) GetProductsByCategory(ctx context.Context, categoryId int64) ([]domain.Product, error) {
	products, err := puc.productRepo.GetAllProducts(ctx)
	if err != nil {
		return nil, err
	}
	productsInCategory := filterProduct(products, func(p domain.Product) bool {
		if p.CategoryId != nil {
			return *p.CategoryId == categoryId
		}
		return false
	})
	return productsInCategory, nil
}

// GetProductsBySubCategory implements UseCase.
func (puc *useCase) GetProductsBySubCategory(ctx context.Context, subCategoryId int64) ([]domain.Product, error) {
	products, err := puc.productRepo.GetAllProducts(ctx)
	if err != nil {
		return nil, err
	}
	productsInCategory := filterProduct(products, func(p domain.Product) bool {
		if p.CategoryId != nil {
			return *p.SubCategoryId == subCategoryId
		}
		return false
	})
	return productsInCategory, nil
}

// ActiveProduct implements UseCase.
func (puc *useCase) ActiveProduct(ctx context.Context, productId int64) error {
	product, err := puc.productRepo.GetById(ctx, productId)
	if err != nil {
		return err
	}

	product.IsActive = true

	if err := puc.productRepo.UpdateProduct(ctx, product); err != nil {
		return err
	}

	return nil
}

// InactiveProduct implements UseCase.
func (puc *useCase) InactiveProduct(ctx context.Context, productId int64) error {
	product, err := puc.productRepo.GetById(ctx, productId)
	if err != nil {
		return err
	}

	product.IsActive = false

	if err := puc.productRepo.UpdateProduct(ctx, product); err != nil {
		return err
	}

	return nil
}

// RemoveProductOutOfDatabase implements UseCase.
func (puc *useCase) RemoveProductOutOfDatabase(ctx context.Context, ids []int64) error {
	for i := 0; i < len(ids); i++ {
		err := puc.productRepo.DeleteProduct(ctx, ids[i])
		if err != nil {
			return err
		}
	}
	return nil
}

// SoftDeleteProduct implements UseCase.
func (puc *useCase) SoftDeleteProduct(ctx context.Context, productId int64) error {
	product, err := puc.productRepo.GetById(ctx, productId)
	if err != nil {
		return err
	}

	product.IsActive = false
	product.IsDeleted = true
	if err := puc.productRepo.UpdateProduct(ctx, product); err != nil {
		return err
	}

	return nil
}

func filterProduct(people []domain.Product, condition func(domain.Product) bool) []domain.Product {
	var result []domain.Product
	for _, p := range people {
		if condition(p) {
			result = append(result, p)
		}
	}
	return result
}
