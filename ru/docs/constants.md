
## Constants
Declare named global variables here to use them from other command lists,
[Key] bindings and [Preset]s. Named variables are namespaced so that any
included ini files can use their own without worrying about name clashes:

```global $my_named_variable = 0.0```

Mark a variable as persist[ent] to automatically save it to the
d3dx_user.ini on exit or F10 (config_reload). 
Use Ctrl+Alt+F10
(wipe_user_config) to discard persistent values:

```global persist $some_persistent_variable = 1```

Set the initial value of "IniParams" variables, which are accessible from
within shaders, but they are not namespaced and too many can become unwieldy:
```x = 0.8
y = 1.0
z = 1.2
w = 2.0
y1 = 3
```

For more information about variables, please refer to the [Variables section](#variable).

---


### global

The necessary modifier when declaring a **global** variable. [Variable rules can be found here](#variable).
Also, note that global variables are only declared within the [Constants](#constants) section.

```ini
[Constants]
global $a_global_var = 1
```

### local

The necessary modifier when declaring a **local** variable. [Variable rules can be found here](#variable).
Local variables can be declared anywhere needed for calculations. However, it is uncertain how GIMI handles the recycling mechanism for local variables. At least for now, local variables are not seen frequently.

```ini
[AnySection]
local $i = 0
```

### persist

The necessary modifier when declaring a **persistent** variable. [Variable rules can be found here](#variable).
This modifier is only used for global variables. Once declared, the variable will persist(throughout gameplay sessions) and be stored in `d3dx_user.ini`. It will only be reset when you use `Ctrl + Alt + F10`.
```ini
[Constants]
global persist $a_persist_var = 1
```
