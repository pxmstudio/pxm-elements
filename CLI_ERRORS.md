# PixelMakers Elements CLI — Error Codes & Troubleshooting

This document lists common error messages and codes you may encounter when using the `pxm` CLI, along with explanations and suggested resolutions.

---

## Error: Not a valid component
**Message:**
```
Error: <component> is not a valid component. Available: accordion, tabs, ...
```
**Cause:**
- The component name you provided is not recognized.
**Resolution:**
- Use one of the valid component names listed in the error message.

---

## Error: Source file not found
**Message:**
```
Source file not found: src/<component>/index.ts
```
**Cause:**
- The source file for the requested component does not exist in the expected location.
**Resolution:**
- Check that the component exists in `src/<component>/index.ts` (or `.js` for JS projects).
- If you renamed or moved files, update your project structure accordingly.

---

## Error: Both .ts and .js files detected. Which project type do you want to use?
**Message:**
```
Both .ts and .js files detected. Which project type do you want to use?
```
**Cause:**
- The CLI found both TypeScript and JavaScript files in your `src/` directory and cannot determine which to use.
**Resolution:**
- Select the appropriate project type when prompted.
- Remove unnecessary files to avoid ambiguity in the future.

---

## Error: <file> already exists. Overwrite?
**Message:**
```
<file> already exists. Overwrite?
```
**Cause:**
- The destination file already exists and the CLI is prompting to avoid accidental overwrites.
**Resolution:**
- Confirm to overwrite, or use the `--force` flag to skip the prompt.
- If you do not want to overwrite, answer "no" to keep the existing file.

---

## Error: Failed to create directory / write file / read file
**Message:**
```
Failed to create directory <dir>: <error>
Failed to write destination file: <error>
Failed to read source file: <error>
```
**Cause:**
- File system permissions, missing directories, or other I/O errors.
**Resolution:**
- Check your file system permissions.
- Ensure the source files exist and are readable.
- Ensure you have write access to the destination directory.

---

## Error: Error detecting project type
**Message:**
```
Error detecting project type: <error>
```
**Cause:**
- The CLI could not determine if your project is TypeScript or JavaScript.
**Resolution:**
- Ensure your project has a `tsconfig.json` (for TypeScript) or `.js`/`.ts` files in `src/`.
- If prompted, select the correct type.

---

## General Troubleshooting
- Run with `--verbose` for more debug output.
- Run with `--quiet` to suppress non-error output.
- If you encounter an unknown error, please file an issue with the error message and your project structure. 