-- Existing tables...

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    desk_id TEXT NOT NULL,
    -- start_time TEXT NOT NULL,
    -- end_time TEXT NOT NULL
);