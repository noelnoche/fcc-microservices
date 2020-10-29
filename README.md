# Microservices


## Description
Microservices is a suite of web services: Timestamp Converter, Request Header Parser, 
URL Shortener, Image Search Abstract Layer and File Metadata Reader. Each service has an API endpoint 
and returns results in JSON format with the exception of File Metadata Reader.


## Demo + Link
<https://youtu.be/g7ipSi-iz-A>  
<https://ncom.herokuapp.com/>


## Documentation
<https://noelnoche.github.io/fcc-microservices/index.html>


## Development
1. Install MongoDB globally and package.json modules.
2. Open two terminals.
3. Start the MongoDB driver in the first terminal: `mongod --config /usr/local/etc/mongod.conf`
4. Make a new database via the mongo shell in the second terminal: `mongo` then `use DB_NAME`
5. Make two collections:
```sh
	db.createCollection('shrinkray', {capped:true, size:100000, max:100});
	db.createCollection('history', {capped:true, size:100000, max:100});
```
6. Exit the mongo shell (`exit`) and `cd` to the root of the project directory.
7. Start the node server: `npm start`
8. Open the browser: `http://localhost:3000`


## License
Code provided under an **[MIT license](https://github.com/noelnoche/fcc-microservices/blob/main/LICENSE.md)**.
