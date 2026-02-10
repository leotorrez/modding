# OpenCode Configuration for 3dmigoto Documentation

This file defines how OpenCode should behave when working on this repository.

## Project Overview

This is a VitePress documentation website for **3dmigoto** and its forks (**XXMI**, **GIMI**, **WWMI**). The primary focus is on documenting the INI file syntax, commands, and features of 3dmigoto for mod creators and advanced users.

**Repository Reference**: https://github.com/SpectrumQT/XXMI-Libs-Package

## Content Guidelines

### Writing Style

1. **Minimal Emoji Usage**
   - Avoid using emojis in documentation and code comments
   - Only use emojis when explicitly requested by the user
   - Keep documentation professional and technical

2. **Reference the Source**
   - Always reference that features come from **3dmigoto/XXMI**
   - Link to the XXMI-Libs-Package repository when documenting technical features
   - Example: "This feature is part of 3dmigoto's core functionality"

3. **Preserve Existing Style**
   - Match the existing documentation tone: mix of technical accuracy with accessible explanations
   - Use the same formatting conventions as existing pages
   - Maintain consistency with current property tables, code blocks, and examples

4. **Game-Agnostic Documentation**
   - Keep `/docs` section general to 3dmigoto
   - Avoid game-specific content (GIMI, WWMI, etc.) in `/docs`
   - Game-specific information belongs in `/guides` section only
   - If a feature has game-specific behavior, note it briefly but don't detail it

5. **Code References**
   - Include references to file locations when relevant (e.g., `docs/index.md:105`)
   - Link to DirectX API documentation for low-level concepts
   - Reference 3dmigoto source code when explaining technical implementations

### Documentation Structure

Each documentation page in `/docs` should follow this structure:

1. **Brief Introduction** - Explain the concept in 1-2 paragraphs
2. **Syntax Overview** - Show basic syntax with a simple example
3. **Property/Command Reference** - Table or list of all properties
4. **Detailed Explanations** - In-depth coverage of each property/command
5. **Practical Examples** - Progress from simple to complex
6. **Common Pitfalls** - Warnings and gotchas (if applicable)
7. **See Also** - Cross-references to related documentation

### Code Examples

- All INI syntax examples must be valid 3dmigoto syntax
- Use consistent indentation (no tabs, use spaces)
- Add comments explaining what each line does
- Provide realistic, practical examples that users can adapt
- Format code blocks with proper syntax highlighting:
  ```ini
  ; Comments should explain the why, not the what
  [TextureOverrideExample]
  hash = abcd1234
  ```

### Technical Standards

- Verify all properties against the 3dmigoto source code
- Mark deprecated features clearly
- Include version information when features are version-specific
- Link to Microsoft DirectX documentation for DirectX-specific concepts
- Use correct DirectX terminology (e.g., "Shader Resource View" not "texture slot")

## Incremental Development Approach

### Priority Order

Work on documentation improvements in this order:

**Priority 1 - Critical Missing Content:**
1. Expressions and Functions (new file)
2. Expand Command-list.md (currently only 33 lines)
3. Expand Resource.md (missing many properties)
4. Draw and Dispatch Commands (expand draw-calls.md)

**Priority 2 - Expand Existing Pages:**
5. Expand Modifiers.md (missing several modifiers)
6. Expand Present.md (currently very brief)
7. CustomShader documentation (new or expand)
8. Resource Binding Commands documentation

**Priority 3 - Advanced Topics:**
9. Preset Section (new file)
10. Built-in Resources
11. Common Patterns and Examples
12. Special Commands

### Implementation Guidelines

- Complete one documentation page at a time
- Test examples before adding them to documentation
- Update navigation in `.vitepress/config/en.ts` when adding new pages
- Address TODO comments found in existing files
- Cross-reference related pages with links

## Translation Handling

- Focus on **English documentation only**
- Do not create or update translation files (ru, es, zh)
- Translations are handled separately by the project maintainers

## File Organization

### Working Directories

- **Documentation**: `D:\Proyectos\Coding\Website\docs\`
- **Guides** (not our focus): `D:\Proyectos\Coding\Website\guides\`
- **Config**: `D:\Proyectos\Coding\Website\.vitepress\config\`

### Key Files

- **English navigation**: `.vitepress/config/en.ts`
- **Shared config**: `.vitepress/config/shared.ts`
- **Main config**: `.vitepress/config/index.mts`

## Common Terminology

Use consistent terminology aligned with 3dmigoto:

- **Section** - INI section like `[TextureOverride]`
- **Property** - Key-value pair like `hash = abcd1234`
- **Command** - Executable operation like `run = CommandList`
- **Resource** - Custom resource defined in `[Resource*]` section
- **Override** - Either TextureOverride or ShaderOverride section
- **CommandList** - Section containing commands to execute
- **Variable** - User-defined variable starting with `$`
- **Parameter** - System parameter like `time`, `x0`, `y0`, etc.
- **IniParams** - Array of parameters accessible as `x0-x99`, `y0-y99`, `z0-z99`, `w0-w99`
- **Modifier** - Keyword that changes behavior: `pre`, `post`, `copy`, `reference`, `unless_null`

## Cross-References

When mentioning related concepts, link to the relevant documentation:

- Use relative links: `[Override](/docs/override.md)` or `[Resource](/docs/resource.md)`
- Link to specific sections when appropriate: `[handling](#handling)`
- Add "See also" sections at the bottom of pages

## TODOs and Incomplete Sections

Known TODO items to address:

1. `docs/index.md:105` - Add more detail about reserved words
2. `docs/resource.md:39` - Complete list of DXGI formats
3. `docs/command-list.md` - Expand with comprehensive command documentation
4. `docs/shader-override.md` - Contains duplicate content, needs cleanup

## Quality Checklist

Before considering a documentation page complete:

- [ ] Clear introduction explaining the concept
- [ ] Comprehensive property/command reference
- [ ] At least 2-3 practical examples
- [ ] Proper code formatting and syntax highlighting
- [ ] Cross-references to related pages
- [ ] No emojis (unless explicitly requested)
- [ ] Game-agnostic content (no GIMI/WWMI specifics)
- [ ] Valid 3dmigoto syntax in all examples
- [ ] Links to DirectX documentation where relevant

## Testing and Verification

When adding or updating documentation:

1. Verify property names against 3dmigoto source code
2. Test code examples for syntax validity
3. Check that links work correctly
4. Preview the page in the VitePress dev server
5. Ensure no broken cross-references

## Development Workflow

To preview changes:
```bash
npm run docs:dev
```

To build the site:
```bash
npm run docs:build
```

## Notes for OpenCode

- This is documentation work, not application development
- Focus on clarity, accuracy, and completeness
- Technical accuracy is more important than brevity
- When unsure about a feature, reference the 3dmigoto source code
- Ask the user for clarification before making assumptions about game-specific features
