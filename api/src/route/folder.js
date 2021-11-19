const express = require("express")
const router = express.Router()
const User = require("../model/User")
const Folder = require("../model/Folder")
const auth = require("../authenticate/auth")

// get folder
router.get("/getFolder/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const folder = await Folder.find({ userId })
        res.status(200).json(folder)
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

// get specific folder
router.get("/getActiveFolder/:id", async (req, res) => {
 
    try {
        const id = req.params.id
        const folder = await Folder.find({ _id: id })
        res.status(200).json(folder)
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})



// create folder
router.post("/addFolder/:userId", async (req, res) => {
    try {
        const { foldername } = req.body
        const userId = req.params.userId
        if (!foldername) {
            res.status(522).json("Plz write name of folder")
        }
        const user = await User.findById(userId)
        if (user) {
            const folder = new Folder({ foldername, userId })
            await folder.save()
            res.status(200).json("folder created successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }

    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

// delete folder
router.post("/deleteFolder", async (req, res) => {
    try {
        const { _id } = req.body
        const del = await Folder.findByIdAndDelete(_id)
        if (del) {
            res.status(200).json("folder deleted successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }

    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

// update/rename folder
router.post("/rename", async (req, res) => {
    try {
        const { _id, foldername } = req.body
        if (!foldername) {
            res.status(522).json("plz write folder name")
        }
        else {
            const update = await Folder.findByIdAndUpdate(_id, { foldername })
            if (update) {
                res.status(200).json("folder renamed successfully")
            }
            else {
                res.status(522).json("Opps! something went wrong")
            }
        }

    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

// add photo

router.post("/addImg", async (req, res) => {
    try {
        const { _id, name, path } = req.body
        const add = await Folder.updateOne({ _id }, { $push: { images: { name, path, time: Date.now() } } })
        if (add.acknowledged) {
            res.status(200).json("image added successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})


//update/rename photo
router.post("/renameImg", async (req, res) => {
    try {
        const { _id, imgId, name } = req.body
        const rename = await Folder.updateOne({ _id, "images._id": imgId }, { $set: { "images.$.name": name } })
        if (rename.modifiedCount > 0) {

            res.status(200).json("image renamed successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})
//like img
router.post("/likeImg", async (req, res) => {
    try {
        const { _id, imgId, like } = req.body

        const liked = await Folder.updateOne({ _id, "images._id": imgId }, { $set: { "images.$.like": !like } })
        if (liked.modifiedCount > 0) {
            res.status(200).json("image Liked successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})
//get fav img
router.get("/favouriteImg/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const folders = await Folder.find({ userId })
        res.status(200).json(folders)
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

//get specific photo
router.get("/img/:fid/:imgId", async (req, res) => {
    try {
        const { fid, imgId } = req.params
        const img = await Folder.findOne({ _id: fid, "images._id": imgId })
        if (img) {
            const currentImg = img.images.filter((val) =>
                val._id.toString() === imgId
            )
            res.status(200).json(currentImg[0])
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

// delete photo

router.post("/deleteImg", async (req, res) => {
    try {
        const { _id, imgId } = req.body
        const del = await Folder.updateOne({ _id, "images._id": imgId }, { $pull: { images: { _id: imgId } } })
        if (del.modifiedCount > 0) {
            res.status(200).json("image deleted successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})


module.exports = router