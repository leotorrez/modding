
# Present

This section is executed at the beginning of each frame and is intended for code that needs to be continuously executed. It is commonly used for real-time calculations, such as switching appearances based on key inputs or various interactive effects.
```ini
[Present]
post $active = 0
```
Similar to [CommandList](#commandlist), it is an area for various operations. so it does not have fixed properties. However, it is generally not directly linked to [Resource](#resource) sections. Instead, it is typically linked to a CommandList, which then calls the Resource.
