module.exports= function statusCheck(req, res, next) {
    console.log("All Good at status");
    res.send({valid : 1, comment: "All good"})
}