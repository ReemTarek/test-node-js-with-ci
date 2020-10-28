exports.allAccess = (req,res) =>{

    res.render("home", {"title":"public content"})
}
exports.userBoard = (req,res)=>{
    res.render("home", {"title":"user content"})
}
exports.adminBoard = (req,res)=>{
    res.render("home", {"title":"admin content"})
}
exports.moderatorBoard = (req,res)=>{
    res.render("home", {"title":"moderator content"})
}