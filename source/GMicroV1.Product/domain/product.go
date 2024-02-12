package domain

import (
	"GMicroV1/Product/ulities"
	"context"
	"database/sql"
	"time"
)

// Entity's struct
type Product struct {
	ID              int64  `json:"id"`
	Code            string `json:"code" validate:"required"`
	Name            string `json:"name" validate:"required"`
	Image           string `json:"logo"`
	Items           []ProductItem
	CountryOfOrigin string
	SubCategoryType SubCategory //Id of category
	CategoryId      *int64
	SubCategoryId   *int64
	IsActive        bool
	IsDeleted       bool
	CreateAt        time.Time `json:"createAt"`
	UpdateAt        time.Time `json:"updateAt"`
	DeleteOn        time.Time `json:"deleteOn"`
}
type ProductItem struct {
	ID         string
	Code       string
	Name       string
	Image      string
	IsActive   bool
	Properties []Property
}
type Property struct {
	IsActive bool
	Image    string
	Color    *string
	Height   *float32
	Width    *float32
	Length   *float32
	Weight   *float32
	Price    float64
}

// Entity's interface
type ProductRepository interface {
	IsExist(ctx context.Context, productId int64) (bool, error)
	Count(ctx context.Context) (int64, error)
	CountInactive(ctx context.Context) (int64, error)
	CountDeleted(ctx context.Context) (int64, error)
	GetAllProducts(ctx context.Context) ([]Product, error)
	GetPaginate(ctx context.Context, size int64, page int64) ([]Product, int64, int64, error)
	GetPaginateInactive(ctx context.Context, size int64, page int64) ([]Product, int64, int64, error)
	GetPaginateDeleted(ctx context.Context, size int64, page int64) ([]Product, int64, int64, error)
	GetById(ctx context.Context, productId int64) (*Product, error)
	GetByProductCode(ctx context.Context, code string) (*Product, error)
	GetByItemCode(ctx context.Context, itemCode string) (*Product, error)
	GetItemsByProductCode(ctx context.Context, productCode string) ([]ProductItem, error)
	// GetActiveById(ctx context.Context, productId int64) (*Product, error)
	// GetActiveByProductCode(ctx context.Context, code string) (*Product, error)
	// GetActiveByItemCode(ctx context.Context, itemCode string) (*Product, error)
	// GetActiveItemsByProductCode(ctx context.Context, productCode string) ([]ProductItem, error)
	UpdateProduct(ctx context.Context, product *Product) error
	UpdateItem(ctx context.Context, itemId string, item *ProductItem) error
	UpdateItemProperty(ctx context.Context, productCode string, itemCode string, property *Property) error
	DeleteProduct(ctx context.Context, productId int64) error
}
type ProductImplementation struct {
	Conn *sql.DB
}

func GetInstanceProductRepository(conn *sql.DB) ProductRepository {
	return &ProductImplementation{conn}
}

// Entity's usecase
type ProductUsecase interface {
	GetProductsByCategory(ctx context.Context, categoryId int32) ([]Product, error)
	GetProductsBySubCategory(ctx context.Context, subCategoryId int32) ([]Product, error)
	ActiveProduct(ctx context.Context, productId int64) error
	InactiveProduct(ctx context.Context, productId int64) error
	RemoveProductOutOfDatabase(ctx context.Context, ids []int64) error
}

//Implementation's product repository

