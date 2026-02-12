# Operators

This page provides a complete reference of all operators supported in 3dmigoto expressions. For detailed information about expression semantics, special values, and usage examples, see [Expressions](./expressions.md).

::: tip
3dmigoto does NOT support function calls like `sin()`, `cos()`, `sqrt()`, etc. Only operators and direct value access are supported.
:::

## Overview

All values in 3dmigoto are 32-bit floating-point numbers (float32). Expressions use standard operator precedence with support for parentheses to override evaluation order.

## Operator Precedence

Operators are evaluated in the following order (highest to lowest precedence):

| Precedence | Operators | Associativity |
|------------|-----------|---------------|
| 1 (highest) | `(`, `)` | N/A (grouping) |
| 2 | `!` | Right-to-left |
| 3 | `*`, `/`, `//`, `%` | Left-to-right |
| 4 | `+`, `-` | Left-to-right |
| 5 | `<`, `<=`, `>`, `>=` | Left-to-right |
| 6 | `==`, `!=`, `===`, `!==` | Left-to-right |
| 7 | `&&` | Left-to-right |
| 8 (lowest) | `\|\|` | Left-to-right |

**Example:**
```ini
; Multiplication before addition
x = 2 + 3 * 4       ; Result: 14 (not 20)

; Parentheses override precedence
x = (2 + 3) * 4     ; Result: 20

; Comparison before AND
if x > 10 && y < 20
    ; Evaluates as: (x > 10) && (y < 20)
endif
```

Reference: CommandList.cpp:3407-3525

---

## Arithmetic Operators

### Addition: `+`

Adds two values.

```ini
x = 5 + 3           ; Result: 8.0
x = x + 1           ; Increment by 1
x = -2 + 7          ; Result: 5.0
```

**Special Cases:**
- `Infinity + Infinity = Infinity`
- `Infinity + (-Infinity) = NaN`
- `x + NaN = NaN` (for any x)

Reference: CommandList.cpp:3450

---

### Subtraction: `-`

Subtracts the right value from the left value.

```ini
x = 10 - 3          ; Result: 7.0
x = x - 1           ; Decrement by 1
x = 5 - 8           ; Result: -3.0
```

**Special Cases:**
- `Infinity - Infinity = NaN`
- `x - NaN = NaN` (for any x)

Reference: CommandList.cpp:3453

---

### Multiplication: `*`

Multiplies two values.

```ini
x = 4 * 5           ; Result: 20.0
x = x * 2           ; Double value
x = -3 * 7          ; Result: -21.0
```

**Special Cases:**
- `Infinity * 0 = NaN`
- `Infinity * Infinity = Infinity`
- `x * NaN = NaN` (for any x)

Reference: CommandList.cpp:3444

---

### Division: `/`

Divides the left value by the right value (floating-point division).

```ini
x = 10 / 3          ; Result: 3.333333...
x = 15 / 5          ; Result: 3.0
x = 1 / 0           ; Result: Infinity
x = -1 / 0          ; Result: -Infinity
x = 0 / 0           ; Result: NaN
```

**Special Cases:**
- Division by zero produces `Infinity` or `-Infinity`
- `0 / 0 = NaN`
- `Infinity / Infinity = NaN`
- `x / NaN = NaN` (for any x)

Reference: CommandList.cpp:3447

---

### Floor Division: `//`

Divides and rounds toward negative infinity (floor).

```ini
x = 10 // 3         ; Result: 3.0 (floor of 3.333...)
x = -10 // 3        ; Result: -4.0 (floor of -3.333...)
x = 15 // 5         ; Result: 3.0
```

**Behavior:**
- Always rounds down (toward -Infinity)
- Different from truncation (which rounds toward zero)

**Comparison:**
```ini
x = 7 / 2           ; Result: 3.5
x = 7 // 2          ; Result: 3.0

x = -7 / 2          ; Result: -3.5
x = -7 // 2         ; Result: -4.0 (floor, not truncate to -3.0)
```

Reference: CommandList.cpp:3435

---

### Modulus: `%`

