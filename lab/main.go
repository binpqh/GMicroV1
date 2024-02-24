package main

import "fmt"

func main() {
	nums1 := [2]int{2, 0}
	nums2 := [1]int{1}
	merge(nums1[:], 1, nums2[:], 1)
}

// nums1 => first num-array
// nums2 => second num-array,
// m => number of elements taked in nums1,
// n => number of elements taked in nums2,
func merge(nums1 []int, m int, nums2 []int, n int) {
	for n != 0 {
		if m != 0 && nums1[m-1] > nums2[n-1] {
			nums1[m+n-1] = nums1[m-1]
			m--
		} else {
			nums1[m+n-1] = nums2[n-1]
			n--
		}
	}
	fmt.Println(nums1)
}
