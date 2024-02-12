package product

import "errors"

var ErrUnexpected = errors.New("UnexpectedInternalError")
var ErrProductNotFound = errors.New("ErrProductNotFound")