Returns the remainder of division.

```ini
x = 10 % 3          ; Result: 1.0
x = 15 % 5          ; Result: 0.0
x = 7.5 % 2.0       ; Result: 1.5
```

**Behavior:**
- Result has same sign as left operand
- Works with floating-point values

**Examples:**
```ini
x = 10 % 3          ; Result: 1.0
x = -10 % 3         ; Result: -1.0
x = 10 % -3         ; Result: 1.0
x = -10 % -3        ; Result: -1.0
```

**Special Cases:**
- `x % 0 = NaN`
- `Infinity % x = NaN`
- `x % NaN = NaN`

Reference: CommandList.cpp:3438

---

## Comparison Operators

All comparison operators return `1.0` for true or `0.0` for false.

### Equal: `==`

Tests if two values are equal (within float32 precision).

```ini
if x == 5.0         ; True if x equals 5
if 0.0 == -0.0      ; True (positive and negative zero are equal)
if NaN == NaN       ; False (NaN is never equal to anything)
```

**Important:** Float comparison can be imprecise due to rounding:
```ini
x = 0.1 + 0.2
if x == 0.3         ; May be false due to float precision!
```

Reference: CommandList.cpp:3471

---

### Not Equal: `!=`

Tests if two values are not equal.

```ini
if x != 0           ; True if x is not zero
if x != y           ; True if x and y differ
```

Equivalent to: `!(x == y)`

Reference: CommandList.cpp:3474

---

### Binary Equal: `===`

Tests if two values have identical bit patterns (exact binary equality).

```ini
if 0.0 === -0.0     ; False (different bit patterns)
if 5.0 === 5.0      ; True (identical representation)
if NaN === NaN      ; False (even with same bits, NaN != NaN)
```

**Use Cases:**
- Detecting unbound resources: `if ps-t0 === -0.0`
- Checking exact bit-level equality
- Distinguishing +0.0 from -0.0

Reference: CommandList.cpp:3477

---

### Binary Not Equal: `!==`

Tests if two values have different bit patterns.

```ini
if 0.0 !== -0.0     ; True (different bit patterns)
if x !== y          ; True if bit patterns differ
```

Equivalent to: `!(x === y)`

Reference: CommandList.cpp:3480

---

### Less Than: `<`

Tests if left value is less than right value.

```ini
if x < 10           ; True if x is less than 10
if 5 < 3            ; False
```

**Special Cases:**
- `NaN < x` is always false
- `x < NaN` is always false
- `-Infinity < x` is true (for any non-NaN x except -Infinity)

Reference: CommandList.cpp:3456

---

### Less Than or Equal: `<=`

Tests if left value is less than or equal to right value.

```ini
if x <= 100         ; True if x is at most 100
if 5 <= 5           ; True
```

**Special Cases:**
- `NaN <= x` is always false
- `x <= NaN` is always false

Reference: CommandList.cpp:3459

---

### Greater Than: `>`

Tests if left value is greater than right value.

```ini
if x > 0            ; True if x is positive
if 10 > 5           ; True
```

**Special Cases:**
- `NaN > x` is always false
- `x > NaN` is always false
- `Infinity > x` is true (for any non-NaN x except Infinity)

Reference: CommandList.cpp:3462

---

### Greater Than or Equal: `>=`

Tests if left value is greater than or equal to right value.

```ini
if x >= 50          ; True if x is at least 50
if 7 >= 7           ; True
```

**Special Cases:**
- `NaN >= x` is always false
- `x >= NaN` is always false

Reference: CommandList.cpp:3465

---

## Logical Operators

### Logical AND: `&&`

Returns true (1.0) if both operands are non-zero, otherwise false (0.0).

```ini
if x > 0 && x < 10
    ; True if x is between 0 and 10 (exclusive)
endif

if $enable && $ready
    ; True if both variables are non-zero
endif
```

**Short-circuit evaluation:** If left side is false (0.0), right side is not evaluated.

**Truth Table:**
- `0 && 0 = 0`
- `0 && 1 = 0`
- `1 && 0 = 0`
- `1 && 1 = 1`

