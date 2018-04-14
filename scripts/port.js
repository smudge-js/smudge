const fs = require('fs');

const src_directory = "sketches";
const dest_directory = "jam/sketches";


const files = fs.readdirSync(src_directory);

console.log("files", files);


files.forEach(copyFile);

function copyFile(file) {
    console.log("copy file", src_directory, file);
    const src_file = `${src_directory}/${file}`;
    const dest_file = `${dest_directory}/${file.replace(".ts", ".js")}`;

    let contents = fs.readFileSync(src_file).toString();
    contents = `\{\n${contents}\n\}`
    contents = contents.replace(/export /gm, '');
    contents = contents.replace(/^import {(.*)}.*;/gm, 'const {$1} = smudge;');

    fs.writeFileSync(dest_file, contents);

}