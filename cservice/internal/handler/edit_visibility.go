package handler

import (
	"cservice/db"
	"encoding/json"
	"net/http"
)

func EditVisibility(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendInvalidMethodJSON(w, r, http.MethodPost)
		return
	}
	var data struct {
		Id        int  `json:"id"`
		NewStatus bool `json:"visibility"`
		UserId    int  `json:"user_id"`
	}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		SendJson(w, http.StatusUnprocessableEntity, "Bad json")
		return
	}
	id, queryErr := db.EditVisibility(data.Id, data.NewStatus, data.UserId)
	if queryErr.Error != nil {
		SendJson(w, http.StatusBadRequest, map[string]string{
			"error": queryErr.Message,
		})
		return
	}
	SendJson(w, http.StatusOK, map[string]interface{}{
		"status":     "ok",
		"visibility": data.NewStatus,
		"id":         id,
	})
}
