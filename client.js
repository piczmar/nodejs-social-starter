var restify = require('restify');
var server = require('./server');
 
var client = restify.createJsonClient({
    url: 'http://localhost:3000'
});
 
// a static product to CREATE READ UPDATE DELETE
 
var testProduct = {
    id: "1",
    name: "Apple iPad AIR",
    os: "iOS 7, upgradable to iOS 7.1",
    chipset: "Apple A7",
    cpu: "Dual-core 1.3 GHz Cyclone (ARM v8-based)",
    gpu: "PowerVR G6430 (quad-core graphics)",
    sensors: "Accelerometer, gyro, compass",
    colors: "Space Gray, Silver"
};
 // to see the output when you the run the client, A nested async callback system to do the above steps
console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
client.get('/products', function (err, req, res, products) {
    if (err) console.log("Oops : ", err);
    else console.log('Total products : ', products.length);
    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
 
    client.post('/product', testProduct, function (err, req, res, prod) {
        if (err) console.log("Oops : ", err);
        else console.log('Inserted product : ', prod);
        console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
 
        client.get('/product/' + testProduct.id, function (err, req, res, prod) {
            if (err) console.log("Oops : ", err);
            else console.log('Product with ID :' + testProduct.id + ' :: ', prod);
            console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
 
            client.put('/product/' + testProduct.id, {
                price: "999 USD"
            }, function (err, req, res, status) {
                if (err) console.log("Oops : ", err);
                else console.log('Product Updated status :', status);
                console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
 
                client.get('/product/' + testProduct.id, function (err, req, res, prod) {
                    if (err) console.log("Oops : ", err);
                    else console.log('Product with ID :' + testProduct.id + ' :: ', prod);
                    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
 
                    client.del('/product/' + testProduct.id, function (err, req, res, status) {
                        if (err) console.log("Oops : ", err);
                        else console.log('Product deleted status :', status);
                        console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
                        client.get('/products', function (err, req, res, products) {
                            if (err) console.log("Oops : ", err);
                            else console.log('Total products : ', products.length);
                            console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");  
                        });
 
                    });
                });
            });
        });
    });
});