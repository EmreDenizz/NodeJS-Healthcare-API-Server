let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

// define base uri for the REST API (lab03) under test
const uri = 'http://127.0.0.1:3000';

// Get all patients
describe("getPatients -> 'GET' to /patients", function(){
    it("should return list of all patients", function(done) {
        chai.request(uri)
            .get('/patients')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Get a patient
describe("getPatient -> 'GET' to /patients:id", function(){
    it("should return the patient", function(done) {
        chai.request(uri)
            .get('/patients/652eba48af46030cc7a28d45')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Filter patients by name
describe("filterPatientsByName -> 'GET' to patients/search/:name", function(){
    it("should return the patient", function(done) {
        chai.request(uri)
            .get('/patients/search/Eddi')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Filter critical patients
describe("getCriticalPatients -> 'GET' to /patients/critical", function(){
    it("should return the critical patients", function(done) {
        chai.request(uri)
            .get('/patients/critical')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Get all tests of a patient
describe("getTests -> 'GET' to /patients/:id/tests", function(){
    it("should return the all tests of the patient", function(done) {
        chai.request(uri)
            .get('/patients/652eba48af46030cc7a28d45/tests')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Get a test
describe("getTest -> 'GET' to /tests/:id", function(){
    it("should return the all tests a the patient", function(done) {
        chai.request(uri)
            .get('/tests/654daeab69f9b38191302b21')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                done();
            });
    });
});

// describe("when we issue a 'POST' to /users with user info", function(){
//     it("should return response with user created", function(done) {
//         chai.request(uri)
//             .post('/users')
//             .field('name', 'Peter Doe')
//             .field('age', 21)
//             .end(function(req, res){
//                 expect(res.status).to.equal(201);
//                 expect(res.text).to.equal('{"name":"Peter Doe","age":"21","_id":"1"}');
//                 done();
//             });
//     });
// });

// describe("when we issue a 'GET' to /users after creating new user", function(){
//     it("should return array with this user", function(done) {
//         chai.request(uri)
//             .get('/users')
//             .end(function(req, res){
//                 expect(res.text).to.equal('[{"name":"Peter Doe","age":"21","_id":"1"}]');
//                 done();
//             });
//     });
// });