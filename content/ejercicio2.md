[mermaid]
erDiagram

    CHARACTER ||--o{ MISSION : gives
    CHARACTER ||--o{ MISSION : targets

    MISSION ||--o{ ITEM : requires
    MISSION ||--o{ REWARD : grants

    CHARACTER {
        int id
        string name
        string role
        int level
    }

    MISSION {
        int id
        string title
        string description
        int giver_id
        int target_id
    }

    ITEM {
        int id
        string name
        int quantity
        int mission_id
    }

    REWARD {
        int id
        string type
        int amount
        int mission_id
    }
[endmermaid]
