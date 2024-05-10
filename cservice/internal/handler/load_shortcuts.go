package handler

import (
	"cservice/constants"
	"cservice/db"
	"cservice/types"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func LoadShortcuts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendInvalidMethodJSON(w, r, http.MethodPost)
		return
	}
	var p struct {
		UserID      int    `json:"user_id"`
		Count       int    `json:"count"`
		Offset      int    `json:"offset"`
		SortBy      string `json:"sort_by"`
		SearchQuery string `json:"search_q"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		SendJson(w, http.StatusUnprocessableEntity, map[string]interface{}{
			"error": "bad json",
		})
		return
	}
	if p.Count > constants.MaxShortcutsLoadCount {
		p.Count = constants.MaxShortcutsLoadCount
	}
	if p.SortBy == "" {
		p.SortBy = "id"
	}

	shortcutsArray, sortedBy, err := db.LoadUserShortcuts(p.UserID, p.Count, p.Offset,
		p.SortBy, strings.ToLower(p.SearchQuery))

	if err != nil {
		fmt.Println(err)
		SendJson(w, http.StatusUnprocessableEntity, map[string]interface{}{
			"error":   "cannot load shortcuts with this params",
			"data":    p,
			"err_cst": err,
		})
		return
	}
	if shortcutsArray == nil {
		shortcutsArray = []types.Shortcut{}
	}
	length := len(shortcutsArray)
	SendJson(w, http.StatusOK, map[string]interface{}{
		"count":     length,
		"offset":    p.Offset,
		"sort_by":   sortedBy,
		"shortcuts": shortcutsArray,
	})
	return
}
