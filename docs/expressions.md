# Expressions and Operators

3dmigoto supports expression evaluation in many contexts throughout INI files. Expressions allow you to perform calculations, make comparisons, and dynamically control mod behavior based on runtime values.

::: tip
3dmigoto does NOT support function calls like `sin()`, `cos()`, `sqrt()`, etc. Only operators and direct value access are supported.
:::

## Overview

Expressions are mathematical or logical statements that evaluate to a value. They can be used in various contexts:

- Setting variables and parameters
- Conditional statements (if/else)
- Draw call parameters
- Any numeric property that supports dynamic values

```ini
; Simple arithmetic
x0 = x0 + 1

; Using expressions in conditionals
if x0 > 100
    x0 = 0
endif

; Complex expression
separation = (rt_width / res_width) * 2 + time % 60
```

**Important:** 3dmigoto does NOT support function calls like `sin()`, `cos()`, `sqrt()`, etc. It only supports operators and direct value access.

## Data Types and Float32 Semantics

All values in 3dmigoto expressions are stored and evaluated as **32-bit floating-point numbers (float32)**, following the IEEE 754 standard. This has several important implications:

### Everything is Float32

```ini
; All values are float32, including what looks like integers
x0 = 42         ; Stored as 42.0 (float32)
x1 = 10 / 3     ; Result: 3.333333... (float32)
x2 = 5 == 5.0   ; True - integers and floats are the same type

; Even boolean results are represented as floats
$result = x0 > 10   ; Stores 1.0 (true) or 0.0 (false)
```

### Precision Limitations

Float32 has approximately 7 decimal digits of precision:

```ini
; Fine - within precision
x0 = 1234567.0

; Problematic - exceeds float32 precision
x1 = 123456789.0    ; May lose precision
x2 = 0.123456789    ; Only ~7 significant digits preserved

; Integer precision is guaranteed up to 16,777,216
; Beyond that, not all integers can be represented exactly
```

### Special Float32 Values

3dmigoto supports the IEEE 754 special values, which have specific meanings and behaviors:

| Value         | Hex Pattern    | Meaning                          | How to Get                        |
|---------------|----------------|----------------------------------|-----------------------------------|
| `0.0`         | `0x00000000`   | Positive zero                    | Normal zero result                |
| `-0.0`        | `0x80000000`   | Negative zero                    | Result of `-0`, unbound resources |
| `Infinity`    | `0x7F800000`   | Positive infinity                | Division by zero: `1.0 / 0.0`     |
| `-Infinity`   | `0xFF800000`   | Negative infinity                | Division by zero: `-1.0 / 0.0`    |
| `NaN`         | `0x7FC00000+`  | Not a Number                     | Invalid operations: `0.0 / 0.0`   |

### Special Value Behaviors and Quirks

#### Positive Zero vs Negative Zero

```ini
; Positive and negative zero are mathematically equal
if 0.0 == -0.0
    ; This is TRUE - they compare as equal
endif

; But they have different bit patterns
if 0.0 === -0.0
    ; This is FALSE - binary equality checks bit pattern
endif

; Negative zero is used as a sentinel value
; Unbound resource slots return -0.0
if ps-t0 === -0.0
    ; Texture slot is unbound/empty
endif

; Sign is preserved in some operations
x = -0.0 * 2        ; Result: -0.0
x = -0.0 + 0.0      ; Result: 0.0 (implementation dependent)
```

#### Infinity Behavior

```ini
; Infinity from division by zero
x0 = 1.0 / 0.0      ; Result: Infinity
x1 = -1.0 / 0.0     ; Result: -Infinity

; Arithmetic with infinity
x2 = Infinity + 1   ; Result: Infinity
x3 = Infinity * 2   ; Result: Infinity
x4 = -Infinity * -1 ; Result: Infinity

; Comparisons with infinity
if x0 > 999999
    ; Infinity is greater than any finite number
endif

; Invalid infinity operations produce NaN
x5 = Infinity - Infinity    ; Result: NaN
x6 = Infinity / Infinity    ; Result: NaN
x7 = 0 * Infinity           ; Result: NaN
```

