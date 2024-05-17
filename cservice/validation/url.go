package validation

import (
	"cservice/constants"
	"cservice/internal/utils"
	"net/url"
)

func IsValidURL(s string) bool {
	parsedURL, err := url.ParseRequestURI(s)
	if err != nil {
		return false
	}
	if !utils.SliceContainsString(constants.AllowedRedirectSchemes, parsedURL.Scheme) {
		return false
	}
	return true
}
