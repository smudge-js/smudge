typedoc \
    --out api_doc/ \
    --mode file \
    --exclude "**/+(sketches|private|tests)/**/*.ts" \
    --excludeExternals \
    --excludeNotExported \
    --excludePrivate \
    --stripInternal \
    --theme minimal \
    --json api_doc/docs.json \
    ./src

# --json api_doc/docs.json \
# --ignoreCompilerErrors
# --theme minimal \
# --json api_doc/docs.json \
# --entryPoint MainClass \
#  --theme ./doc_theme \