#### NaN (Not a Number) Behavior

```ini
; Operations that produce NaN
x0 = 0.0 / 0.0              ; NaN
x1 = Infinity - Infinity    ; NaN
x2 = (-1.0) ** 0.5          ; NaN (negative square root)

; NaN comparisons are always false (except !=)
if NaN == NaN
    ; FALSE - NaN is not equal to anything, even itself!
endif

if NaN != NaN
    ; TRUE - the only comparison that returns true
endif

if NaN > 0
    ; FALSE
endif

if NaN < 0
    ; FALSE
endif

; NaN propagates through operations
x3 = NaN + 1        ; Result: NaN
x4 = NaN * 0        ; Result: NaN
x5 = NaN ** 0       ; Result: NaN (usually, implementation dependent)

; Testing for NaN
; Since NaN != NaN, we can use this to detect it:
if x0 != x0
    ; x0 is NaN
endif
```

#### Practical Use Cases for Special Values

**1. Detecting Unbound Resource Slots:**

```ini
[ShaderOverrideExample]
hash = abcd1234

; Check if a texture is bound to the slot
if ps-t0 === -0.0
    ; Slot is empty - use fallback texture
    ps-t0 = ResourceFallbackTexture
else
    ; Slot has a texture - modify it
    run = CommandListProcessTexture
endif
```

**2. Safe Division with Infinity Check:**

```ini
; Divide with infinity handling
x0 = numerator / denominator

if x0 == Infinity || x0 == -Infinity
    ; Division produced infinity, clamp to large value
    if x0 > 0
        x0 = 999999.0
    else
        x0 = -999999.0
    endif
endif
```

**3. Detecting Invalid Calculations:**

```ini
; After a complex calculation, check for NaN
$result = (x0 * y0) / (z0 - w0)

if $result != $result
    ; Result is NaN - calculation was invalid
    $result = 0.0
    $error_flag = 1
endif
```

**4. Distinguishing Zero Types:**

```ini
; Normal equality (mathematical)
if value == 0.0
    ; True for both 0.0 and -0.0
endif

; Binary equality (bit pattern)
if value === 0.0
    ; True only for positive zero
endif

if value === -0.0
    ; True only for negative zero
endif
```

### Float32 Arithmetic Quirks

#### Precision Loss in Addition

```ini
; Large number + small number may lose the small number
x0 = 10000000.0 + 1.0       ; May equal 10000000.0 (precision loss)
```

#### Non-Associativity

```ini
; Order matters due to precision
x0 = (1.0 + 1e-10) - 1.0    ; May be 1e-10
x1 = 1.0 + (1e-10 - 1.0)    ; May be 0.0
```

#### Comparison Tolerance

```ini
; Floating-point comparisons can be tricky
x0 = 0.1 + 0.2              ; Might be 0.30000001 due to float representation

; Exact comparison may fail
if x0 == 0.3
    ; Might be FALSE due to precision
endif

; Use epsilon comparison for tolerance
$epsilon = 0.0001
$diff = x0 - 0.3
if $diff < $epsilon && $diff > -$epsilon
    ; TRUE - within tolerance
endif
```

#### Integer Operations

```ini
; Integers up to 16,777,216 are exact
x0 = 16777216.0     ; Exact
x1 = 16777217.0     ; Exact
x2 = 16777218.0     ; May lose precision

; Use floor division for integer-like results
x3 = 10 // 3        ; Result: 3.0 (exactly)

; Modulo works with floats
x4 = 7.5 % 2.0      ; Result: 1.5
```

### Variables and Parameters are Float32

All variables and IniParams store float32 values only:

```ini
; Variables
$my_var = 42        ; Stored as 42.0 (float32)
$flag = 1           ; Stored as 1.0 (float32)

; IniParams
x0 = 100            ; Stored as 100.0 (float32)
y0 = 3.14159        ; Stored as float32 with limited precision

; Boolean-like usage
$enabled = 1        ; Use 1.0 for true
$disabled = 0       ; Use 0.0 for false

; In conditionals, non-zero is true
if $enabled
    ; TRUE (any non-zero value)
endif

if 0
    ; FALSE (zero is false)
endif

if 0.001
    ; TRUE (non-zero)
endif
```

