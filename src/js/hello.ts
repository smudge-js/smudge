export interface Person {
    firstName: string;
    lastName: string;
}


export function sayHello(who: Person): string {
    let message = `Hello, ${who.firstName}!`;
    console.log(message);
    return message;
}


// import {sayHello} from "./js/hello.ts"
//
// let testUser = {
//     firstName: "TypeScripty",
//     lastName: "Language"
// }
//
// var p = document.createElement("p");
// p.innerHTML = sayHello(testUser);
// document.body.appendChild(p);
