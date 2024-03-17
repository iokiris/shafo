package main

import (
	"cservice/internal/handler"
	"log"
	"net/http"
	"time"
)

func main() {
	http.HandleFunc("/", handler.RootHandler)
	http.HandleFunc("/status", handler.PingHandler)

	server := &http.Server{
		Addr:           ":8080",
		Handler:        nil,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Println("[99] Listening for " + server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
