package types

import "time"

type ShortcutParams struct {
	FullUrl   string
	Public    bool
	Creator   string
	CreatedAt time.Time
}
