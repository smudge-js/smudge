depcruise \
    --exclude "(node_modules|sketches|tests|css|glsl)" \
    --output-type dot \
    --output-to api_doc/deps.dot \
    sketches/basic.ts
    # src/js/index.ts

cat ./api_doc/deps.dot | dot -T svg > api_doc/deps.svg