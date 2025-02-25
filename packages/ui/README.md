# Ui package

## Purpose of the Ui Package

This package is designed to:

- **Store and Share Tailwind Configuration**: Centralize Tailwind CSS configuration for consistent styling across projects.
- **Share Components Across the Monorepo**: Provide a library of reusable components to enhance development efficiency and maintain a unified design language.
- **Handle DSFR Tokenization for Tailwind**: Utilize a provided script to manage DSFR tokenization, ensuring seamless integration with Tailwind CSS.

## Generate Tailwind Tokens script

This script, `generate-tailwind-tokens.ts`, is used to extract CSS variables from a specified CSS file and generate a new CSS file containing only these variables. The main focus is on extracting color variables, which are essential for maintaining a consistent design system.

### Purpose

- **Extract CSS Variables**: The script reads a CSS file and extracts all variables, particularly those related to colors.
- **Generate CSS File**: It generates a new CSS file containing only the extracted variables, which can be used in projects that require consistent styling and theming.
- **Integration with Tailwind**: The generated tokens can be integrated with Tailwind CSS for a seamless design system.

### Usage

To run the script, execute the following command:

```bash
pnpm generate-tokens
```

Ensure that the input CSS file path is correctly specified in the script.
