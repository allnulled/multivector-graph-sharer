```js
sumatory_first_array = function(list) {
    return list.reduce(sum);
}
sumatory_all_parameters = function(...list) {
    return list.reduce(sum);
}
[5,3,2,6] * sumatory_first_array
[5,3,2,6] ** sumatory_all_parameters
[
    [5,0],
    [3,0],
    [1,1],
    [6,0],
] *** sumatory_first_array * sumatory_first_array
[
    [5,0],
    [3,0],
    [1,1],
    [6,0],
] **** sumatory_all_parameters * sumatory_first_array
```

# browsie-script

Scripting language oriented to database management.

## Installation

```sh
npm i -s @allnulled/browsie-script
```

## Importation

In node.js:

```js
require("@allnulled/browsie-script");
```

In html:

```js
<script src="node_modules/@allnulled/browsie-script/browsie-script.js"></script>
```

## Usage

### To parse and get the AST

```js
const ast = BrowsieScript.parse(`users?`);
```

Outputs:

```json
{
  "$type": "value",
  "value": {
    "$action": "select",
    "table": "users",
    "filters": null
  },
  "appends": []
}
```

### To parse and get the JS

```js
const js = BrowsieScript.parse(`users?`, { toJavaScript: true });
```

This feature may not yet be implemented.

## Syntax

It is about **insert**, **update**, **delete** and **select**. Else, we can **pipe**.

### To insert

```
users+{}
users+{"name":"admin","password":"admin"}
users+[{},{},{}]
```

### To update

```
users={changed:true}
users:1={name:"admin changed"}
users:"admin"={name:"admin changed"}
users:id=1={name:"admin changed"}
users:name="admin" and password="admin"={name:"admin changed"}
```

### To delete

```
users-1
users-"admin"
users-id=1
users-id=1
```

### To select

```
users?
users:1?
users:"admin"?
users:name="admin"?
users:name="admin" or email="admin"?
users:name="admin"|email="admin"?
users:name="admin" and email="admin"?
users:name="admin"&email="admin"?
```

### To pipe

We have 3 types of pipe:

 - **(Level 1) Modifying.** Symbol: `>`. Used to modify the value.
 - **(Level 2) Exporting.** Symbol: `>>`. Used to export the value to local, global or wherever variable.
 - **(Level 3) Returning.** Symbol: `>>>`. Used to return from the current function.
 - **Call**. One `*`. To pass 1 parameter to a function.
 - **Spread call**. Two `**`. To pass N parameters to a function.
 - **Iterated call**. Three `***`. To map items through a function of 1 parameter. Returns an arrays.
 - **Iterated spread call**. To map items through a function of N parameters. Returns an array always.

```js
sumatory_first_array = function(list) {
    return list.reduce(sum);
}
sumatory_all_parameters = function(...list) {
    return list.reduce(sum);
}
[5,3,2,6] * sumatory_first_array
[5,3,2,6] ** sumatory_all_parameters
[
    [5,0],
    [3,0],
    [1,1],
    [6,0],
] *** sumatory_first_array * sumatory_first_array
[
    [5,0],
    [3,0],
    [1,1],
    [6,0],
] **** sumatory_all_parameters * sumatory_first_array
```





```
users? > $.sort.by.props(_, "created_at", "name", "id")
users:(name="admin"|email="admin")&(id is not null)? > $.sort.by.props(_, "created_at", "name", "id")
users? * console.log
messages+{message:"Hello, world!"}
messages:1? * console.log
```

