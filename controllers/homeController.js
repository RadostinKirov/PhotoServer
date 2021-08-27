const router = require('express').Router();

router.get('/', async (req, res) => {
    console.log('/ requested')

    let photos = await req.storage.getAllPhotos();
    
    photos = photos.sort((b, a) => {
        let dateA = a.createdAt.slice(3);
        let dateB = b.createdAt.slice(3);
        console.log('-> ',dateA);
        return dateA.localeCompare(dateB)
    }
    );

    
  

    res.status(200).send(photos);
});


module.exports = router;