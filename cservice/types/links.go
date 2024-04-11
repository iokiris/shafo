package types

import "time"

type Shortcut struct {
	Id        int       `json:"id"`
	ShortUrl  string    `json:"short_url"`
	FullUrl   string    `json:"full_url"`
	Public    bool      `json:"public"`
	CreatedAt time.Time `json:"created_at"`
	UserID    int       `json:"user_id"`
}

type ShortcutsArray []Shortcut

type ShortcutStat struct {
	counter      int
	uniqueVisits int
	geo          map[string]int
	source       map[string]int
	device       map[string]int
	clicks       []time.Time
}

type DetailedVisit struct {
	geo []string
}
