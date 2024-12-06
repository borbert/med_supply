#!/bin/bash

# Function to convert a TypeScript file to JavaScript
convert_file() {
    local file=$1
    local js_file=${file%.ts}
    js_file=${js_file%.tsx}.js

    # Copy the file to .js extension
    cp "$file" "$js_file"

    # Remove TypeScript syntax
    sed -i '' 's/: [A-Za-z<>[\]|&{}]*//g' "$js_file"  # Remove type annotations
    sed -i '' 's/export type.*//g' "$js_file"          # Remove type exports
    sed -i '' 's/import type.*//g' "$js_file"          # Remove type imports
    sed -i '' 's/interface.*{.*}//g' "$js_file"        # Remove interfaces
    sed -i '' 's/<[^>]*>//g' "$js_file"                # Remove generic type parameters

    # Remove the original TypeScript file
    rm "$file"
}

# Convert all TypeScript files
find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
    convert_file "$file"
done
