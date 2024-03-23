package types

import "time"

type Shortcut struct {
	ShortUrl  string    `json:"shortUrl"`
	FullUrl   string    `json:"fullUrl"`
	Public    bool      `json:"public"`
	Creator   string    `json:"creator"`
	CreatedAt time.Time `json:"createdAt"`
}

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
