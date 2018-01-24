typedoc \
    --out api_doc/ \
    --mode file \
    --exclude "**/sketches/**/*.ts" \
    --excludeExternals \
    --excludeNotExported \
    --excludePrivate \
    --stripInternal \
    --theme minimal \
    ./src

# --json api_doc/docs.json \
# --ignoreCompilerErrors
# --theme minimal \
# --json api_doc/docs.json \
# --entryPoint MainClass \
#  --theme ./doc_theme \