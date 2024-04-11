package db

import (
	"context"
	"crypto/rand"
	"cservice/constants"
	"cservice/queries"
	"cservice/types"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"math/big"
	"strings"
)

var db *pgxpool.Pool

type QueryError struct {
	Message string
	Error   error
}

func cPrint(s string) {
	fmt.Printf("[DB] %s\n", s)
}

func InitDB(connString string) {
	var err error
	db, err = pgxpool.New(context.Background(), connString)
	if err != nil {
		fmt.Println(err)
	}
	err = db.Ping(context.Background())
	if err != nil {
		fmt.Println(err)
	}
	cPrint("Connected to database")
}

func CloseDB() {
	db.Close()
	cPrint("Connection closed")
}

func GetAllTables() {
	query := queries.GetAllCustomTables
	rows, err := db.Query(context.Background(), query)
	if err != nil {
		fmt.Printf("Ошибка при выполнении запроса: %v\n", err)
		return
	}
	defer rows.Close()

	var tableName string
	for rows.Next() {
		err := rows.Scan(&tableName)
		if err != nil {
			fmt.Printf("Ошибка при чтении строки: %v\n", err)
			return
		}
	}

	if err := rows.Err(); err != nil {
		fmt.Printf("Ошибка при итерации по результатам запроса: %v\n", err)
	}
}

func ShortcutIsPublic(shortUrl string) (bool, QueryError) {
	query := queries.PublicAccess
	var public bool
	err := db.QueryRow(context.Background(), query, shortUrl).Scan(&public)
	if err != nil {
		return false, QueryError{Error: err}
	}
	return public, QueryError{Error: nil}
}

func GenRandomString(length int) (string, error) {
	var sb strings.Builder
	letters := []rune(constants.EnglishLetters)
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

func AddNewShortcut(p types.ShortcutParams) (int, string, error) {
	shortcut, err := GenRandomString(constants.ShortcutLength)
	if err != nil {
		return 0, "", err
	}
	var shortcutId int
	var shortUrl string
	sqlStatement := queries.InsertShortcutSQL

	err = db.QueryRow(context.Background(), sqlStatement, p.FullUrl,
		shortcut, p.Public, p.CreatedAt, p.UserID).Scan(&shortcutId, &shortUrl)
	if err != nil {
		fmt.Printf("Unable to execute the query. %v", err)
		return 0, "", err
	}

	return shortcutId, shortUrl, nil
}

// GetFullByShortUrl returns full-url, public [false/true], error
func GetFullByShortUrl(shortUrl string) (types.Shortcut, error) {
	sqlStatement := queries.GetShortcutInfoByShort

	var shortcut types.Shortcut
	err := db.QueryRow(context.Background(), sqlStatement, shortUrl).Scan(
		&shortcut.Id, &shortcut.ShortUrl, &shortcut.FullUrl, &shortcut.Public, &shortcut.CreatedAt, &shortcut.UserID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return types.Shortcut{}, fmt.Errorf("short URL not found")
		}
		return types.Shortcut{}, fmt.Errorf("error when getting full URL by short: %w", err)
	}
	return shortcut, nil
}

func LoadUserShortcuts(userId int, count int, offset int,
	sortBy string, searchQ string) ([]types.Shortcut, string, error) {

	var query string
	sortType := "id"
	switch sortBy {
	case "created_at":
		query = queries.LoadShortcutRowsByUserIdWithOffsetSortedByCreatedAt
		sortType = "created_at"
	case "public":
		query = queries.LoadShortcutRowsByUserIdWithOffsetSortedByPublic
		sortType = "public"
	case "private":
		query = queries.LoadShortcutRowsByUserIdWithOffsetSortedByPrivate
		sortType = "private"
	default:
		query = queries.LoadShortcutRowsByUserIdWithOffsetSortedById
	}

	var shortcuts []types.Shortcut
	q, err := db.Query(context.Background(), query, userId, count, offset, searchQ)
	defer q.Close()
	if err != nil {
		return nil, sortType, err
	}
	fmt.Println(searchQ)
	for q.Next() {
		var s types.Shortcut
		if err := q.Scan(&s.Id, &s.ShortUrl, &s.FullUrl, &s.Public, &s.CreatedAt, &s.UserID); err != nil {
			return nil, sortType, err
		}

		shortcuts = append(shortcuts, s)
	}
	return shortcuts, sortType, nil
}

func EditVisibility(scId int, newStatus bool, userId int) (int, QueryError) {
	sqlStatement := queries.EditShortcutVisibilityById

	var shortcutId int
	err := db.QueryRow(context.Background(), sqlStatement, newStatus, scId, userId).Scan(&shortcutId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, QueryError{Error: err, Message: fmt.Sprintf(
				"Shortcut [%d] not found", scId)}
		}
		return 0, QueryError{Error: err}
	}
	return shortcutId, QueryError{Error: nil}
}
