package handler

import (
	"cservice/types"
	"net/http"
)

func PingHandler(w http.ResponseWriter, r *http.Request) {
	var response = types.StatusResponse{Status: "ACTIVE"}
	SendJson(w, http.StatusOK, response)
}
