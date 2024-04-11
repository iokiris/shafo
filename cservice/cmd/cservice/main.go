package main

import (
	"cservice/db"
	"cservice/internal/handler"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load .env")
	}

	var connectionString = fmt.Sprintf("host=pgdb dbname=%s password=%s user=%s sslmode=disable",
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_USER"))
	db.InitDB(connectionString)

	http.HandleFunc("/status", handler.PingHandler)
	http.HandleFunc("/add", handler.AddShortcut)
	http.HandleFunc("/getByShort", handler.GetFullUrlFromShort)
	http.HandleFunc("/loadShortcuts", handler.LoadShortcuts)
	http.HandleFunc("/editVisibility", handler.EditVisibility)
	http.HandleFunc("/", handler.RootHandler)

	server := &http.Server{
		Addr:           ":8080",
		Handler:        nil,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Println("[Main]: Listening for " + server.Addr)
	db.GetAllTables()
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
	defer db.CloseDB()
}
