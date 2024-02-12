package main

import "fmt"

func main() {
	Test_lower_bound()
	//array => position A -> B => find
}
func lower_bound(array []int64, to_search int64) int {
	index := -1
	low := 0
	high := len(array) - 1
	for low <= high {
		mid := (low + high) / 2
		if array[mid] <= to_search {
			low = mid + 1
			index = mid
		} else {
			high = mid - 1
		}
	}
	return index
}

// Test
func Test_lower_bound() {

	array := []int64{1, 3, 4, 5}
	to_search1 := 0
	to_search2 := 2
	to_search3 := 5
	if lower_bound(array, int64(to_search1)) != -1 {
		fmt.Printf("fail")
	}
	if lower_bound(array, int64(to_search2)) != 0 {
		fmt.Printf("fail")
	}
	if lower_bound(array, int64(to_search3)) != 3 {
		fmt.Printf("fail")
	}
}
