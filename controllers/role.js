const {response, Router} = require('express');
const Role = require('../models/role');
const {generarJWT} = require('../helpers/jwt');

const getRoles = async (req, res = response) => {
    
    Role.find({}, (err, result) => {
        if (err) return res.json({err:err});
        if(result==null) return res.json({info: []});
        else return res.json({info: result});
    })



    // try {
    //     const rol = await Role.find({})
    // res.status(201).json(rol);
    // } catch (error) {
    //     console.log(error)
    // }  
}

const getUserRoles = async (req, res = response) => {
    
    Role.findOne({}, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({info: []});
        else return res.json({ info: result });
    }).sort({ createdAt: 'desc'});
}

const updateUserRole = async (req, res = response) => {

    const { id } = req.params
    const body = req.body
    Role.updateOne({ _id: id },
        body,
        (err, docs) => {
            if (err) return res.json({ err: err });
            res.send({
                items: docs
            })
        })
}

module.exports = {
    getRoles,
    getUserRoles,
    updateUserRole
}