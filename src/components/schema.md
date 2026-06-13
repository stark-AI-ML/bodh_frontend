erDiagram
    %% Relationships
    plans ||--o{ users : "defines access for"
    users ||--o{ api_keys : "owns"
    states ||--o{ districts : "contains"
    states ||--o{ news_all : "filters by"
    districts ||--o{ news_all : "filters by"

    %% User Management Subsystem
    plans {
        integer id PK
        varchar(50) name
        integer token_per_day
        integer token_per_minute
        integer tokens_used
    }

    users {
        uuid id PK
        varchar(255) google_id
        varchar(40) email
        varchar(40) name
        roles user_role
        integer plan_id FK
    }

    api_keys {
        uuid id PK
        uuid user_id FK
        text key_hash
        boolean isactive
    }

    %% Geographic Subsystem
    states {
        bigint id PK
        varchar(100) name
    }

    districts {
        bigint id PK
        bigint state_id FK
        varchar(100) name
    }

    %% Core Data Subsystem (Partitioned)
    news_all {
        bigint id PK
        bigint state_id FK
        bigint district_id FK
        text headline
        news_category category
        impact_scope_type impact_scope
        sentiment_type sentiment
        crime_severity crime_severity
        emergency_type emergency_type
        date broadcast_date
    }

    %% Standalone / Loose Entities
    channel_transcripts {
        integer id PK
        text channel_id
        text state_name
        text channel_type
    }

    state_transcripts {
        text state_name PK
        text news_transcript
        text finance_transcript
    }