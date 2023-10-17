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

//adding a new patient
server.post('/patients', function (req, res, next) {
    console.log('POST /patients params=>' + JSON.stringify(req.params));
    console.log('POST /patients body=>' + JSON.stringify(req.body));

    //validation using the patients model structure
    if (req.body.first_name === undefined) {
        return next(new errors.BadRequestError('You did not provide the First Name!!'))
    }
    if (req.body.last_name === undefined) {
        return next(new errors.BadRequestError('You did not provide the Last Name!!'))
    }
    if (req.body.address === undefined) {
        return next(new errors.BadRequestError('You did not provide the Home Address!!'))
    }
    if (req.body.date_of_birth === undefined) {
        return next(new errors.BadRequestError('You did not provide the Date of Birth!!'))
    }
    if (req.body.department === undefined) {
        return next(new errors.BadRequestError('You did not provide the Department visited!!'))
    }
    if (req.body.doctor === undefined) {
        return next(new errors.BadRequestError('You did not provide the name of the Doctor attending!!'))
    }

    //create a new patient model from the values entered in the body
    let newPatient = new PatientsModel({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        date_of_birth: req.body.date_of_birth,
        department: req.body.department,
        doctor: req.body.doctor
    })

    //save the new patient to the database
    newPatient.save()
        .then((patient) =>{
            console.log("Saved Patient: " + patient);
            // Send the patient if no issues
            res.send(201, patient);
            return next();
        })
        .catch((error)=>{
            console.log("Error Saving the Patient: " + error);
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

//Update the details for a patient
server.put('/patients/:id', function (req, res, next){
    console.log('PUT /patients/:id params=>' + JSON.stringify(req.params));
    console.log('PUT /patients/:id body=>' + JSON.stringify(req.body));

    //validation using the patients model structure
    if (req.body.first_name === undefined) {
        return next(new errors.BadRequestError('You did not provide the First Name!!'))
    }
    else if (req.body.last_name === undefined) {
        return next(new errors.BadRequestError('You did not provide the Last Name!!'))
    }
    else if (req.body.address === undefined) {
        return next(new errors.BadRequestError('You did not provide the Home Address!!'))
    }
    else if (req.body.date_of_birth === undefined) {
        return next(new errors.BadRequestError('You did not provide the Date of Birth!!'))
    }
    else if (req.body.department === undefined) {
        return next(new errors.BadRequestError('You did not provide the Department visited!!'))
    }
    else if (req.body.doctor === undefined) {
        return next(new errors.BadRequestError('You did not provide the name of the Doctor attending!!'))
    }
    else{
        PatientsModel
        .findByIdAndUpdate(
            {_id:req.params.id}, 
            {$set:
                {
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    address:req.body.address,
                    date_of_birth:req.body.date_of_birth,
                    department:req.body.department,
                    doctor:req.body.doctor
                }
            })
        .then((patient)=>{
            console.log("Updated Patient: " + patient);
        })
        .catch((error)=>{
            console.log("Error Updating the Patient: " + error);
            return next(new Error(JSON.stringify(error.errors)));
    });
    }
}) 