## Operators

3dmigoto supports a comprehensive set of operators for expressions. All operators work with float32 values and follow standard operator precedence.

::: tip
3dmigoto does NOT support function calls like `sin()`, `cos()`, `sqrt()`, etc. Only operators and direct value access are supported.
:::

### Operator Precedence

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

### Arithmetic Operators

#### Addition: `+`

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

#### Subtraction: `-`

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

#### Multiplication: `*`

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

#### Division: `/`

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

#### Floor Division: `//`

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

#### Modulus: `%`

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

### Comparison Operators

All comparison operators return `1.0` for true or `0.0` for false.

#### Equal: `==`

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

#### Not Equal: `!=`

Tests if two values are not equal.

```ini
if x != 0           ; True if x is not zero
if x != y           ; True if x and y differ
```

Equivalent to: `!(x == y)`

Reference: CommandList.cpp:3474

---

#### Binary Equal: `===`

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

#### Binary Not Equal: `!==`

Tests if two values have different bit patterns.

```ini
if 0.0 !== -0.0     ; True (different bit patterns)
if x !== y          ; True if bit patterns differ
```

Equivalent to: `!(x === y)`

Reference: CommandList.cpp:3480

---

#### Less Than: `<`

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

#### Less Than or Equal: `<=`

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

#### Greater Than: `>`

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

#### Greater Than or Equal: `>=`

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

### Logical Operators

#### Logical AND: `&&`

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

#### Logical OR: `||`

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

#### Logical NOT: `!`

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

### Assignment Operator

#### Assignment: `=`

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

### Grouping

#### Parentheses: `(` `)`

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

### Operator Limitations

#### What 3dmigoto Does NOT Support

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

### Common Operator Patterns

#### Incrementing/Decrementing

```ini
x0 = x0 + 1         ; Increment
x1 = x1 - 1         ; Decrement
x2 = x2 * 2         ; Double
x3 = x3 / 2         ; Halve
```

#### Clamping Values

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

#### Toggle Boolean

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

#### Range Checking

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

#### Cycle Through Values

```ini
; Cycle 0 -> 1 -> 2 -> 0
$state = ($state + 1) % 3

; Cycle with custom range [5, 10]
$value = $value + 1
if $value > 10
    $value = 5
endif
```

#### Proportional Scaling

```ini
; Scale based on resolution
separation = (rt_width / 1920.0) * base_separation

; Normalize to [0, 1]
normalized = (value - min_value) / (max_value - min_value)

; Aspect ratio adjustment
adjusted_width = height * (16.0 / 9.0)
```

---

### Best Practices

#### Float Comparison

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

#### Parentheses for Clarity

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

#### Avoid Complex Expressions

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

#### Document Magic Numbers

```ini
; Use descriptive variable names
aspect_ratio = 16.0 / 9.0
target_fps = 60.0
scale_factor = rt_width / 1920.0

; Better than:
x = rt_width / 1920.0 * (16.0 / 9.0) * 60.0  ; What does this do?
```

## Value Sources

Expressions can use various sources of values.

### Constants

Numeric literals can be integers or floating-point:

```ini
x0 = 42              ; Decimal integer
x1 = 3.14159         ; Floating-point
x2 = -10             ; Negative
x3 = 1.5e-3          ; Scientific notation (1.5 × 10⁻³)
```

### IniParams

3dmigoto provides parameter arrays that can be accessed with `x`, `y`, `z`, and `w` followed by an optional index:

```ini
; Accessing IniParams
x0 = 1.0            ; Set x parameter at index 0
y0 = 2.0            ; Set y parameter at index 0
z10 = 3.0           ; Set z parameter at index 10
w99 = 4.0           ; Set w parameter at index 99

; Default index is 0 if not specified
x = 5.0             ; Same as x0 = 5.0

; Using IniParams in expressions
x1 = x0 + y0
x2 = x1 * 2
```

