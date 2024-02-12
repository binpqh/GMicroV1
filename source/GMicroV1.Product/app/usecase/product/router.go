package product

import (
	"GMicroV1/Product/ulities"
	"encoding/json"
	"net/http"
	"strconv"
)

type ProductHandler struct {
	PUsecase UseCase
}

func NewProductHandler(m *http.ServeMux, productUseCase UseCase) {
	handler := &ProductHandler{productUseCase}
	m.HandleFunc(`/products`, handler.GetProductPaginate)
}

func (p *ProductHandler) GetProductPaginate(w http.ResponseWriter, req *http.Request) {
	var message string
	status := true
	size, err1 := strconv.ParseInt(req.URL.Query().Get(`size`), 10, 64)
	if err1 != nil {
		w.WriteHeader(http.StatusBadRequest)
		message = `Property page size is invalid.`
		status = false
	}
	page, err2 := strconv.ParseInt(req.URL.Query().Get(`page`), 10, 64)
	if err2 != nil {
		w.WriteHeader(http.StatusBadRequest)
		message = `Property page number is invalid.`
		status = false
	}
	products, totalCount, totalPages, errGetPaginate := p.PUsecase.GetPaginate(req.Context(), size, page)
	if errGetPaginate != nil {
		w.WriteHeader(http.StatusInternalServerError)
		message = errGetPaginate.Error()
		status = false
	}
	w.Header().Set("Content-Type", "application/json")
	data := map[string]interface{}{
		"products":    products,
		"totalCount":  totalCount,
		"totalPages":  totalPages,
		"currentPage": page,
	}
	if status {
		w.WriteHeader(http.StatusOK)
	}
	response := ulities.APIResponse{
		Data:    data,
		Message: message,
		Status:  strconv.FormatBool(status),
	}
	defer json.NewEncoder(w).Encode(response)
}
