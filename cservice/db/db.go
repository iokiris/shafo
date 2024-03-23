package db

import (
	"context"
	"crypto/rand"
	"cservice/internal"
	"cservice/types"
	"fmt"
	"github.com/jackc/pgx/v5"
	"log"
	"math/big"
	"strings"
)

var db *pgx.Conn

func cPrint(s string) {
	fmt.Printf("[DB] %s\n", s)
}

func InitDB(connString string) {
	var err error
	db, err = pgx.Connect(context.Background(), connString)
	if err != nil {
		log.Fatal(err)
	}
	err = db.Ping(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	cPrint("Connected to database")
}

func CloseDB() {
	err := db.Close(context.Background())
	if err != nil {
		log.Fatal("Failed to close db connection")
		return
	}
	cPrint("Connection closed")
}

func GetAllTables() {
	query := `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`

	rows, err := db.Query(context.Background(), query)
	if err != nil {
		log.Fatalf("Ошибка при выполнении запроса: %v\n", err)
		return
	}
	defer rows.Close()

	var tableName string
	for rows.Next() {
		err := rows.Scan(&tableName)
		if err != nil {
			log.Fatalf("Ошибка при чтении строки: %v\n", err)
			return
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Ошибка при итерации по результатам запроса: %v\n", err)
	}
}

func GenRandomString(length int) (string, error) {
	var sb strings.Builder
	letters := []rune(internal.EnglishLetters)
	lettersCount := big.NewInt(int64(len(letters)))
	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, lettersCount)
		if err != nil {
			return "", err
		}
		sb.WriteRune(letters[n.Int64()])
	}
	return sb.String(), nil
}

func GetFullByShortUrl(shortUrl string) (string, error) {
	sqlStatement := `SELECT full_url FROM shortcuts WHERE short_url = $1`
	var fullUrl string
	err := db.QueryRow(context.Background(), sqlStatement, shortUrl).Scan(&fullUrl)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", fmt.Errorf("short URL not found")
		}
		return "", fmt.Errorf("error when getting full URL by short: %w", err)
	}
	return fullUrl, nil
}

func AddNewShortcut(p types.ShortcutParams) (int, error) {
	shortcut, err := GenRandomString(6)
	if err != nil {
		return 0, err
	}
	var shortcutId int
	sqlStatement := `
        INSERT INTO shortcuts (full_url, short_url, public, creator, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `

	err = db.QueryRow(context.Background(), sqlStatement, p.FullUrl,
		shortcut, p.Public, p.Creator, p.CreatedAt).Scan(&shortcutId)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return 0, err
	}

	return shortcutId, nil
}
