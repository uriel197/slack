const selector = "[data-ref], [data-child]";
const replaceNode = (childName, childElement) => (element) => {
  /* 1 */
  if (element.getAttribute("data-child") === childName) {
    element.parentNode.replaceChild(childElement, element);
  }
};
const makeCreateElement = (domParser) => {
  return (component) => {
    const doc = domParser.parseFromString(
      component.render(),
      "text/html"
    ); /* 2 */
    const children = Object.keys(component.children);
    const elements = doc.querySelectorAll(selector);
    elements.forEach((element) => {
      const ref = element.getAttribute("data-ref");
      /* 3 */
      if (ref) {
        component.refs[ref] = element;
      }
    });
    children.forEach((childName) => {
      const childElement = component.children[childName];
      elements.forEach(replaceNode(childName, childElement));
    });
    return doc.body.firstChild;
  };
};
module.exports = makeCreateElement;

/*
    =======================================
        COMMENTS - COMMENTS - COMMENTS
    =======================================

    *** Note: This module is designed to create and process DOM elements dynamically. It ensures that child components and references (e.g., data-ref, data-child) are handled automatically.

*** 1: This function, replaceNode, is designed to replace certain elements within the DOM based on a specific attribute (data-child). 

replaceNode is a higher-order function that takes two parameters: childName and childElement:

childName: This is the value that the data-child attribute must match.

childElement: This is the new element that will replace the old one.

Returned Function: The outer function returns another function that takes a single parameter "element".

Attribute Check and Replacement:

The inner function checks if the element has an attribute data-child with a value equal to childName.

If the condition is true, the replaceChild method of the element's parent node is called to replace the element with childElement.

Purpose
The purpose of this function is to iterate through a collection of elements and replace those that have a specific data-child attribute with a new element. Even though our current HTML doesn't have any elements with a data-child attribute, this function is a reusable piece of code meant to handle future scenarios where such elements might exist.


*** 2: DIFFERENCE BETWEEN DOCUMENT AND DOC:

The document object is a built-in object in JavaScript that provides access to the DOM of the web page. It represents the entire HTML or XML document that is being displayed.
When you use document.querySelectorAll(selector), you are directly accessing the DOM of the current web page to find elements that match the given CSS selector.

The doc variable, in our context, is referring to a Document object created by a DOMParser. It represents a specific DOM document that may not be the main document of the web page.
When you use doc.querySelectorAll(selector), you are accessing elements within the DOM of the doc variable, which are different from the main document of the web page.

render() : render is defined in ChannelsList.
createElement is initialized with a DOMParser instance and is set up to parse the HTML string returned by the render method of the component.. 
<li data-ref="${channelName}" class="${className}">
    <a onclick="channelsList.loadChannel(event, '${channelName}')" class="sidebar__link">
        <span class="sidebar__hash">#</span> ${channelName}
    </a>
</li>

*** 3: HTML dataset- 

Accessing values
Attributes can be set and read by the camelCase name/key as an object property of the dataset: element.dataset.keyname.
Attributes can also be set and read using bracket syntax: element.dataset['keyname'].
The in operator can check if a given attribute exists: 'keyname' in element.dataset. Note that this will walk the prototype chain of dataset and may be unsafe if you have external code that may pollute the prototype chain. Several alternatives exist, such as Object.hasOwn(element.dataset, 'keyname'), or just checking if element.dataset.keyname !== undefined.
Setting values
When the attribute is set, its value is always converted to a string. For example: element.dataset.example = null is converted into data-example="null".

To remove an attribute, you can use the delete operator: delete element.dataset.keyname.

Value
A DOMStringMap.

Examples

<div id="user" data-id="1234567890" data-user="carinaanand" data-date-of-birth>
  Carina Anand
</div>

const el = document.querySelector("#user");

el.id === 'user'
el.dataset.id === '1234567890'
el.dataset.user === 'carinaanand'
el.dataset.dateOfBirth === ''

set a data attribute:
el.dataset.dateOfBirth = "1960-10-03";

Result on JS: 
el.dataset.dateOfBirth === '1960-10-03';

Result on HTML: 
<div id="user" data-id="1234567890" data-user="carinaanand" data-date-of-birth="1960-10-03">Carina Anand</div>

delete el.dataset.dateOfBirth;
Result on JS:
el.dataset.dateOfBirth === undefined;

Result on HTML: 
<div id="user" data-id="1234567890" data-user="carinaanand">Carina Anand</div>

if (el.dataset.someDataAttr === undefined) {
  el.dataset.someDataAttr = "mydata";
}

Result on JS: 
'someDataAttr' in el.dataset === true;

Result on HTML: 
<div id="user" data-id="1234567890" data-user="carinaanand" data-some-data-attr="mydata">Carina Anand</div>

*/
