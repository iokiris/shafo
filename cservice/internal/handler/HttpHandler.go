package handler

import (
	"cservice/db"
	"cservice/types"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func SendJson(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("Failed to send json: %v", err)
	}

}

func AddShortcut(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		SendJson(w, http.StatusNotFound, map[string]string{"error": "Method is not supported."})
		return
	}

	var data struct {
		types.ShortcutParams
	}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		SendJson(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	shortcutId, err := db.AddNewShortcut(data.ShortcutParams)
	if err != nil {
		SendJson(w, http.StatusInternalServerError, map[string]string{"error": "Failed to add new shortcut"})
		return
	}

	SendJson(w, http.StatusOK, map[string]interface{}{
		"message":     "Added shortcut with id",
		"shortcut_id": shortcutId,
	})
}

func GetFullUrlFromShort(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method is not allowed", http.StatusMethodNotAllowed)
		return
	}

	shortUrl := r.URL.Query().Get("shortUrl")
	fmt.Println(shortUrl)

	if shortUrl == "" {
		http.Error(w, "ShortUrl parameter is required", http.StatusBadRequest)
		return
	}
	fullUrl, err := db.GetFullByShortUrl(shortUrl)
	if err != nil {
		SendJson(w, http.StatusNotFound, map[string]string{"error": "Route not found"})
		return
	}
	fmt.Printf("Found route to %s\n", fullUrl)
	SendJson(w, http.StatusOK, map[string]interface{}{
		"redirect_to": fullUrl,
	})

}

func PingHandler(w http.ResponseWriter, r *http.Request) {
	var response = types.StatusResponse{Status: "ACTIVE"}
	SendJson(w, http.StatusOK, response)
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	var response = map[string]interface{}{
		"timestamp": time.Now(),
	}
	SendJson(w, http.StatusOK, response)
}
