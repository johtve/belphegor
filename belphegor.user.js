// ==UserScript==
// @name         Belphegor - Devilry improved
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make IFI's Devilry a little less confusing by adding more colour coding.
// @author       Johann Dahmen Tveranger
// @match        https://devilry.ifi.uio.no/*
// @exclude	 https://devilry.ifi.uio.no/
// @grant        none
// ==/UserScript==

(function() {
	"use strict";

	console.log("Belphegor enabled");

	// Colours to be used for re-colouring, based on the status of the assignment
	// Keys are the assosciated class for each status
	const statusColors = {
		".devilry-core-groupstatus-waiting-for-deliveries": "#d9f00e",
		".devilry-core-groupstatus-waiting-for-feedback": "#51f516",
		".devilry-core-grade-passed": "#01911c",
	};

	// Applies some base css to the entire page to lay groundwork
	function setBaseCss() {
		const styleElement = document.createElement("style");
		const cssBaseRules = `
	       
	       /* Sub-div of the main assignment boxes. Where background color is originally set, reset it to easily let the parent decide color */
		ol.cradmin-legacy-listbuilder-list li .cradmin-legacy-listbuilder-itemvalue.cradmin-legacy-listbuilder-itemvalue-focusbox
		{
		    background-color: transparent !important;
		}
		
		`;
		styleElement.textContent = cssBaseRules;
		document.head.appendChild(styleElement);
	}

	// Returns all assignment elements on the page as an HTML collection
	function getAssignments() {
		// HTML collection of all assignment box elements (<a> tags)
		const assignmentCollection = document.getElementsByClassName(
			"cradmin-legacy-listbuilder-itemframe",
		);
		// console.log(assignmentCollection);
		return assignmentCollection;
	}

	// Recolours all given assignment elements (takes HTML collection)
	function recolorAssignments(assignments) {
		for (let i = 0; i < assignments.length; i++) {
			const assignment = assignments[i];

			// console.log("Assignment: " + assignment);
			for (let assignmentStatus in statusColors) {
				if (assignment.querySelector(assignmentStatus) !== null) {
					// Must use bracket notation because statusColors keys start with a period
					assignment.style.setProperty(
						"background-color",
						statusColors[assignmentStatus],
						"important",
					);
				}
			}
		}
	}

	setBaseCss();
	const assignments = getAssignments();
	recolorAssignments(assignments);
})();
