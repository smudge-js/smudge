// import { color } from "./logging";

// test("tests color argument mapping", () => {
//   expect(color()).toBe(undefined);
// });

// function test_color() {
//   console.log("no param");
//   assert_equal(color(), undefined);

//   console.log("single number");
//   assert_equal(color(undefined), undefined);
//   assert_equal(color(1), 1);

//   console.log("array");
//   assert_equal(color([1, 2, 3, 4]), [1, 2, 3, 4]);
//   assert_equal(color([1, 2, 3]), [1, 2, 3]);
//   assert_equal(color([1, 2]), [1, 2]);
//   assert_equal(color([1]), [1]);

//   console.log("multiple number");
//   assert_equal(color(1, 2, 3, 4), [1, 2, 3, 4]);
//   assert_equal(color(1, 2, 3), [1, 2, 3]);
//   assert_equal(color(1, 2), [1, 2]);

//   console.log("leading undefined");
//   assert_equal(color(undefined, 2, 3, 4), [undefined, 2, 3, 4]);
//   assert_equal(color(undefined, 2, 3), [undefined, 2, 3]);
//   assert_equal(color(undefined, 2), [undefined, 2]);

//   console.log("trailing undefined");
//   assert_equal(color(1, 2, 3, undefined), [1, 2, 3, undefined]);
//   assert_equal(color(undefined, undefined), [undefined, undefined]);
// }

// function assert_equal(a, b) {
//   let a_string = JSON.stringify(a);
//   let b_string = JSON.stringify(b);

//   if (a_string === b_string) {
//     console.log("pass", a_string, "===", b_string);
//   } else {
//     console.log("fail", a_string, "not ===", b_string);
//   }
// }
