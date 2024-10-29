# Resource

Not sure if it is one of the reserved words in GIMI, but since sections with resources are usually prefixed with `Resource` let's consider it a reserved word. This makes it easier to identify and avoids confusion with other sections that have specific purposes. These sections are typically used to store various resource locations.
```ini
[Resource*]
...

[ResourceLumineDress]
...

[ResourceMyRGBWeapon]
...
```

## type (Resource)

This is a properties under [Resource](#resource), not under [Key](#key-section).
It declares the type of the resource, which is generally used for buffer types.
```ini
[ResourceLumineDressPosition]
type = Buffer
``` 

## filename

Only appears under [Resource](#resource). It uses a relative path to point to the storage location of the resource. It is unclear whether absolute paths are supported, but using absolute paths in this context of redistributable data wouldn't make much sense.
```ini
[ResourceLumineBodyDiffuse]
filename = .\LumineParts\LumineBodyDiffuse.dds
```

## format

Used for IB (Index Buffer) resources, specifies the size of a single index value. Full list: https://learn.microsoft.com/en-us/windows/win32/api/dxgiformat/ne-dxgiformat-dxgi_format
```ini
[ResourceLumineBodyIB]
format = DXGI_FORMAT_R32_UINT
```
<!-- TODO: Lacks full list of available formats and their proper use  -->
## stride
Used for VB (Vertex Buffer) resources, specifies the byte size of a single vertex's total data.
```ini
[ResourceLumineDress]
stride = 20
```

## data
Used for character strings, as of the time of writing this guide it is unknown if it can be modified on the fly or if it is read-only. It is also unknown if it can be used for other types of data.
```ini
[ResourceLumineDress]
data = "Just a string."
```

---