package ulities

func CaculateTotalPages(total int64, size int64) int64 {
	if size <= 0 {
		return 0
	}
	var totalPages int64
	totalCount := total / size
	if totalCount%size != 0 {
		totalPages++
	}
	return totalPages
}
