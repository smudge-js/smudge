console.log("hello.");

let a = helloWorld("hi");
console.log(a);

function helloWorld(who: string) {
    console.log(`Hello, ${who}!!!`);
    throw("Testing Exception: Test source maps.");
}
