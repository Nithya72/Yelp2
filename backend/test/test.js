var app = require('../index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;
const api_url = "http://localhost:3001";


it("Test Get All Upcoming Events", function (done) {
    chai
        .request(api_url)
        .get("/customer/allevents")
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body[3].EventName).to.equal("E.A.T (Engage & Taste)");
            done();
        });
});

it("Test - Get All Events Posted", function (done) {
    chai
        .request(api_url)
        .post("/restaurant/events")
        .send({ id: "5f99fd4bc64ebfa87f419d75" })
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body[1].EventHashtag).to.equal("#LocalAdventureChallenge");
            done();
        });
});

it("Test - Customer Orders", function (done) {
    chai
        .request(api_url)
        .get("/customer/orders/5f99fa26eef70002be8acba5")
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body[0].Restaurant.RestName).to.equal("The Cheesecake Factory");
            done();
        });
});

it("Test - Load Messages", function (done) {
    chai
        .request(api_url)
        .get("/customer/message/5f99fa26eef70002be8acba5")
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body[2].customers[0].name).to.equal("Nithya Anbalagan");
            done();
        });
});

it("Test - All Yelp Users", function (done) {
    chai
        .request(api_url)
        .get("/customer/yelp/users/5f99fa26eef70002be8acba5")
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});