**Special Cases:**
- Any non-zero value is considered "true"
- `NaN && x` evaluates left side, behavior undefined but typically false

Reference: CommandList.cpp:3486

---

### Logical OR: `||`

Returns true (1.0) if either operand is non-zero, otherwise false (0.0).

```ini
if x < 0 || x > 100
    ; True if x is outside the range [0, 100]
endif

if $buttonA || $buttonB
    ; True if either button pressed
endif
```

**Short-circuit evaluation:** If left side is true (non-zero), right side is not evaluated.

**Truth Table:**
- `0 || 0 = 0`
- `0 || 1 = 1`
- `1 || 0 = 1`
- `1 || 1 = 1`

**Special Cases:**
- Any non-zero value is considered "true"

Reference: CommandList.cpp:3489

---

### Logical NOT: `!`

Returns true (1.0) if operand is zero, otherwise false (0.0).

```ini
if !$disable
    ; True if $disable is 0
endif

$not_equal = !(x == y)
; True if x and y are different
```

**Truth Table:**
- `!0 = 1`
- `!1 = 0`
- `!<non-zero> = 0`

**Special Cases:**
- `!NaN` behavior is implementation-dependent

Reference: CommandList.cpp:3441

---

## Assignment Operator

### Assignment: `=`

Assigns a value to a variable or parameter.

```ini
x0 = 42
x1 = x0 + 10
$variable = rt_width / 1920.0
ps-cb0[4] = 1.0
```

**Valid targets:**
- IniParams: `x0`, `y0`, `z0`, `w0`, etc.
- Local variables: `$name` (must be declared with `local $name`)
- Constant buffer slots: `ps-cb0[index]`
- Resource references (in resource copy context)

**Cannot assign to:**
- Built-in read-only variables: `rt_width`, `time`, etc.
- Resource handles directly (use resource commands instead)

Reference: CommandList.cpp (multiple locations)

---

## Grouping

### Parentheses: `(` `)`

Override default operator precedence.

```ini
; Without parentheses
x = 2 + 3 * 4       ; Result: 14 (multiplication first)

; With parentheses
x = (2 + 3) * 4     ; Result: 20 (addition first)

; Complex expression
result = ((x + y) * 2 + z) / (w - 1)

; Nested conditions
if (x > 0 && y > 0) || (x < 0 && y < 0)
    ; True if both positive or both negative
endif
```

Reference: CommandList.cpp:3407-3525

---

## Common Patterns

### Incrementing/Decrementing

```ini
x0 = x0 + 1         ; Increment
x1 = x1 - 1         ; Decrement
x2 = x2 * 2         ; Double
x3 = x3 / 2         ; Halve
```

### Clamping Values

```ini
; Clamp x0 to range [0, 1]
if x0 < 0
    x0 = 0
else if x0 > 1
    x0 = 1
endif

; Clamp using min/max pattern
if x0 < min_val
    x0 = min_val
endif
if x0 > max_val
    x0 = max_val
endif
```

### Toggle Boolean

```ini
; Toggle between 0 and 1
if $toggle == 0
    $toggle = 1
else
    $toggle = 0
endif

; Using logical NOT
$toggle = !$toggle  ; Flips 0 to 1, non-zero to 0
```

### Range Checking

```ini
; Check if value is in range [min, max]
if x >= min && x <= max
    ; In range
endif

; Check if value is outside range
if x < min || x > max
    ; Out of range
endif
```

### Cycle Through Values

```ini
; Cycle 0 -> 1 -> 2 -> 0
$state = ($state + 1) % 3

; Cycle with custom range [5, 10]
$value = $value + 1
if $value > 10
    $value = 5
endif
```

### Proportional Scaling

```ini
; Scale based on resolution
separation = (rt_width / 1920.0) * base_separation

; Normalize to [0, 1]
normalized = (value - min_value) / (max_value - min_value)

; Aspect ratio adjustment
adjusted_width = height * (16.0 / 9.0)
```

---

