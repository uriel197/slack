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
    delete component.children;
    return doc.body.firstChild;
  };
};
module.exports = makeCreateElement;

/*
    =======================================
        COMMENTS - COMMENTS - COMMENTS
    =======================================

*** 1: Explanations/createElement

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

*** 3: Explanations/createElement.dataset

*/
