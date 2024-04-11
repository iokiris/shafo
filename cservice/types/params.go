package types

import "time"

type ShortcutParams struct {
	FullUrl   string
	Public    bool
	CreatedAt time.Time
	UserID    int
}
