package handler

import (
	"encoding/json"
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

func SendInvalidMethodJSON(w http.ResponseWriter, r *http.Request, required string) {
	SendJson(w, http.StatusMethodNotAllowed, map[string]string{
		"error":    "Method is not supported.",
		"received": r.Method,
		"required": required,
	})
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	var response = map[string]interface{}{
		"timestamp": time.Now(),
	}
	SendJson(w, http.StatusOK, response)
}
