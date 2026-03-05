# SPEC-07 · BeanVisualizer Component

## Purpose

An interactive canvas-based tool that parses Java Spring bean definitions (annotation-based or XML) and renders a live dependency graph. Students can inspect how beans wire together, drag nodes, zoom, and get validation warnings.

Triggered in lessons with the `[beansim]` … `[endbeansim]` DSL block.

---

## File Structure

```
src/components/BeanVisualizer/
  BeanVisualizer.jsx           ← main component
  model/
    buildBeanGraph.js          ← orchestrates parsing → graph model
  regex/
    beanDetection.js           ← detects @Component / @Service / etc.
    wiringDetection.js         ← @Autowired field injection
    methodWiringDetection.js   ← @Autowired setter injection
    constructorWiringDetection.js ← constructor injection
    configWiringDetection.js   ← @Configuration + @Bean wiring
    xmlBeanDetection.js        ← XML <bean> / <constructor-arg> / <property ref>
    xmlValidation.js           ← XML structure warnings
    validations.js             ← Java code validations
    cycleDetection.js          ← circular dependency detection
    layoutCalculation.js       ← hierarchical layout (levels)
  components/
    CodeEditor.jsx             ← editable code area (react-simple-code-editor + PrismJS)
    Canvas.jsx                 ← canvas element + zoom slider
    Alert.jsx                  ← validation warning display
    TabSelector.jsx            ← Java / XML example buttons
```

---

## User Interface Layout

```
┌─────────────────────────────────────────────────────┐
│  [TabSelector]  Java Example | XML Example          │
├─────────────────────────────────────────────────────┤
│  [CodeEditor]                                       │
│  Editable syntax-highlighted code area              │
│  (PrismJS java highlighting, dark theme)            │
├─────────────────────────────────────────────────────┤
│  [Alert]                                            │
│  Validation warnings (errors, missing refs, cycles) │
├─────────────────────────────────────────────────────┤
│  [Canvas]                                           │
│  Interactive bean graph (drag, zoom, tooltips)      │
│  Height: 600 px fixed                               │
│  Width: responsive (ResizeObserver)                 │
│  [Zoom slider] min 0.5×, max 2.5×                   │
└─────────────────────────────────────────────────────┘
```

---

## Canvas Behavior

### Bean Nodes

| Property | Value |
|---|---|
| Shape | Circle |
| Radius | `40 px` |
| Label | camelCase bean name, truncated with `…` if too wide |
| Label font | `bold 14px sans-serif` |
| Label color | `#222` |
| Border | `2px solid #333` |

**Node colors by bean type:**

| Spring stereotype | Color |
|---|---|
| `@Component` | `#27ae60` (green) |
| `@Service` | `#e67e22` (orange) |
| `@Repository` | `#2980b9` (blue) |
| `@Controller` / `@RestController` | `#8e44ad` (purple) |
| `@Bean` (from `@Configuration`) | `#00bcd4` (cyan) |
| XML `<bean>` | `#f39c12` (amber) |

### Wiring Arrows

- White lines with arrowheads by default.
- **Cycle edges**: `#e53935` (red).
- Arrow from injector bean → injected bean (direction of dependency).
- Arrowhead: two lines at ±0.4 rad, 10 px long.
- Line width: `2.5 px`.

### Layout Algorithm

Beans are arranged in a **hierarchical level layout**:
- Beans with no dependencies are at the top level.
- Each bean is placed one level below its deepest injector.
- Within a level, beans are evenly distributed horizontally.
- Level vertical spacing: `BEAN_RADIUS * 2 + 40 px gap`.
- Initial layout recalculates on every parse (code change). User drags override positions until next code change.

### Camera and Zoom

| Property | Value |
|---|---|
| Min zoom | `0.5×` |
| Max zoom | `2.5×` |
| Zoom input | Mouse wheel (non-passive event listener) + slider |
| Pan | Click-drag on empty canvas area |
| Bean drag | Click-drag on a bean node repositions it |
| Tooltip | Hovering a bean shows its full name in a fixed overlay |

---

## Input Modes

### Java Annotation Mode

Supports:
- `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController` on `public class`.
- Optional explicit bean name: `@Component("myName")`.
- Field injection: `@Autowired private BeanType fieldName;`
- Setter injection: `@Autowired public void setFoo(BeanType foo) { ... }`
- Constructor injection: constructor with `@Autowired` or single constructor inference.
- `@Configuration` class with `@Bean` methods.
- Classes with `extends` and `implements` are tolerated.

### XML Mode

Supports:
- `<bean id="..." class="..."/>` definitions.
- `<constructor-arg ref="..."/>` wiring.
- `<property name="..." ref="..."/>` wiring.
- Class declarations in Java must also be present in the code block for XML beans.

---

## Validation Warnings

Displayed in the `Alert` component below the code editor.

| Warning | Condition |
|---|---|
| Missing class | An `@Autowired` field type has no corresponding bean |
| Autowired invalid | `@Autowired` on a non-field/method location |
| Missing autowired method type | Setter injection references unknown bean type |
| Missing constructor type | Constructor parameter type has no bean |
| Unassigned constructor params | Constructor params not matched to beans |
| Multi-name warning | Two beans share the same name |
| Bracket warning | Unbalanced `{` `}` in the code |
| Return warning | `@Bean` method has no `return` statement |
| Cycle warning | Circular dependency detected |
| XML structure warning | Malformed XML header or namespace |
| XML tag warning | Unknown XML tags in bean XML |
| XML closing warning | Unclosed XML tags |
| Bean unclosed warning | `<bean>` tag not properly closed |
| Missing XML class | XML `class` attribute references undeclared Java class |
| Broken XML wiring | `ref` attribute points to undefined bean ID |

---

## State

| State variable | Description |
|---|---|
| `code` | Current editable code string |
| `beans` | Array of `{ className, beanName, type }` |
| `wirings` | Array of `{ from, to }` (bean name pairs) |
| `warnings` | Object with all validation warning arrays/flags |
| `beanPositions` | `{ [beanName]: { x, y } }` — canvas coordinates |
| `zoom` | Number, `0.5`–`2.5` |
| `camera` | `{ x, y }` — scroll offset in virtual space |
| `cycleWarnings` | Array of cycle arrays |
| `dragging` | Boolean — canvas pan in progress |
| `draggedBean` | Bean name being dragged, or `null` |
| `canvasWidth` | Responsive width from ResizeObserver |
| `tooltip` | `{ name, x, y }` or `null` |

---

## Example Code Presets

**Java preset (TabSelector "Java Example"):**
```java
@Component
public class BeanA {}

@Component
public class BeanB {
    @Autowired
    private BeanA beanA;
}
```

**XML preset (TabSelector "XML Example"):**
```java
public class BeanA {}
public class BeanB {}
```
```xml
<beans ...>
  <bean id="beanA" class="BeanA"/>
  <bean id="beanB" class="BeanB">
    <constructor-arg ref="beanA"/>
  </bean>
</beans>
```

---

## DSL Integration

When used from a lesson file:

```
[beansim]
@Component
public class MyService {
    @Autowired
    private MyRepository myRepository;
}

@Repository
public class MyRepository {}
[endbeansim]
```

The content between the tags is passed as `initialCode` to `BeanVisualizer`. The visualizer strips the `[beansim]`/`[endbeansim]` wrapper if present (safety measure).

The code editor is always editable, so students can modify the example live.
