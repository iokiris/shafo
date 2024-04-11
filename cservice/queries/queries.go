package queries

const (
	InsertShortcutSQL = `
        INSERT INTO shortcuts (full_url, short_url, public, created_at, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, short_url;`

	LoadShortcutRowsByUserIdWithOffsetSortedById = `
		SELECT id, short_url, full_url, public, created_at, user_id
		FROM shortcuts WHERE user_id=$1 AND LOWER(full_url) LIKE '%' || $4 || '%'
		ORDER BY id
		LIMIT $2 OFFSET $3;`

	LoadShortcutRowsByUserIdWithOffsetSortedByCreatedAt = `
		SELECT id, short_url, full_url, public, created_at, user_id
		FROM shortcuts WHERE user_id=$1 AND LOWER(full_url) LIKE '%' || $4 || '%'
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3;`
	LoadShortcutRowsByUserIdWithOffsetSortedByPublic = `
		SELECT id, short_url, full_url, public, created_at, user_id
		FROM shortcuts WHERE user_id=$1 AND LOWER(full_url) LIKE '%' || $4 || '%'
		ORDER BY public DESC
		LIMIT $2 OFFSET $3;`
	LoadShortcutRowsByUserIdWithOffsetSortedByPrivate = `
		SELECT id, short_url, full_url, public, created_at, user_id
		FROM shortcuts WHERE user_id=$1 AND LOWER(full_url) LIKE '%' || $4 || '%'
		ORDER BY public
		LIMIT $2 OFFSET $3;`

	GetShortcutFullUrlByShort = `SELECT full_url FROM shortcuts WHERE short_url = $1;`

	GetShortcutInfoByShort = `SELECT id, short_url, full_url, public, created_at, user_id FROM shortcuts WHERE short_url = $1;`

	EditShortcutVisibilityById = `
		UPDATE shortcuts SET public=$1 
		                 WHERE id=$2 AND user_id=$3
		                 RETURNING id;`

	PublicAccess = `SELECT public FROM shortcuts WHERE id=$1;`

	GetAllCustomTables = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`
)
