package handler

import (
	"cservice/db"
	"fmt"
	"net/http"
)

func GetFullUrlFromShort(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		SendInvalidMethodJSON(w, r, http.MethodGet)
		return
	}

	shortUrl := r.URL.Query().Get("shortUrl")

	if shortUrl == "" {
		SendJson(w, http.StatusBadRequest, map[string]string{"error": "ShortUrl is required"})
		return
	}
	shortcut, err := db.GetFullByShortUrl(shortUrl)

	if err != nil {
		fmt.Println(err)
		SendJson(w, http.StatusNotFound, map[string]string{"error": "Route not found"})
		return
	}
	fmt.Printf("Found route to %s\n", shortcut.FullUrl)

	if !shortcut.Public {
		SendJson(w, http.StatusForbidden, map[string]interface{}{
			"error": "Link is expired",
		})
		return
	}
	SendJson(w, http.StatusOK, map[string]interface{}{
		"redirect_to": shortcut.FullUrl,
	})
	return
}
