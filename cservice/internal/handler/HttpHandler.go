package handler

import (
	"cservice/types"
	"encoding/json"
	"net/http"
	"time"
)

func SendJson(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_, err := w.Write([]byte(`{"error": "Failed to send json"`))
		if err != nil {
			return
		}
	}
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
