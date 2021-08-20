const router = require('express').Router();

router.get('/', async (req, res) => {
    console.log('/ requested')
    
    let photos = await req.storage.getAllPhotos();
 //   console.log(photos)
    res.status(200).send(photos);
});


module.exports = router;