These parameters persist across frames and can be accessed from HLSL shaders. See [Properties](/docs/properties.md) for more details.

### System Variables

3dmigoto provides several built-in variables that reflect runtime state:

| Variable          | Description                                    | Type    |
|-------------------|------------------------------------------------|---------|
| `time`            | Time in seconds since game start               | float   |
| `vertex_count`    | Vertex count from current draw call            | int     |
| `index_count`     | Index count from current draw call             | int     |
| `instance_count`  | Instance count from current draw call          | int     |
| `rt_width`        | Current render target width                    | int     |
| `rt_height`       | Current render target height                   | int     |
| `res_width`       | Game resolution width                          | int     |
| `res_height`      | Game resolution height                         | int     |
| `window_width`    | Window width                                   | int     |
| `window_height`   | Window height                                  | int     |
| `cursor_x`        | Cursor X position (window coordinates)         | int     |
| `cursor_y`        | Cursor Y position (window coordinates)         | int     |
| `cursor_screen_x` | Cursor X position (screen coordinates)         | int     |
| `cursor_screen_y` | Cursor Y position (screen coordinates)         | int     |
| `cursor_showing`  | Whether cursor is visible (0 or 1)             | int     |

```ini
; Time-based calculation
x0 = time % 60              ; Cycles 0-60 every 60 seconds

; Resolution-dependent calculation
$aspect_ratio = res_width / res_height

; Conditional based on resolution
if res_width >= 3840 && res_height >= 2160
    $is_4k = 1
endif

; Cursor-based interaction
if cursor_showing && cursor_x > 100 && cursor_x < 200
    $hover_ui = 1
endif
```

### User-Defined Variables

Variables starting with `$` are user-defined:

```ini
; Define variables
$my_variable = 10
$enabled = 1
$last_time = time

; Use in expressions
$elapsed = time - $last_time
$result = $my_variable * 2

; Toggle variable
$enabled = !$enabled
```

See [Properties](/docs/properties.md) for more information on variables.

## Workarounds for Missing Functions

Since 3dmigoto does not have built-in functions, you must use alternative approaches:

### Square Root

Use the exponentiation operator with power 0.5:

```ini
; Square root using x ** 0.5
$distance = (x0 * x0 + y0 * y0) ** 0.5
```

### Minimum and Maximum

Use conditional statements:

```ini
; Find maximum of two values
if $a > $b
    $max = $a
else
    $max = $b
endif

; Find minimum of two values
if $a < $b
    $min = $a
else
    $min = $b
endif
```

### Absolute Value

```ini
; Absolute value
if $value < 0
    $abs_value = -$value
else
    $abs_value = $value
endif
```

### Clamping (Limiting to Range)

```ini
; Clamp value between min and max
if $value < $min
    $value = $min
endif
if $value > $max
    $value = $max
endif
```

### Conditional Assignment (Instead of Ternary)

Since the ternary operator `? :` is not supported, use if/else blocks:

```ini
; Instead of: x0 = condition ? value1 : value2
if $condition
    x0 = $value1
else
    x0 = $value2
endif
```

## Practical Examples

### Example 1: Toggle with Counter

```ini
[KeyToggle]
key = VK_F1
type = activate
run = CommandListToggle

[CommandListToggle]
; Toggle between 0 and 1
$enabled = !$enabled

; Increment counter each time
x0 = x0 + 1

; Reset counter after 10 presses
if x0 > 10
    x0 = 0
endif
```

### Example 2: Cyclic Animation

```ini
[Present]
; Cycle value between 0 and 1 using modulo
$normalized_time = time % 1

; Create sawtooth wave (0 to 10, repeating)
$sawtooth = time % 10

; Create triangle wave using floor division
$triangle_phase = time % 2
if $triangle_phase < 1
    $triangle = $triangle_phase
else
    $triangle = 2 - $triangle_phase
endif
```

### Example 3: Resolution-Adaptive Values

