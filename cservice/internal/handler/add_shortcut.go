package handler

import (
	"cservice/db"
	"cservice/types"
	"cservice/validation"
	"encoding/json"
	"net/http"
	"time"
)

func AddShortcut(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendInvalidMethodJSON(w, r, http.MethodPost)
		return
	}

	var data struct {
		FullUrl string `json:"full_url"`
		UserID  int    `json:"user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		SendJson(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !validation.IsValidURL(data.FullUrl) {
		SendJson(w, http.StatusBadRequest, map[string]string{"error": "Full URL is not valid"})
		return
	}

	createdAt := time.Now()

	shortcutParams := types.ShortcutParams{
		FullUrl:   data.FullUrl,
		Public:    true,
		CreatedAt: createdAt,
		UserID:    data.UserID,
	}

	shortcutId, sUrl, err := db.AddNewShortcut(shortcutParams)
	if err != nil {
		SendJson(w, http.StatusInternalServerError, map[string]string{"error": "Failed to add new shortcut"})
		return
	}

	SendJson(w, http.StatusOK, map[string]interface{}{
		"message": "Added shortcut with id",
		"shortcut": map[string]interface{}{
			"id":         shortcutId,
			"full_url":   shortcutParams.FullUrl,
			"created_at": createdAt,
			"short_url":  sUrl,
			"public":     true,
			"user_id":    shortcutParams.UserID,
		},
	})
}
