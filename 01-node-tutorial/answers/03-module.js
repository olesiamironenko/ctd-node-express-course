const names = require("./04-names");
const greeting = require("./05-utils");

greeting(names.bob);
greeting(names.lily);
greeting(names.ted);
greeting(names.laura);

const data = require("./06-alternative-flavor");
console.log(data);
console.log(data.foodItem);
console.log(data.foodItem.type);

require("./07-mind-grenade");

require("./08-os-module");

require("./09-path-module");
