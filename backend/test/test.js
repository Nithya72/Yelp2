var app = require('../index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;
const api_url = "http://localhost:3001";


it("Test Restaurants List", function(done){
chai
    .request(api_url)
    .get("/custLanding")
    .send()
    .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res.body[3].RestName).to.equal("The Cheesecake Factory");
        done();
    });
});


it("Test Orders List", function(done){
chai
    .request(api_url)
    .post("/getOrders")
    .send({
        "id": 1,
        "type": "customer"
    })
    .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res.body[0].OrderDishes).to.equal("Fries,Pasta,Tiramisu");
        done();
    });
});


it("Test Events List", function(done){
    chai
        .request(api_url)
        .post("/getEvents")
        .send({
            "id": 1,
            "user": "customer"
        })
        .end(function(err, res){
            expect(res).to.have.status(200);
            expect(res.body[1].EventId).to.equal(2);
            done();
        });
    });

    


it("Test Event Registration Details", function(done){
    chai
        .request(api_url)
        .post("/getRegisteredEvents")
        .send({
            "customerId": "1"
        })
        .end(function(err, res){
            expect(res).to.have.status(200);
            expect(res.body[0].EventDay).to.equal("Saturday");
            done();
        });
    });

    


it("Test Menu List", function(done){
    chai
        .request(api_url)
        .post("/getMenu")
        .send({
            "restaurantId": "4"
        })
        .end(function(err, res){
            expect(res).to.have.status(200);
            expect(res.body[0].DishName).to.equal("Fries");
            done();
        });
    });
    