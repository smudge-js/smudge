
let myColor = {
    red: 1.0,
    green: 0.5,
    blue: 0.0
}

// type ChannelName = "red" | "green" | "blue";
// const ChannelNames = {
//     red: <ChannelName>"red",
//     green: <ChannelName>"green",
//     blue: <ChannelName>"blue"
// }

const ChannelNames = strEnum(['red','green','blue']);
type ChannelName = keyof typeof ChannelNames;



let targetChannel:ChannelName = ChannelNames.red;
myColor[targetChannel];




// from https://basarat.gitbooks.io/typescript/docs/types/literal-types.html

function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}





// let sample: Direction;

// sample = "Red";

// let myObj = {
//     North: 1.0,
//     South: 1.0,
//     East: 1.0,
//     West: 1.0
// }

// myObj[sample];




// class Material {
//     public red = 0;
//     public green = 0;
//     public blue = 0;

//     public alpha = 0;

//     static getChannelType(mat: Material, key: ChannelName):number {
//         return mat[key];
//     }

//     static getChannelKey(mat: Material, key: keyof Material):number {
//         return mat[key];
//     }
//     // [key: MatName]: number;
// }

// enum GroupA {
//     cat,
//     dog
// }

// enum GroupB {
//     apple,
//     pear
// }

// let fruit:GroupB;
// fruit = GroupB.apple;
// fruit = GroupA.cat;
// fruit = 3;






// class ChannelNames {
//     static red: ChannelName = "red";
//     // static red: "red"; // also works
//     static green: ChannelName = "green";
//     static blue: ChannelName = "blue";
// }


// // below tightens up above
// interface TestNames {
//     red: "red";
// }
// let TestNames:TestNames;






// // enum + type? wouldn't work because types are structural not semantic, basically enums are already a type, just not strictly enforced (enforced structurally)



// // winning solution should
// // create a type that only allows assignment from set of strings
// // support auto complete
// // allow [] indexing into object that has keys for each string

// // check out enum here:
// // https://basarat.gitbooks.io/typescript/docs/types/literal-types.html

// // below is getting pretty funny but i wonder if it would be macroable?
// // does const ing the below shorten it up? doesn't work because computed object keys only work for variables, not literals
// // let TestNames = {
// //     red: <"red"> "red"
// // }

// // is there a way to print debug info?

// type TestName = keyof typeof TestNames;

// let t:TestName;
// t = "red";
// // t = "silver";
// t = TestNames.red;



// let myMat = new Material();
// myMat.red = .25;
// myMat.green = .5;
// myMat.blue = .75;

// var targetChannel:ChannelName;
// targetChannel = ChannelNames.green;
// // targetChannel = ChannelNames.silver; // doesn't exist
// // targetChannel = "silver"; // not assignable
// // targetChannel = "alpha"; // not assignable

// let x = Material.getChannelType(myMat, targetChannel);
// x = myMat[targetChannel]; // this is probably good enough
// console.log(x);

// var targetChannel2: keyof Material;
// targetChannel2 = "red";
// targetChannel2 = "alpha"; // is assignable, all keys count in this plan
// //targetChannel2 = "silver"; // not assignable
// x = Material.getChannelKey(myMat, targetChannel2);

// // type Options = "hello" | "world";
// // let OptionsNames = {
// //     hello: <"hello"> "hello",
// //     world: <"world"> "world"
// // }
// // var foo: Options;
// // foo = "hello"; // Okay
// // // foo = "asdf"; // Error!
// // foo = OptionsNames.world;
// // foo = OptionsNames.hello;


// // type channelValue = number;

// // export class Test {
// //     public a: number = 0;
// //     public b: channelValue = 0;
// //     public c: channelValue = 0;
// // }



// // enum ChannelName {
// //     red ,
// //     green ,
// //     blue

// // }