package utils

import (
	"crypto/rand"
	"cservice/constants"
	"math/big"
	"strings"
)

func GenRandomString(length int) (string, error) {
	var sb strings.Builder
	letters := []rune(constants.EnglishLetters)
	lettersCount := big.NewInt(int64(len(letters)))
	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, lettersCount)
		if err != nil {
			return "", err
		}
		sb.WriteRune(letters[n.Int64()])
	}
	return sb.String(), nil
}
