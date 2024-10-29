
# Key (section)
Custom settings override for any of [convergence, separation, x, y, z, w]

## Type
Four types are supported - 

By `default`, the bindings will simply load the
configured settings, 

but ```type = hold``` can be specified to have a preset
active while the button is held, 

```type = toggle``` can be used to make a simple
on/off toggle, 

and``` type = cycle``` can be used to cycle forwards and/or backward
between several presets.

## Delays 
(```type = hold``` only) and linear or cosine transition periods (any key type)
can be used to better synchronise setting changes to the game's animations
or to smoothly adjust UI elements over a short period.
## Warps
(```type = cycle``` only) Controls whether the key-cycle type allows wrapping around (connecting the first and last elements).
The default value is True.
```ini
[KeyK]
key = k
warp = false
type = cycle
$swapvar = 0, 1, 2, 3
```
## Key bindings:
For A-Z and 0-9 on the number row, just use that single
character. For everything else (including mouse buttons), use the virtual key
name (with or without the VK_ prefix) or hex code from this article:
http://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx

### Key combinations
can be specified by separating key names with spaces, e.g.
```"Shift Q"```. It is also possible to indicate that a key must *not* be held for
the binding to activate, e.g. ```"NO_ALT F1"``` would prevent the binding from
activating when taking a 3D Screenshot with Alt F1. ```"NO_MODIFIERS"``` may be
used as a shorthand for excluding all standard modifiers (Ctrl, Alt, Shift,
Windows).

Keys can also be from XBox controllers using:

  XB_LEFT_TRIGGER, XB_RIGHT_TRIGGER,
  XB_LEFT_SHOULDER, XB_RIGHT_SHOULDER,
  XB_LEFT_THUMB, XB_RIGHT_THUMB,
  XB_DPAD_UP, XB_DPAD_DOWN, XB_DPAD_LEFT, XB_DPAD_RIGHT,
  XB_A, XB_B, XB_X, XB_Y, XB_START, XB_BACK, XB_GUIDE

By default all attached controllers are used - to associate a binding with a
specific controller add the controller number 1-4 to the prefix, like
XB2_LEFT_TRIGGER, though this may be more useful for hunting than playing.

### Multiple keys 
may be set in a single [Key] section to allow keyboard and xbox
controller toggles and cycles to share the same state as each other.

Example for changing default settings
```ini
[KeyBasicExample]
Key = z
separation = 100.0
convergence = 4.0
x = 0.98
```
Named variables declared in [Constants] can be set here:
```ini
$my_named_variable = 2
```

Example to support momentary hold type overrides, like aiming. Shows how to
bind two separate buttons to the same action. (Either/or will trigger it)
```ini
[KeyMomentaryHoldExample]
Key = RBUTTON
Key = XB_LEFT_TRIGGER
convergence = 0.1
type = hold
```

Example for a toggle override that remembers the previous value and restores
it automatically when pressed a second time.
```ini
[KeyToggleExample]
Key = q
separation = 0.1
type = toggle
y = 0.0
```

Example for using a smart cycle type instead of a toggle. Smart is now the
default for cycles, and when activated it will quickly check if the current
values match its current cycle preset and resynchronize if necessary. This is
better than``` type=toggle``` if you always want to toggle between exactly two
values specified here, while ```type=toggle``` is better if you want to remember
some arbitrary current value and return to it:
```ini
[KeySmartCycleExample]
Key = w
type = cycle
smart = true
$some_variable = 0, 1
```

Example for a momentary hold, but with a delay followed by a smooth
transition (ms) on hold and release to sync better with the game. Note that
delay only works with ```type=hold``` (for now), while transitions will work with
all types.
```ini
[KeyDelayAndTransitionExample]
Key = RBUTTON
Key = XB_LEFT_TRIGGER
type = hold
y = 0.25
delay = 100
transition = 100
transition_type = linear
release_delay = 0
release_transition = 500
release_transition_type = cosine
```

Example of a cycle transition that might be used to provide several presets
that set both convergence and UI depth to suit different scenes in a game.
Cosine transitions are used to smooth the changes over 1/10 of a second.
Both keyboard and Xbox controller buttons are bound to this same cycle so
that they can be used interchangeably and remember the same position in the
preset list. A second key is used to cycle backward through the presets, and
wrapping from one end of the list to the other is disabled.
```ini
[KeyCycleExample]
Key = E
Key = XB_RIGHT_SHOULDER
Back = Q
Back = XB_LEFT_SHOULDER
type = cycle
wrap = false
convergence = 1.45, 1.13, 0.98
z           = 0.25,  0.5, 0.75
transition = 100
transition_type = cosine
```

Keys can only directly set variables to simple values. If you want to do
something more advanced, you may need to call a command list from the key
binding. ```type=hold/toggle``` keys will run the post phase of the command list on
release.
```ini
[KeyCommandListExample]
key = f
run = CommandListF
[CommandListF]
if $foo == 0 && cursor_showing
	$foo = $bar * 3.14 / rt_width
else
	$foo = 0
endif
```

Example of a preset override that can be referenced by one or more ```[ShaderOverride*]```
sections which can be activated/deactivated automatically when one of the shader
overrides is activated/deactivated. This is useful for setting automatic
convergence for specific scenes.
```ini
[PresetExample]
convergence = 0
$some_variable = 1
transition = 100
transition_type = linear
```

