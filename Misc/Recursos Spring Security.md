# Tabla de Users
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserRole> userRoles = new ArrayList<>();

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public List<Role> getRoles() {
        return userRoles.stream().map(UserRole::getRole).toList();
    }

    // Getters y Setters
}
```
# Tabla de Roles
```java
@Entity
@Table(name = "roles")
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // Ejemplo: "ROLE_STUDENT"

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<UserRole> userRoles = new ArrayList<>();

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<RolePermission> rolePermissions = new ArrayList<>();

    public Role() {}

    public Role(String name) {
        this.name = name;
    }

    public List<Permission> getPermissions() {
        return rolePermissions.stream().map(RolePermission::getPermission).toList();
    }

    // Getters y Setters
}
```
# Tabla de Permissions
```java
@Entity
@Table(name = "permissions")
public class Permission {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // Ejemplo: "VIEW_OWN_COURSES"

    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL)
    private List<RolePermission> rolePermissions = new ArrayList<>();

    // Getters y Setters
}
```
# Tabla UserRole
```java
@Entity
@Table(name = "user_roles")
public class UserRole {

    @EmbeddedId
    private UserRoleId id = new UserRoleId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private Role role;

    public UserRole() {}

    public UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
        this.id = new UserRoleId(user.getId(), role.getId());
    }

    // Getters y Setters
}
```
# UserRoleId
```java
@Embeddable
public class UserRoleId implements Serializable {
    private Long userId;
    private Long roleId;

    public UserRoleId() {}

    public UserRoleId(Long userId, Long roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

    // equals y hashCode obligatorios
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserRoleId)) return false;
        UserRoleId that = (UserRoleId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(roleId, that.roleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, roleId);
    }
}
```
