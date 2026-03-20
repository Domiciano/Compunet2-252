[t] Ejercicio 2
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

[code:java]
@Entity
@Table(name = "characters")
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String role;

    private Integer level;

    @OneToMany(mappedBy = "giver")
    private List<Mission> givenMissions;

    @OneToMany(mappedBy = "target")
    private List<Mission> targetedMissions;
}

@Entity
@Table(name = "missions")
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @ManyToOne
    @JoinColumn(name = "giver_id")
    private Character giver;

    @ManyToOne
    @JoinColumn(name = "target_id")
    private Character target;

    @OneToMany(mappedBy = "mission")
    private List<Item> items;

    @OneToMany(mappedBy = "mission")
    private List<Reward> rewards;
}

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;
}

@Entity
@Table(name = "rewards")
public class Reward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private Integer amount;

    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;
}
[endcode]

[st] Consultas
