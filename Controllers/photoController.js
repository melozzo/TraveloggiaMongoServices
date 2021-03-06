const Photo = require('./../Models/photo');
const moment = require('moment');


exports.createPhoto = (req, res, next ) => {
        const siteId = req.body.SiteID;
        const fileName = req.body.FileName;
        const dateTaken = req.body.dateTaken;
        const storageUrl = req.body.StorageURL;
        const deviceStoreageUrl = req.body.DeviceStorageURL;
        const caption = req.body.Caption;
        const deleted = req.body.IsDeleted;
        const orientation = req.body.orientationID;

        Photo.findOne().sort({"PhotoID": -1}).select("PhotoID")
        .then( result=>{
                let photoId = result.PhotoID + 1;
                let photo = new Photo({
                      PhotoID:photoId,
                      SiteID: siteId,
                      FileName:fileName,
                      DeviceStorageURL:deviceStorageUrl,
                      DateTaken:dateTaken,
                      Caption:caption,
                      DateAdded:moment().format(),
                      IsDeleted : deleted,
                      StorageURL :storageUrl,
                      orientationID: orientation
                })
                photo.save();
        })
        .then( result => {
                res.status(201).json(result);
        })
        .catch( error=>{
                res.status(500).json(JSON.stringify(error))
        })
};

exports.getList = ( req, res, next ) => {
        const siteId = req.params.siteId;
        Photo.find({"SiteID":parseInt(siteId),IsDeleted:{ $not:{ $eq:true } }})
        .then( photos => {
                res.status(200).json(photos );
        })
        .catch( error => {
              console.log(error)
            res.status(500).json(JSON.stringify(error))
        })

};

exports.getPhoto = (req, res, next)=>{
        const photoId = req.params.photoId;
        Photo.find({"PhotoID":photoId, IsDeleted:{ $not:{ $eq:true } }})
        .then( photo => {
                res.status(200).json(photo );
        })
        .catch( error => {
            res.status(500).json(JSON.stringify(err))
        })
};

exports.updatePhoto = ( req, res, next) =>{
      const photoId = req.params.photoId;
      const siteId = req.body.SiteID;
      const fileName = req.body.FileName;
      const dateTaken = req.body.dateTaken;
      const storageUrl = req.body.StorageURL;
      const deviceStorageUrl = req.body.DeviceStorageURL;
      const caption = req.body.Caption;
      const isDeleted = req.body.IsDeleted;
      const orientation = req.body.orientationID;
      
       Photo.findOne({"PhotoID":photoId})
        .then( result =>{
            result.SiteID = siteId;
            result.FileName = fileName;
            result.StorageURL = storageUrl;
            result.DeviceStorageURL = deviceStorageUrl;
            result.DateTaken = dateTaken;
            result.Caption = caption;
            result.IsDeleted = isDeleted;
            result.orientationID = orientation;
            result.save()
            .then( updatedPhoto =>{
                  res.status(204).json(updatedPhoto);
          })
          .catch( error =>{
                  res.status(500).json(JSON.stringify(error))
          })
        })
       
        .catch( error =>{
                res.status(500).json(JSON.stringify(error))
        })
       
};

exports.deletePhoto = ( req, res, next )=>{
      photoId = req.params.photoId;
      Photo.findOne({"PhotoID":photoId})
        .then( result =>{
            result.IsDeleted = true;
            result.save()
            .then( updatedPhoto =>{
                  res.status(204).json(updatedPhoto);
          })
          .catch( error =>{
                  res.status(500).json(JSON.stringify(error))
          })
        })
       
        .catch( error =>{
                res.status(500).json(JSON.stringify(error))
        })
};