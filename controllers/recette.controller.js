const Recette = require('../models/recette.model');
const JSftp = require("jsftp");


exports.uploadPhoto = (req, res) => {
    if(!req.files.file.data || req.files.file.data === "")
        return res.send({errmsg: 'Vous n\'avez envoyé aucune photo'})

    const ftp = new JSftp({
        host: "ftp.cluster023.hosting.ovh.net",
        port: 21,
        user: "kaktussaao",
        pass: "YnovCampus92"
    });

    ftp.put(req.files.file.data, `./Cookyn/React/${req.files.file.name}`, err => {
        if (!err) {
            res.send("AH OUI !");
        } else {
            res.send({errmsg: `Erreur => ${err}`});
        }
    });
}

// Create and Save a new user
exports.create = (req, res) => {

    const recette = new Recette({
        idUser: req.body.idUser,
        name: req.body.name,
        description: req.body.description,
        steps: req.body.steps,
        ingredients: req.body.ingredients,
        photo: req.body.photo
    });

    let err = recette.joiValidate(req.body);
    if (err.error) res.send({errmsg: `${err.error}`});
    else {
        recette.save()
            .then(data => {
                res.send({
                    name: data.name
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err.message);
            });
    }
};

// Find and return all User from the database.
exports.findAll = (req, res) => {

    console.log("***Quelqu'un appelle findAll recettes");

    Recette.find()
        .then(recettes => {
            res.send(recettes);
        }).catch(err => {
        res.status(500).send({
            errmsg: err.message || "Some error occurred while finding recettes."
        });
    });
};

// Find a single user with id
exports.findOne = (req, res) => {
    Recette.findById(req.params.id)
        .then(recette => {
            if (!recette) {
                return res.status(404).send({
                    message: "Recette not found with id " + req.params.id
                });
            }
            res.send(recette);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Recette not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.id
        });
    });
};

// Update a user
exports.update = (req, res) => {
    Recette.findByIdAndUpdate(req.params.id, {
        idUser: req.body.idUser,
        name: req.body.name,
        description: req.body.description,
        steps: req.body.steps,
        ingredients: req.body.ingredients,
        photo: req.body.photo
    }, {new: true})
        .then(recette => {
            if (!recette) {
                return res.status(404).send({
                    message: "Recette not found with id " + req.params.id
                });
            }
            res.send(recette);
        }).catch(err => {
        if (err.kind === 'id') {
            return res.status(404).send({
                message: "recette not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating recette with id " + req.params.id
        });
    });

};

// Delete a user with the specified userid in the request
exports.delete = (req, res) => {
    Recette.findByIdAndRemove(req.params.id)
        .then(recette => {
            if (!recette) {
                return res.status(404).send({
                    message: "Recette not found with id " + req.params.id
                });
            }
            res.send({message: "Recette deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "recette not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete recette with id " + req.params.id
        });
    });

};