func (p *ProductImplementation) IsExist(ctx context.Context, productId int64) (bool, error) {
	query := "SELECT 1 FROM your_table WHERE Id = ? LIMIT 1"
	res := p.Conn.QueryRowContext(ctx, query, productId)
	if res.Err() != nil && res.Err() == sql.ErrNoRows {
		return false, res.Err()
	}
	return true, res.Err()
}
func (p *ProductImplementation) Count(ctx context.Context) (int64, error) {
	var count int64
	query := `SELECT COUNT(*) FROM PRODUCT WHERE IsActive = 1 && IsDeleted != 1`
	err := p.Conn.QueryRowContext(ctx, query).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
func (p *ProductImplementation) CountInactive(ctx context.Context) (int64, error) {
	var count int64
	query := `SELECT COUNT(*) FROM PRODUCT WHERE IsActive = 0 && IsDeleted != 1`
	err := p.Conn.QueryRowContext(ctx, query).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
func (p *ProductImplementation) CountDeleted(ctx context.Context) (int64, error) {
	var count int64
	query := `SELECT COUNT(*) FROM PRODUCT WHERE IsDeleted == 1`
	err := p.Conn.QueryRowContext(ctx, query).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
func (p *ProductImplementation) GetAllProducts(ctx context.Context) ([]Product, error) {
	query := `
	SELECT
		ID , Code, Name, Image, IsActive,CategoryId,SubCategoryId
		IsDeleted, CreateAt, UpdateAt, DeleteOn,
	FROM Product
	WHERE p.IsActive = 1 AND p.IsDeleted != 1
	`
	rows, err := p.Conn.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		if err := rows.Scan(&product.ID, &product.Code, &product.Name, &product.Image, &product.CategoryId, &product.SubCategoryId, &product.IsActive, &product.IsDeleted); err != nil {
			return nil, err
		}
		products = append(products, product)
	}
	return products, nil
}
func (p *ProductImplementation) GetPaginate(ctx context.Context, size int64, page int64) ([]Product, int64, int64, error) {
	offset := int32(size) * int32(page-1)
	query := `
		SELECT
			*
		FROM Product
		WHERE p.IsActive = 1 AND p.IsDeleted != 1
		`
	rows, err := p.Conn.QueryContext(ctx, query, size, offset)
	if err != nil {
		return nil, 0, 0, err
	}

	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		if err := rows.Scan(&product.ID, &product.Code, &product.Name, &product.Image, &product.IsActive, &product.IsDeleted); err != nil {
			return nil, 0, 0, err
		}
		products = append(products, product)
	}

	var totalCount int64

	totalCount, err = p.Count(ctx)

	if err != nil {
		return nil, 0, 0, err
	}

	totalPageResponse := ulities.CaculateTotalPages(totalCount, int64(size))

	return products, totalCount, totalPageResponse, nil
}
func (p *ProductImplementation) GetPaginateInactive(ctx context.Context, size int64, page int64) ([]Product, int64, int64, error) {
	offset := int32(size) * int32(page-1)
	query := `
		SELECT
			ID , Code, Name, Image, IsActive,
			IsDeleted, CreateAt, UpdateAt, DeleteOn,
		FROM Product
		WHERE p.IsActive = 0 AND p.IsDeleted != 1
		`
	rows, err := p.Conn.QueryContext(ctx, query, size, offset)
	if err != nil {
		return nil, 0, 0, err
	}

	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		if err := rows.Scan(&product.ID, &product.Code, &product.Name, &product.Image, &product.IsActive, &product.IsDeleted); err != nil {
			return nil, 0, 0, err
		}
		products = append(products, product)
	}

	var totalCount int64

	totalCount, err = p.Count(ctx)

	if err != nil {
		return nil, 0, 0, err
	}

	totalPageResponse := ulities.CaculateTotalPages(totalCount, int64(size))

	return products, totalCount, totalPageResponse, nil
}
func (p *ProductImplementation) GetPaginateDeleted(ctx context.Context, size int64, page int64) ([]Product, int64, int64, error) {
	offset := int32(size) * int32(page-1)
	query := `
		SELECT
			ID , Code, Name, Image, IsActive,
			IsDeleted, CreateAt, UpdateAt, DeleteOn,
		FROM Product
		WHERE p.IsDeleted = 1
		`
	rows, err := p.Conn.QueryContext(ctx, query, size, offset)
	if err != nil {
		return nil, 0, 0, err
	}

	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		if err := rows.Scan(&product.ID, &product.Code, &product.Name, &product.Image, &product.IsActive, &product.IsDeleted); err != nil {
			return nil, 0, 0, err
		}
		products = append(products, product)
	}

	var totalCount int64

	totalCount, err = p.Count(ctx)

	if err != nil {
		return nil, 0, 0, err
	}

	totalPageResponse := ulities.CaculateTotalPages(totalCount, int64(size))

	return products, totalCount, totalPageResponse, nil
}
func (p *ProductImplementation) GetById(ctx context.Context, productId int64) (*Product, error) {
	query := `
	SELECT
		ID , Code, Name, Image, IsActive,
		IsDeleted, CreateAt, UpdateAt, DeleteOn,
	FROM Product
	WHERE ID = ? AND IsActive = 1 AND IsDeleted != 1
	`
	row := p.Conn.QueryRowContext(ctx, query, productId)
	if row != nil && row.Err() != nil {
		return nil, row.Err()
	}
	var prod Product
	if err := row.Scan(&prod.ID, &prod.Code, &prod.Name, &prod.Image, &prod.IsActive, &prod.IsDeleted); err != nil {
		return nil, err
	}
	return &prod, nil
}
func (p *ProductImplementation) GetByProductCode(ctx context.Context, code string) (*Product, error) {
	query := `
	SELECT
		ID , Code, Name, Image, IsActive,
		IsDeleted, CreateAt, UpdateAt, DeleteOn,
	FROM Product
	WHERE Code = ? AND IsActive = 1 AND IsDeleted != 1
	`
	row := p.Conn.QueryRowContext(ctx, query, code)
	if row != nil && row.Err() != nil {
		return nil, row.Err()
	}
	var prod Product
	if err := row.Scan(&prod.ID, &prod.Code, &prod.Name, &prod.Image, &prod.IsActive, &prod.IsDeleted); err != nil {
		return nil, err
	}
	return &prod, nil
}
func (p *ProductImplementation) GetByItemCode(ctx context.Context, itemCode string) (*Product, error) {
	query := `
	SELECT
		p.ID , p.Code, p.Name, p.Image, p.IsActive,
		p.IsDeleted, p.CreateAt, p.UpdateAt, p.DeleteOn
	FROM Product p
	JOIN ProductItem i ON p.ID = i.ID
	WHERE i.Code = ? AND IsActive = 1 AND IsDeleted != 1
	`
	row := p.Conn.QueryRowContext(ctx, query, itemCode)
	if row != nil && row.Err() != nil {
		return nil, row.Err()
	}
	var prod Product
	if err := row.Scan(&prod.ID, &prod.Code, &prod.Name, &prod.Image, &prod.IsActive, &prod.IsDeleted); err != nil {
		return nil, err
	}
	return &prod, nil
}
func (p *ProductImplementation) GetItemsByProductCode(ctx context.Context, productCode string) ([]ProductItem, error) {
	query := `
		SELECT
			pi.Code AS ItemCode, pi.Name AS ItemName,
			pi.Image AS ItemImage, pi.IsActive AS ItemIsActive
		FROM ProductItem pi
		JOIN Product p ON p.Code = pi.Code
		WHERE p.Code = ? AND pi.IsActive = 1 AND p.IsDeleted != 1;`
	rows, err := p.Conn.QueryContext(ctx, query, productCode)

	if err != nil && err == sql.ErrNoRows {
		return nil, err
	}

	defer rows.Close() //defer này là 1 syntax thực thi logic bên trong
	// ở đây là rows.Close() hàm này sẽ chạy khi Func này CHẠY XONG HẾT

	var productItems []ProductItem

	for rows.Next() {

		var prodItem ProductItem

		if err := rows.Scan(&prodItem.Code, &prodItem.Name, &prodItem.Image, &prodItem.IsActive); err != nil {
			return nil, err
		}

		productItems = append(productItems, prodItem)
	}

	return productItems, nil
}
func (p *ProductImplementation) UpdateProduct(ctx context.Context, product *Product) error {
	query := `
        UPDATE Product
        SET
            Code = ?,
            Name = ?,
            Image = ?,
			CountryOfOrigin = ?,
			CategoreId = ?,
			SubCategoryId = ?,
            UpdateAt = ?
        WHERE ID = ?;
    `

	_, err := p.Conn.ExecContext(
		ctx,
		query,
		product.Code,
		product.Name,
		product.Image,
		product.CountryOfOrigin,
		product.CategoryId,
		product.SubCategoryId,
		product.IsActive,
		product.IsDeleted,
		time.Now(),
		product.ID,
	)
	if err != nil {
		return err
	}
	return nil
}
func (p *ProductImplementation) UpdateItem(ctx context.Context, productCode string, item *ProductItem) error {
	query := `
        UPDATE ProductItem
        SET
            Code = ?,
            Name = ?,
            Image = ?,
            IsActive = ?
        WHERE ProductID IN (
            SELECT ID FROM Product WHERE Code = ?
        ) AND ID = ?;`
	_, err := p.Conn.ExecContext(
		ctx,
		query,
		item.Code,
		item.Name,
		item.Image,
		item.IsActive,
		productCode,
		item.ID,
	)

	return err
}
func (p *ProductImplementation) UpdateItemProperty(ctx context.Context, productCode string, itemCode string, property *Property) error {
	query := `
        UPDATE Property
        SET
            Color = ?,
            Height = ?,
            Width = ?,
            Length = ?,
            Weight = ?,
            Price = ?,
            IsActive = ?,
            Image = ?
        WHERE ProductItemID IN (
            SELECT pi.ID
            FROM ProductItem pi
            JOIN Product p ON pi.ProductID = p.ID
            WHERE p.Code = ? AND pi.Code = ?
        );
    `

	_, err := p.Conn.ExecContext(
		ctx,
		query,
		property.Color,
		property.Height,
		property.Width,
		property.Length,
		property.Weight,
		property.Price,
		property.IsActive,
		property.Image,
		productCode,
		itemCode,
	)

	return err
}
func (p *ProductImplementation) DeleteProduct(ctx context.Context, productId int64) error {
	query := `
        DELETE FROM Product
        WHERE ID = ?;
    `

	_, err := p.Conn.ExecContext(ctx, query, productId)
	return err
}