## Special Float32 Values

3dmigoto supports IEEE 754 special values:

| Value | How to Create | Use Case |
|-------|---------------|----------|
| `Infinity` | `1.0 / 0.0` | Represent unbounded values |
| `-Infinity` | `-1.0 / 0.0` | Represent unbounded negative values |
| `NaN` | `0.0 / 0.0` | Represent invalid/undefined values |
| `-0.0` | Unbound resource | Detect empty resource slots |

**Detecting Unbound Resources:**
```ini
; Check if texture slot is empty
if ps-t0 === -0.0
    ; Slot is unbound
endif
```

**Working with Special Values:**
```ini
; Any operation with NaN produces NaN
x = NaN + 5         ; Result: NaN
x = NaN * 0         ; Result: NaN

; Infinity arithmetic
x = Infinity + 100  ; Result: Infinity
x = Infinity * 2    ; Result: Infinity
x = Infinity - Infinity  ; Result: NaN
```

See [Expressions - Special Float32 Values](./expressions.md#special-float32-values) for complete details.

---

## Control Flow

### Conditional Execution

```ini
if condition
    ; Execute if condition is true (non-zero)
endif

if condition
    ; Execute if true
else
    ; Execute if false
endif

if condition1
    ; Execute if condition1 true
else if condition2
    ; Execute if condition1 false and condition2 true
else
    ; Execute if all conditions false
endif
```

**Nesting:**
```ini
if outer_condition
    if inner_condition
        ; Nested execution
    endif
endif
```

**No Loop Support:**
- 3dmigoto does NOT support `for`, `while`, or `switch` statements
- Use command list recursion carefully (recursion limit exists)

See [Control Flow](./control-flow.md) for complete conditional syntax.

---

## Operator Limitations

### What 3dmigoto Does NOT Support

**No Function Calls:**
```ini
; INVALID - No function calls supported
x = sin(angle)      ; ERROR
x = cos(time)       ; ERROR
x = sqrt(value)     ; ERROR
x = abs(x)          ; ERROR
x = min(a, b)       ; ERROR
```

**No Bitwise Operators:**
```ini
; INVALID - No bitwise operations
x = a & b           ; ERROR (use && for logical AND)
x = a | b           ; ERROR (use || for logical OR)
x = a ^ b           ; ERROR (no XOR)
x = a << 2          ; ERROR (no bit shift)
```

**No Ternary Operator:**
```ini
; INVALID - No ternary operator
x = condition ? true_val : false_val  ; ERROR

; Use if/else instead
if condition
    x = true_val
else
    x = false_val
endif
```

**No Compound Assignment:**
```ini
; INVALID - No compound assignment
x += 1              ; ERROR (use x = x + 1)
x *= 2              ; ERROR (use x = x * 2)
x++                 ; ERROR (use x = x + 1)
```

---

## Best Practices

### Float Comparison

Avoid direct equality for computed floats:
```ini
; RISKY - May fail due to float precision
x = 0.1 + 0.2
if x == 0.3
    ; May not execute
endif

; BETTER - Use range check
epsilon = 0.0001
if x > 0.3 - epsilon && x < 0.3 + epsilon
    ; Within acceptable range
endif
```

### Parentheses for Clarity

Use parentheses even when not strictly required:
```ini
; Less clear
if x > 0 && y > 0 || z > 0
    ; Which interpretation?
endif

; More clear
if (x > 0 && y > 0) || z > 0
    ; Obvious grouping
endif
```

### Avoid Complex Expressions

Break complex expressions into steps:
```ini
; Hard to read
result = ((a + b) * (c - d) / (e + f)) % g

; Easier to understand
sum = a + b
diff = c - d
denom = e + f
result = (sum * diff / denom) % g
```

### Document Magic Numbers

```ini
; Use descriptive variable names
aspect_ratio = 16.0 / 9.0
target_fps = 60.0
scale_factor = rt_width / 1920.0

; Better than:
x = rt_width / 1920.0 * (16.0 / 9.0) * 60.0  ; What does this do?
```
