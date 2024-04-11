CREATE TABLE shortcuts (
                           id SERIAL PRIMARY KEY,
                           short_url VARCHAR(255) NOT NULL UNIQUE,
                           full_url VARCHAR(2048) NOT NULL,
                           public BOOLEAN NOT NULL,
                           created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
                           user_id INT
);

CREATE TABLE shortcut_stats (
                            shortcut_id INT,
                            counter INT NOT NULL DEFAULT 0,
                            unique_visits INT NOT NULL DEFAULT 0,
                            FOREIGN KEY (shortcut_id) REFERENCES shortcuts(id)
);

CREATE TABLE geo_stats (
                           shortcut_id INT,
                           geo VARCHAR(255) NOT NULL,
                           count INT NOT NULL DEFAULT 0,
                           FOREIGN KEY (shortcut_id) REFERENCES shortcuts(id)
);

CREATE TABLE source_stats (
                              shortcut_id INT,
                              source VARCHAR(255) NOT NULL,
                              count INT NOT NULL DEFAULT 0,
                              FOREIGN KEY (shortcut_id) REFERENCES shortcuts(id)
);

CREATE TABLE device_stats (
                              shortcut_id INT,
                              device VARCHAR(255) NOT NULL,
                              count INT NOT NULL DEFAULT 0,
                              FOREIGN KEY (shortcut_id) REFERENCES shortcuts(id)
);

CREATE TABLE visit_details (
                               id SERIAL PRIMARY KEY,
                               shortcut_id INT,
                               timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               geo VARCHAR(255),
                               source VARCHAR(255),
                               device VARCHAR(255),
                               FOREIGN KEY (shortcut_id) REFERENCES shortcuts(id)
);
