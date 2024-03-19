package db

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
)

var db *sql.DB

func cPrint(s string) {
	fmt.Printf("[DB] %s\n", s)
}

func InitDB(connString string) {
	var err error
	db, err = sql.Open("postgres", connString)
	if err != nil {
		log.Fatal(err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	cPrint("Connected to database")
}

func CloseDB() {
	err := db.Close()
	if err != nil {
		log.Fatal("Failed to close db connection")
		return
	}
	cPrint("Connection closed")
}
