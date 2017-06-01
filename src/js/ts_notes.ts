export interface Person {
    firstName: string;
    lastName: string;
}


export function sayHello(who: Person): string {
    let message = `Hello, ${who.firstName}!`;
    console.log(message);
    return message;
}