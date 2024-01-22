const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());



const text = process.argv[2];

client.createTodo({
    "id": -1,
    "text": text
}, (err, res) => {
    console.log("received", JSON.stringify(res));
})

client.readTodos(null, (err, response) => {
    if (response?.items && Array.isArray(response.items)) response.items.forEach(a => console.log(a.text));
})


const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server", JSON.stringify(item));
})

call.on("end", e => console.log("server done"));