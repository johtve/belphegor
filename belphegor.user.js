
// ==UserScript==
// @name         Belhpegor - Devilry improved
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make IFI's Devilry less confusing by adding more colours that aren't green.
// @author       Johann Dahmen Tveranger
// @match        https://devilry.ifi.uio.no/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add your custom styles here
    const customStyles = `
        body {
            background-color: #f0f0f0 !important;
        }

        h1 {
            color: red !important;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
})();
