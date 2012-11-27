/**
 * ObjectQuery v.1.1
 * 2012 Kimmo Tapala / Verkkojulkaisut - Network Publications Ltd.
 * 
 * ObjectQuery is a simple library for handling datasets. By default, it
 * exposes itself as two variables in the global namespace:
 * 	
 * 	- $oq
 * 		- Generator function that takes a data array as a parameter and
 * 		returns an ObjectQueryCollection object.
 * 	
 * 	- $oqc
 * 		- An object that wraps the default comparator functions.
 * 
 * You can change these variable names and namespace by modifying the last
 * line of this file. The parameters in order are:
 * 	- scope (object)
 * 	- generator function (string)
 * 	- comparator wrapper (string)
 * 	
 * NO COPYRIGHT
 * NO LICENSE
 * GET CODING
 */
;(function(scope, main, comp){
	"use strict";
	
	// ObjectQueryCollection constructor
	function ObjectQueryCollection(arr){
		this.items = arr;
	};
	
	
	/**
	 * Setup.
	 * 
	 * Map a shorthand to the class prototype and comparator functions to
	 * operator strings.
	 */
	var p = ObjectQueryCollection.prototype;
	
	p.filterMap = [
		{operator: '===', fn: 'strictEquals'},
		{operator: '==', fn: 'equals'},
		{operator: '=', fn: 'equals'},
		{operator: '>', fn: 'greaterThan'},
		{operator: '>=', fn: 'greaterThanOrEquals'},
		{operator: '<', fn: 'lessThan'},
		{operator: '<=', fn: 'lessThanOrEquals'},
		{operator: '!', fn: 'not'},
		{operator: '!=', fn: 'not'},
		{operator: '!==', fn: 'strictNot'},
		{operator: '>>', fn: 'inArray'},
		{operator: '<<', fn: 'arrayContains'}
	];
	
	
	/**
	 * Filters the current dataset using a filtering function.
	 * 
	 * This function DOES NOT modify the original array object.
	 * 
	 * @param  string          property Property name. ("column")
	 * @param  string|function filter   Comparator operator or filtering function.
	 * @param  mixed           value    Value used by the comparator function.
	 * 
	 * @return object                   A fresh ObjectQueryCollection object.
	 */
	p.filter = function(property, filter, value){
		var items = this.items,
			len = items.length,
			result = [],
			filterFn = (typeof(filter) === 'function') ? filter : this.getFilter(filter);
			
		for(var i = len; i--;){
			var item = items[i];
			if(filterFn(item[property], value)){
				result.push(item);
			}
		}
		
		return new ObjectQueryCollection(result.reverse());
	};
	
	
	/**
	 * Gets distinct property values from the dataset.
	 * 
	 * This function is highly inefficient as it uses the inArray comparator
	 * function. This function DOES NOT modify the original array object.
	 * 
	 * @param  string property Property name. ("column")
	 * 
	 * @return array           An array of distinct values.
	 */
	p.distinct = function(property){
		var items = this.items,
			inArray = scope[comp].inArray,
			distinctValues = [];
		
		for(var i = items.length; i--;){
			if(!inArray(items[i][property], distinctValues)){
				distinctValues.push(items[i][property]);
			}
		}
			
		return distinctValues;	
	};
	
	
	/**
	 * Orders the dataset by a property.
	 *
	 * This function DOES modify the original array object.
	 *   
	 * @param  string property Property name. ("column")
	 * 
	 * @return object          This object for chaining.
	 */
	p.orderBy = function(property){
		var items = this.items;
		
		items.sort((function(property){
			return function(a, b){
				var aprop = a[property],
					bprop = b[property];
				return ((aprop > bprop) ? 1 : ((aprop < bprop) ? -1 : 0));
			}
		})(property));
		
		return this;
	};
	
	
	/**
	 * Returns the item array.
	 * 
	 * @return array The current dataset. 
	 */
	p.toArray = function(){
		return this.items;
	};
	
	
	/**
	 * Gets a comparator function matching the operator string.
	 * 
	 * @param  string filter Operator string.
	 * 
	 * @return function      Comparator function.
	 */
	p.getFilter = function(filter){
		if(typeof(filter) === 'string'){
			for(var i = this.filterMap.length; i--;){
				if(this.filterMap[i].operator === filter){
					return scope[comp][this.filterMap[i].fn];
				}
			}
		}
		
		return scope[comp].equals;
	};
	
	
	
	
	
	
	
	/**
	 * Export variables.
	 */
	
	
	// The $oq function
	scope[main] = function(arr){
		return new ObjectQueryCollection(arr);
	};
	
	
	/**
	 * The default comparator functions
	 * 
	 * Please note that the inArray and arrayContains comparators are highly inefficient
	 * and are not well suited for large datasets.
	 * 
	 * The strict variants should be used whenever possible.
	 */
	scope[comp] = {
		equals: function(a, b){return (a == b);},
		strictEquals: function(a, b){return (a === b);},
		greaterThan: function(a, b){return (a > b);},
		greaterThanOrEquals: function(a, b){return (a >= b);},
		lessThan: function(a, b){return (a < b);},
		lessThanOrEquals: function(a, b){return (a <= b);},
		not: function(a, b){return (a != b);},
		strictNot: function(a, b){return (a !== b);},
		
		// These are actually quite a lot faster than using Array.indexOf()
		inArray: function(a, b){
			for(var i = b.length; i--;){
				if(a === b[i]){
					return true;
				}
			}
			return false;
		},
		arrayContains: function(a, b){
			for(var i = a.length; i--;){
				if(b === a[i]){
					return true;
				}
			}
			return false;
		}
	};
})(this, "$oq", "$oqc");
