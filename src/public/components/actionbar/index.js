const Actionbar = require("./Actionbar");
const createElement = require("../../lib/createElement");
const actionbarElement = document.querySelector("[data-js=actionbar]");
const actionbar = new Actionbar();
window.actionbar = actionbar;
const actionbarNode = createElement(actionbar);
actionbarElement.parentNode.replaceChild(actionbarNode, actionbarElement);

/*
        =============================================
            COMMENTS - COMMENTS - COMMENTS
        =============================================
        
This will render what render() returns but it is set to display none by default so it wont show when the page first renders, yhat is why if you look for element with data-js attribute you will not find it, it appears in the index.html but as soon as the page renders it is replaced by the return of render().

*/