```ini
[Present]
; Calculate aspect ratio
$aspect = res_width / res_height

; Scale based on resolution (1.0 at 1920x1080)
$res_scale = res_width / 1920

; Different values for different resolutions
if res_width >= 3840
    x0 = 2.0    ; 4K
else
    if res_width >= 2560
        x0 = 1.5    ; 1440p
    else
        x0 = 1.0    ; 1080p or lower
    endif
endif
```

### Example 4: Distance Calculation

```ini
[CommandListCalculateDistance]
; 2D distance from origin using Pythagorean theorem
$dist_2d = (x0 * x0 + y0 * y0) ** 0.5

; 3D distance
$dist_3d = (x0 * x0 + y0 * y0 + z0 * z0) ** 0.5

; Check if within radius
if $dist_2d < 100
    $in_range = 1
else
    $in_range = 0
endif
```

### Example 5: Detect Empty Texture Slot

```ini
[ShaderOverrideExample]
hash = abcd1234

; Check if texture slot is bound using binary equality
; Empty slots return -0.0 (negative zero)
if ps-t0 === -0.0
    ; Texture slot is empty
    $texture_bound = 0
else
    ; Texture slot has something bound
    $texture_bound = 1
endif
```

### Example 6: Frame Counter

```ini
[Present]
; Increment frame counter every frame
$frame_count = $frame_count + 1

; Execute something every 60 frames
if $frame_count % 60 == 0
    run = CommandListEvery60Frames
endif

; Reset counter at 3600 frames (1 minute at 60fps)
if $frame_count >= 3600
    $frame_count = 0
endif
```

### Example 7: Exponential Scaling

```ini
[CommandListExample]
; Double the value (2^n scaling)
$doubled = $value * 2 ** $exponent

; Halve the value
$halved = $value / 2 ** $exponent

; Quadratic scaling
$quadratic = $value ** 2
```

## Common Pitfalls

### Division by Zero

Always check for zero before dividing:

```ini
; BAD: Can cause errors if y0 is zero
x0 = x1 / y0

; GOOD: Check for zero first
if y0 != 0
    x0 = x1 / y0
else
    x0 = 0
endif
```

### Operator Precedence

Use parentheses to make precedence explicit:

```ini
; Ambiguous: Is it (x0 + 1) * 2 or x0 + (1 * 2)?
x0 = x0 + 1 * 2     ; Actually: x0 + (1 * 2)

; Clear with parentheses
x0 = (x0 + 1) * 2
```

### All Values are Float32

Remember that all values are 32-bit floats, not integers:

```ini
; Even "integer" literals are stored as float32
x0 = 5 / 2      ; Result: 2.5 (float division)

; Use floor division for integer-like results
x0 = 5 // 2     ; Result: 2.0 (still a float, but floored)

; Floating-point modulo
$remainder = 5.5 % 2.0    ; Result: 1.5 (works with floats)
```

### Float Precision Issues

```ini
; Float32 has limited precision (~7 decimal digits)
x0 = 0.1 + 0.2          ; Might not equal exactly 0.3

; Avoid exact comparisons with computed floats
if x0 == 0.3
    ; May fail due to precision
endif

; Use tolerance-based comparison
$diff = x0 - 0.3
if $diff < 0.0001 && $diff > -0.0001
    ; Better approach
endif
```

### NaN Detection

```ini
; NaN is the only value not equal to itself
if x0 != x0
    ; x0 is NaN - result of invalid operation
    x0 = 0  ; Reset to valid value
endif
```

### Binary Equality Use Case

The `===` and `!==` operators check exact bit patterns. This is primarily useful for detecting unbound resource slots:

```ini
; Unbound slots return -0.0 (negative zero)
; Normal equality (==) treats -0.0 and 0.0 as equal
; Binary equality (===) treats them as different

if ps-t0 == 0.0
    ; True for both 0.0 and -0.0
endif

if ps-t0 === -0.0
    ; True only for -0.0 (unbound slot)
endif
```

### No Ternary Operator

The ternary conditional operator is not supported:

```ini
; WRONG: This will not work
x0 = condition ? 1 : 0

; CORRECT: Use if/else instead
if $condition
    x0 = 1
else
    x0 = 0
endif
```
