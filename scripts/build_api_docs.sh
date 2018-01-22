typedoc \
    --out api_doc/ \
    --mode modules \
    --exclude "**/sketches/**/*.ts" \
    --excludeExternals \
    --excludeNotExported \
    --excludePrivate \
    --stripInternal \
    --entryPoint \"pbr\" \
    ./src/

# --json api_doc/docs.json \
# --ignoreCompilerErrors
# --theme minimal \