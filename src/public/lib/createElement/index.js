const createElement = require("./createElement");
module.exports = createElement(new DOMParser());

/* 
The reason we're able to rename makeCreateElement to createElement when importing is due to the nature of CommonJS module exports. In CommonJS, the name you use when requiring a module is independent of the name of the function or object that was exported.

Exporting: When you write module.exports = makeCreateElement;, you're exporting the makeCreateElement function. This function is assigned to the module.exports object, which is how CommonJS modules export functionalities.

Importing: When you import it in another file with const createElement = require("./createElement");, you're simply assigning the exported function to a local variable named createElement. The name createElement is entirely up to you and can be anything.
*/
