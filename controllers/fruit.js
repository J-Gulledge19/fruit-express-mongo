const express = require('express') // bring this in so we can make our router
const Fruit = require('../models/fruit')


/////
// Create Router  variable to attach rooutes
/////

const router = express.Router() // router will have all routes attached to it


//////////////////////////////////////////////
//////// Actual Routes
///////////////////////////////////////////////

router.use((req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect("/user/login");
    }
  });

router.get('/', (req, res) => {

    // Get all fruits from mongo and send them back
    Fruit.find({username: req.session.username}, (err, fruits) => { // Finds only that users data
        // res.json(fruits)
        res.render('fruits/index.ejs', { fruits, user: req.session.username })
    })
    .catch(err => console.log(err))

})

router.get('/new', (req, res) => {
    res.render('fruits/new.ejs')
})

// create route
router.post("/", (req, res) => {
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // add username to req.body to track related user
    req.body.username = req.session.username
    // create the new fruit
    Fruit.create(req.body, (err, fruit) => {
      // redirect the user back to the main fruits page after fruit created
      res.redirect("/fruits");
    });
  });

router.get('/:id/edit', (req, res) => {

    const id = req.params.id
    // Find the fruit and send it to the edit.ejs  to prepopulate the form
    Fruit.findById(id, (err, foundFruit) => {
        // res.json(foundFruit)
        res.render('fruits/edit.ejs', { fruit: foundFruit })
    })
})

router.put('/:id', (req, res) => {
    
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false

    Fruit.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedFruit) => {
        console.log(updatedFruit)

        res.redirect(`/fruits/${req.params.id}`)
        
    })
})

router.get('/:id', (req, res)=>{

    // Go and get fruit from the database
    Fruit.findById(req.params.id)
    .then((fruit)=> {
        res.render('fruits/show.ejs', {fruit})
    })
})

router.delete('/:id', async (req, res) => {

    // Method 1
    // Fruit.findByIdAndDelete(req.params.id, (err, deletedFruit) => {
    //     console.log(err, deletedFruit)
    //     res.redirect('/fruits')
    // })

    // // Method 2
    // Fruit.findByIdAndDelete(req.params.id)
    // .then((deletedFruit) => {
    //     console.log(err, deletedFruit)
    //     res.redirect('/fruits')
    // })
    // .catch(err => console.log(err))


    // Method 3 async await

    const deletedFruit = await Fruit.findByIdAndDelete(req.params.id)

    if(deletedFruit){
        res.redirect('/fruits/')
    }
})

/////////////
///// export this router to use in other files
//////////////
module.exports = router
