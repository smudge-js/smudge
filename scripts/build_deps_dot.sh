depcruise \
    --exclude "(node_modules|sketches|tests|css|html|glsl|util|!private)" \
    --output-type dot \
    --output-to api_doc/deps.dot \
    sketches/basic.ts
    # src/
    # src/js/index.ts

cat ./api_doc/deps.dot | dot -T svg > api_doc/deps.svg