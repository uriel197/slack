const selector = "[data-ref], [data-child]";
const replaceNode = (childName, childElement) => (element) => {
  /* 1 */
  if (element.getAttribute("data-child") === childName) {
    element.parentNode.replaceChild(childElement, element);
  }
};
const makeCreateElement = (domParser) => {
  return (component) => {
    /* explanation */
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


    EXPLANATION OF makeCreateElement with Chat
    ==========================================

the following is  an example of how createElement processes data, in this case we are passing data from Chat.render():

1. component.render() Output
The Chat component's render method creates this HTML dynamically using its props:

<div class="chat__container">
  <ul>
    <li class="chat__li">
      <div>
        <img class="chat__img" src="alice.jpg" />
      </div>
      <div>
        <div>
          <span class="chat__username">Alice</span>
          <span class="chat__date">2024-11-23</span>
        </div>
        <div class="chat__text">Hello!</div>
      </div>
      <template data-child="menu-0"></template>
    </li>
    <li class="chat__li">
      <div>
        <img class="chat__img" src="bob.jpg" />
      </div>
      <div>
        <div>
          <span class="chat__username">Bob</span>
          <span class="chat__date">2024-11-24</span>
        </div>
        <div class="chat__text">Hi!</div>
      </div>
      <template data-child="menu-1"></template>
    </li>
  </ul>
  <div class="chat__typing">Someone is typing...</div>
</div>

2. children in component.children
The Chat component uses setChild in renderPosts() to define its children:

this.setChild(`menu-0`, new ChatMenu({ postKey: 0 }));
this.setChild(`menu-1`, new ChatMenu({ postKey: 1 }));

the Component prototype defines the setChild method as:
  setChild = (name, child) => {
    this.children[name] = createElement(child);
  };
This results in:

Chat.children = {
  "menu-0": createElement(new ChatMenu({ postKey: 0 })),
  "menu-1": createElement(new ChatMenu({ postKey: 1 })),
};

Each child corresponds to a <template> in the render() output.

3. Replacing <template> with Children
When createElement processes the rendered HTML:

const children = Object.keys(Chat.children);
What happens?

Chat.children is an object where the keys are the names of child components (e.g., "menu-0", "menu-1", etc.) and the values are their corresponding DOM nodes.
Object.keys(component.children) extracts an array of the keys.
children will be:

["menu-0", "menu-1"]

4. Query Elements
const elements = doc.querySelectorAll(selector);

The selector constant is "[data-ref], [data-child]".
This line selects all elements in doc with data-ref or data-child attributes which returns:
NodeList [
  <template data-child="menu-0"></template>,
  <template data-child="menu-1"></template>
]

5.  Process data-ref:
elements.forEach((element) => {
  const ref = element.getAttribute("data-ref");

For each element in elements, it checks if it has a data-ref attribute.
If it does, it adds that element to the component.refs object.
In the case of Chat.render() output No elements have a data-ref attribute.
So, component.refs remains empty

6: Replace Nodes
For each child component name in children (e.g., "menu-0"), it:
Looks up the corresponding DOM node in component.children[childName] (e.g., <ul class="chat__menu">...</ul>).
Calls replaceNode on every element in elements to replace matching data-child placeholders.

If the data-child attribute of an element matches the childName:
It replaces the placeholder <template> node with the actual DOM node.
In the case of Chat.render() output:

Before replacement:

<template data-child="menu-0"></template>

After replacement:
<ul class="chat__menu">
  <li ...></li>
  <li ...></li>
</ul>

return doc.body.firstChild;
What happens?

The doc.body.firstChild is returned, which is now a fully constructed DOM node for the Chat component.
In the case of Chat.render() output:

The returned node might look like:

<div class="chat__container">
  <ul>
    <li class="chat__li">
      ...
      <ul class="chat__menu">...</ul>
    </li>
    <li class="chat__li">
      ...
      <ul class="chat__menu">...</ul>
    </li>
  </ul>
  <div class="chat__typing">Someone is typing...</div>
</div>


ABOUT createElement(new ChatMenu({ postKey: 0 }))
=================================================
An instance of ChatMenu is passed to makeCreateElement(ChatMenu) where the return of ChatMenu.render is parsed into a DOM component:

<ul class="chat__menu">
  <li onclick="chat.openThreadAction(event, '0')" class="chat__menu-li chat__menu-li--chat"></li>
  <li onclick="chat.openMoreActions(event, '0')" class="chat__menu-li">&middot;&middot;&middot;</li>
</ul>

And since ChatMenu.render() doesn't include data-ref or data-child, the lines dealing with ChastMenu.children are skipped.

*/
