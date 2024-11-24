const createElement = require("../../lib/createElement"); // createElement: This utility is responsible for converting the string template generated by the Header component's render() method into a real DOM node.
const Header = require("./Headers");
const headerElement = document.querySelector("[data-js=header]");
// Selects the current placeholder element in the DOM that is marked with the attribute data-js="header". This placeholder will later be replaced with the rendered Header component.

const header = new Header();
// Instantiates the Header class, creating a new Header component. ** 1 **

const headerNode = createElement(header);
window.header = header; // Assigns the Header instance to the global window object so it can be accessed in other scripts or by inline event handlers in the rendered HTML. For example, the form's onsubmit attribute (header.onSearch(event)) uses this global reference.
headerElement.parentNode.replaceChild(headerNode, headerElement); // Replaces the placeholder element (headerElement) with the newly created headerNode in the DOM. This ensures that the dynamically created Header component is now part of the DOM.

/*

    ==================================
            COMMENTS - COMMENTS
    ==================================

*** 1: During this initialization:
The constructor of Header sets up a subscriber for state changes using this.setSubscriber("header", this.onEvent).
The Header component becomes ready to listen for specific events (e.g., SET_SELECTED_CHANNEL) and update its DOM dynamically when the state changes.

    createElement step by step:
    ==========================
To understand how the createElement() function operates with the Header component, let's replace the parameters with real arguments derived from the Header component:

1) The component argument is an instance of the Header class therefore:

const makeCreateElement = (domParser) => {
  return (header) => {
    const doc = domParser.parseFromString(
      header.render(),
      "text/html"
    );

which returns:
<header class="header">
  <h1 class="header__title" data-ref="h1">[Selected Channel]</h1>
  <form onsubmit="header.onSearch(event)">
    <input class="header__search" type="text" placeholder="Search" />
  </form>
</header>

2) Since the header component is initialized as an empty object, then:
const children = Object.keys(component.children);
therefore: children = {};
explanation below.

3) The selector matches elements with data-ref or data-child attributes. In this case:
const elements = doc.querySelectorAll("[data-ref], [data-child]");

For the Header component, only the <h1> element matches:

<h1 class="header__title" data-ref="h1">[Selected Channel]</h1> therefore:
elements = <h1>

4) since there is only 1 element that matches data-ref, then:
elements.forEach((h1) => {
      const ref = h1.getAttribute("data-ref");
      if (ref) {
        header.refs[ref] = element;
      }

therefore:
    header.refs = {
  h1: <h1 class="header__title" data-ref="h1">[Selected Channel]</h1>
};

5) children
The children array is obtained from component.children. For the Header component, since no children components are added, this is empty:

const children = Object.keys(header.children); // []
Thus, the replaceNode logic is skipped, as there are no child elements with data-child attributes.

6) Return the Processed Node
Finally, the function returns the processed DOM node:

return doc.body.firstChild;
For the Header component, this is:

<header class="header">
  <h1 class="header__title" data-ref="h1">[Selected Channel]</h1>
  <form onsubmit="header.onSearch(event)">
    <input class="header__search" type="text" placeholder="Search" />
  </form>
</header>

        question:
        =========
you say that the component has no children but in the begining of the function, the component "header" in our case, is parsed and then the next line of code is:
const children = Object.keys(component.children);
since the header has an h1 and a form, arent these its children?

In the createElement() function, component.children is explicitly referenced as part of the component instance (e.g., header.children), which means it refers to a property that must be manually defined "by the developer as part of the component's structure" within the Header class. It does not automatically include all DOM elements inside the component's rendered HTML.
since the header component extends the Component Class, then we see there that this.children = {} and since Every Component instance (and by inheritance, every Header instance) starts with this.children as an empty object.
This property is designed to hold child components that you explicitly add, typically in the form:

this.children = {
  childName: new ChildComponent(),
};

then component.children returns {}.

What About the <h1> and <form>?
The <h1> and <form> are part of the rendered DOM, but they are not explicitly tracked as "children" in the component.children object. Instead, they:

Exist in the template returned by render().
Are processed by the createElement() function if they include attributes like data-ref.
For instance:

The <h1> has a data-ref attribute, so it is added to component.refs.
The <form> is just static HTML and is not processed further.


*/
