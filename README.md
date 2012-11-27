# ObjectQuery v.1.1

## Introduction

ObjectQuery is a small and simple library for handling datasets in JavaScript. It aims to simplify dataset handling through an intuitive, chainable API.

The main goal of this project is to create a library that is both fast and versatile. The API methods are benchmarked extensively and are proven to be reasonably fast without being overly complicated or incompatible.

If you're actually planning on replacing a noSQL database with a pure JavaScript implementation, you're better off with [TaffyDB](http://www.taffydb.com/). It's a lot more robust solution and has tons of fancy features.


## Usage

ObjectQuery is designed to work with arrays of objects. This means that the data that it handles is pretty much like a database table. This is why OQ behaves like a noSQL database interface. At the moment OQ supports the following noSQL-like features:

- Filtering: filter data using comparator functions
- Ordering: order data by a single property
- Distinct values: find distinct property values

Where possible, the API is chainable. This means that the API methods can be combined together to create tighter and more readable code. However, this only covers methods that return new `ObjectQueryCollection` objects. For example, the `distinct()` method returns an `Array` object which cannot be used as a base for ObjectQuery operations.

### Usage example

	var data = [
		{name: 'Tupu', age: 3},
		{name: 'Hupu', age: 6},
		{name: 'Tupu', age: 12}
	];
	
	var filteredData = $oq(data).filter('name', '===', 'Tupu').filter('age', '>>', [3,6,12]).toArray();

Here, the `filteredData` variable is set to an array containing the both Tupu objects. The `$oq(data)` part creates the initial `ObjectQueryCollection` object. The first `filter` part filters the dataset using the `strictEquals` comparator function. The `filter` method takes three parameters: property name, comparator function or operator and value. The dataset is then iterated over and on each iteration the comparator function is used to check if the object should pass the filter or not. In this case the `strictEquals` function checks if the property matches the test value exactly. After the iteration a new `ObjectQueryCollection` object containing the objects that pass the test is created and returned. The second `filter` does pretty much the same thing but it uses the `inArray` comparator function to check if the objects' age property values are found in the given array. After the filtering, the remaining dataset is converted to an array using the `toArray` method.


## API reference

### Exported objects

By default, ObjectQuery exposes two objects: `$oq` and `$oqc`. The `$oq` object is a factory function that creates a new `ObjectQueryCollection` object. The `$oqc` object is a wrapper for the default comparator functions.


#### The `$oq` factory function: `$oq(Array source)`

##### Parameters:

1. source [required] : An array of objects used as the source for the dataset.

##### Returns

A new ObjectQueryCollection object.


#### The `$oqc` comparator function wrapper

##### Methods (operators):

- equals ('=' | '==') : returns true, if param1 == param2, else returns false
- strictEquals ('===') : returns true, if param1 === param2, else returns false
- greaterThan ('>') : returns true, if param1 > param2, else returns false
- greaterThanOrEquals ('>=') : returns true, if param1 >= param2, else returns false
- lessThan ('<') : returns true, if param1 < param2, else returns false
- lessThanOrEquals ('<=') : returns true, if param1 <= param2, else returns false
- not ('!' | '!=') : returns true, if param1 != param2, else returns false
- strictNot ('!==') : returns true, if param1 !== param2, else returns false
- inArray ('>>') : returns true, if param1 is found in array given as param2, else returns false. Uses strict comparison operator. (===)
- arrayContains ('<<') : returns true, if the array given as param1 contains the value given as param2, else returns false. Uses strict comparison operator. (===)

Use the strict variants whenever possible.



### ObjectQueryCollection objects

The `$oq` factory function returns ObjectQueryCollection objects that actually do all the heavy lifting in ObjectQuery. 

#### `filter(String property, Function|String comparator, Object value)`

##### Parameters
1. property [required] : The name of the property by which the data is filtered.
2. comparator [required] : The function or operator that is used to compare the properties to the value.
3. value [required] : The value to which the properties are compared using the comparator function.

##### Returns:

A new ObjectQueryCollection object containing the filtered objects.



#### `distinct(String property)`

##### Parameters:

1. property [required] : The name of the property from which the distinct values are extracted.

##### Returns:

An array of distinct values.



#### `orderBy(String property)`

##### Parameters:

1. property [required] : The name of the property by which the objects are sorted.

##### Returns:

A new ObjectQueryCollection object. Unlike other ObjectQueryCollection methods this affects the original array that was used to create the ObjectQueryCollection instance.



#### `toArray()`

##### Returns:

The array that is held in the `items` property of the ObjectQueryCollection instance.



## Information

The ObjectQuery project is maintained by Kimmo Tapala / Verkkojulkaisut Oy - Network Publications Ltd. You can use ObjectQuery however you like. There are no licenses or copyrights to worry about.



## Version history

### Version 1.1
_2012-11-27_

- Coding style changes
- Ditched the `benchmarks.html` document
- Introduced version history


### Version 1.1b
_2012-02-22_

- Operator strings
- Speed improvements
- Revised testing document


### Version 1.0
_2011-06-07_

First release version. Virtually unchanged from beta.


### Version 1.0b
_2011-05-27_

First beta version.
