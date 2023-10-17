let SERVER_NAME = 'clinic-api'
let PORT = 3000;
let HOST = '127.0.0.1';

const mongoose = require ("mongoose");
let uristring = 'mongodb://127.0.0.1:27017/CLINIC';

// Connect to MongoDB
mongoose.connect(uristring, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("**** Connected to db: " + uristring)
});

// Create patient schema
const patientSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    address: String,
    date_of_birth: String,
    department: String,
    doctor: String
});

// Compiles the schema into a model, opening (or creating, if nonexistent) the 'patients' collection in the MongoDB database
let PatientsModel = mongoose.model('patients', patientSchema);

let errors = require('restify-errors');
let restify = require('restify')
    // Create the restify server
    , server = restify.createServer({ name: SERVER_NAME})

    server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('**** Resources: ****')
    console.log(' /patients')
    console.log(' /patients/:id')
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all patients
server.get('/patients', function (req, res, next) {
    console.log('GET /patients params=>' + JSON.stringify(req.params));

    // Find every entity in db
    PatientsModel.find({})
        .then((patients)=>{
            // Return all of the patients
            res.send(patients);
            return next();
        })
        .catch((error)=>{
            return next(new Error(JSON.stringify(error.errors)));
        });
})

// Get a single patient by id
server.get('/patients/:id', function (req, res, next) {
    console.log('GET /patients/:id params=>' + JSON.stringify(req.params));

    // Find a single patient by their id in db
    PatientsModel.findOne({ _id: req.params.id })
        .then((patient)=>{
            console.log("Found patient: " + patient);
            if (patient) {
                // Send the patient if found
                res.send(patient)
            } else {
                // Send 404 statu code if the patient doesn't exist
                res.send(404)
            }
            return next();
        })
        .catch((error)=>{
            console.log("error: " + error);
            return next(new Error(JSON.stringify(error.errors)));
        });
})
