# Variable

In GIMI, variables are identified by starting with the `$` symbol.
And if there is no `$` symbol in some positions that should be variables, that is a parameter.

```ini
$last_time = time
; $last_time is our defined variable, while time is a reserved word in GIMI.
```

# Parameters

These are 3Dmigoto configuration values and don't start with $ before their name. Most of them can be found in `d3dx.ini` in the base installation directory. Some of them need to be defined within specific sections. For the use of GIMI modding we don't often use these parameters, but they are still useful for some special cases.

## time

`time` is a reserved word in GIMI. It saves a float with the time in seconds since the game launched. It can be used to measure time delays since the last occurence of an action (more creative uses of the parameter are possible as well).

For example we can track the last time the user pressed the key E

```ini
[KeyDetection]
key = e
type = hold
run = CommandListKey

[CommandListKey]
$last_time = time

...

if time - $last_time > 10
    ; do something only after 10 seconds have passed since last E press
endif

...
```




## iniParams
Another particular case is `iniParams`, an array of values that can be defined in an ini file and later on called from within a shader. Useful to comunicate the two. These values are shared across diferent ini files, so their use must be as concise as possible to avoid conflicts with other mods.


It's definition is as follows:

```ini
x123 = 0.8
y123 = 1.0
z123 = 1.2
w123 = 2.0

x1 = 3

...
```

and it's later usage in the shader is as follows:

```hlsl
// 3Dmigoto declarations
#define cmp -
Texture1D<float4> IniParams : register(t120);
Texture2D<float4> StereoParams : register(t125);
#define OFFSET IniParams[123].x
#define SCALE IniParams[123].y
#define CONVERGENCE IniParams[123].z
#define SEPARATION IniParams[123].w
#define Y1 IniParams[1].x

... 

r1.x = dot(r1.xyz, r2.xyz);
r1.y = dot(v0.xyz, r2.xyz);
r1.y=r1.y + OFFSET;

...
```