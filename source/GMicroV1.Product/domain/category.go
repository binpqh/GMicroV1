package domain

import (
	"context"
	"database/sql"
)

type Category struct {
	ID            int64  `json:"id"`
	Name          string `json:"name"`
	SubCategories []SubCategory
}

type SubCategory struct {
	ID         int64  `json:"subCategoryId"`
	Name       string `json:"subCategoryName"`
	CategoryId int64
}

type CategoryImplementation struct {
	Conn *sql.Conn
}

// Entity's interface
type CategoryRepository interface {
	GetAllCategories(ctx context.Context) ([]Category, error)
	GetSubCategoriesByCategory(ctx context.Context, categoryId int64) ([]SubCategory, error)
	GetById(ctx context.Context, categoryId int64) (*Category, error)
	UpdateCategory(ctx context.Context, category *Category) error
	UpdateSubCategory(ctx context.Context, subCategoryId int64, subCategory *SubCategory) error
	DeleteCategory(ctx context.Context, categoryId int64) error
	DeleteSubCategory(ctx context.Context, subCategoryId int64) error
}

func (c *CategoryImplementation) GetAllCategories(ctx context.Context) ([]Category, error) {
	query := "SELECT * FROM Category"
	rows, err := c.Conn.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		err := rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, err
		}

		subCategories, err := c.GetSubCategoriesByCategory(ctx, category.ID)
		if err != nil {
			return nil, err
		}

		category.SubCategories = subCategories
		categories = append(categories, category)
	}

	return categories, nil
}

func (c *CategoryImplementation) GetSubCategoriesByCategory(ctx context.Context, categoryId int64) ([]SubCategory, error) {
	query := "SELECT * FROM SubCategory WHERE CategoryId = ?"
	rows, err := c.Conn.QueryContext(ctx, query, categoryId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subCategories []SubCategory
	for rows.Next() {
		var subCategory SubCategory
		err := rows.Scan(&subCategory.ID, &subCategory.Name, &subCategory.CategoryId)
		if err != nil {
			return nil, err
		}
		subCategories = append(subCategories, subCategory)
	}

	return subCategories, nil
}

func (c *CategoryImplementation) GetById(ctx context.Context, categoryId int64) (*Category, error) {
	query := "SELECT * FROM Category WHERE ID = ?"
	row := c.Conn.QueryRowContext(ctx, query, categoryId)
	var category Category
	err := row.Scan(&category.ID, &category.Name)
	if err != nil {
		return nil, err
	}

	subCategories, err := c.GetSubCategoriesByCategory(ctx, category.ID)
	if err != nil {
		return nil, err
	}

	category.SubCategories = subCategories
	return &category, nil
}

func (c *CategoryImplementation) UpdateCategory(ctx context.Context, category *Category) error {
	query := "UPDATE Category SET Name = ? WHERE ID = ?"
	_, err := c.Conn.ExecContext(ctx, query, category.Name, category.ID)
	return err
}

func (c *CategoryImplementation) UpdateSubCategory(ctx context.Context, subCategoryId int64, subCategory *SubCategory) error {
	query := "UPDATE SubCategory SET Name = ? WHERE ID = ?"
	_, err := c.Conn.ExecContext(ctx, query, subCategory.Name, subCategoryId)
	return err
}

func (c *CategoryImplementation) DeleteCategory(ctx context.Context, categoryId int64) error {
	_, err := c.Conn.ExecContext(ctx, "DELETE FROM SubCategory WHERE CategoryId = ?", categoryId)
	if err != nil {
		return err
	}

	_, err = c.Conn.ExecContext(ctx, "DELETE FROM Category WHERE ID = ?", categoryId)
	return err
}

func (c *CategoryImplementation) DeleteSubCategory(ctx context.Context, subCategoryId int64) error {
	_, err := c.Conn.ExecContext(ctx, "DELETE FROM SubCategory WHERE ID = ?", subCategoryId)
	return err
}
