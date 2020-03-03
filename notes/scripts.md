```bash
# build a visualization of the class dependency graph
depcruise --exclude "node_modules" --output-type dot src | dot -T svg > dependencygraph.svg
```
