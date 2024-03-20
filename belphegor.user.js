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




	/** Returns true if the given HTML element contains an element with the given selector, otherwise false */
	function elementHasSelector(element, selector) {
		return (element.querySelector(selector) !== null);
	}

	/** Returns true if all function evaluate to true for the given object, else false */
	function checkAllConditions(obj, conditionList) {
		for (const conditionFunc of conditionList) {
			if (conditionFunc(obj) === false) {
				console.log("Condition failed: " + conditionFunc.toString());
				return false;
			}
		}
		console.log("All conditions passed" + conditionList.toString() + " for object: " + obj);
		return true;
	}





	const colorCodes = {
		"orange": "#fa7202",
		"yellow": "#d9f00e",
		"lightGreen": "#51f516",
		"darkGreen": "#01911c",
		"red": "#b30707",
	};


	// Statuses for assignments. Conditions is list of arrow functions which all need to return true for the assignment object in order for it to qualify
	// as that satus. Color is the colour code associated with that status.
	const assignmentStatuses = {
		"waitingForDeliveries_NoFilesDelivered": {
			"conditions": [
				(obj) => elementHasSelector(obj, ".devilry-core-groupstatus-waiting-for-deliveries"),
				(obj) => {
					console.log(obj.querySelector(".devilry-core-comment-summary-studentfiles").textContent);
					obj.querySelector(".devilry-core-comment-summary-studentfiles").textContent.includes("0")
				},
			],
			"color": colorCodes.orange,
		},

		"waitingForDeliveries": {
			"conditions": [
				(obj) => elementHasSelector(obj, ".devilry-core-groupstatus-waiting-for-deliveries"),
			],
			"color": colorCodes.yellow,
		},
		"waitingForFeedback": {
			"conditions": [
				(obj) => elementHasSelector(obj, ".devilry-core-groupstatus-waiting-for-feedback"),
			],
			"color": colorCodes.lightGreen,
		},
		"passed": {
			"conditions": [
				(obj) => elementHasSelector(obj, ".devilry-core-grade-passed"),
			],
			"color": colorCodes.darkGreen,
		},
		"failed": {
			"conditions": [
				(obj) => elementHasSelector(obj, ".devily-core-grade-failed"),
			],
			"color": colorCodes.red
		}
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
		/*Make assignment name, "grade passed" text, and comment summary have black text*/
		.devilry-body-student 
		a.cradmin-legacy-listbuilder-itemframe-link 
		.cradmin-legacy-listbuilder-itemvalue.cradmin-legacy-listbuilder-itemvalue-focusbox.cradmin-legacy-listbuilder-itemvalue-titledescription
		.cradmin-legacy-listbuilder-itemvalue-titledescription-title,
		.devilry-cradmin-groupitemvalue .devilry-cradmin-groupitemvalue-grade .devilry-core-grade-passed,
ol.cradmin-legacy-listbuilder-list p:last-child, ol.cradmin-legacy-listbuilder-list pre:last-child, ol.cradmin-legacy-listbuilder-list table:last-child, ol.cradmin-legacy-listbuilder-list form:last-child, ol.cradmin-legacy-listbuilder-list h2:last-child, ol.cradmin-legacy-listbuilder-list h3:last-child
		{
			color: black !important;
		}
		
		`;
		styleElement.textContent = cssBaseRules;
		document.head.appendChild(styleElement);
	}

	// Returns all assignment elements on the page as an HTML collection
	function getAssignments() {
		// HTML collection of all assignment box elements (<a> tags)
		const assignmentCollection = document.getElementsByClassName("cradmin-legacy-listbuilder-itemframe");
		// console.log(assignmentCollection);
		return assignmentCollection;
	}


	function reColorAssignment(assignment) {
		for (const assignmentStatus in assignmentStatuses) {
			// console.log(assignmentStatus);
			if (checkAllConditions(assignment, assignmentStatuses[assignmentStatus]["conditions"])) {
				// console.log("THING GOT COLOURED WOOOO");
				assignment.style.setProperty(
					"background-color",
					assignmentStatuses[assignmentStatus]["color"],
					"important",
				);
				return;
			}
		}
	}

	// Recolours all given assignment elements (takes HTML collection)
	function recolorAllAssignments(assignments) {
		for (let i = 0; i < assignments.length; i++) {
			const assignment = assignments[i];
			reColorAssignment(assignment);
		}
	}

	setBaseCss();
	const assignments = getAssignments();
	recolorAllAssignments(assignments);



})();
