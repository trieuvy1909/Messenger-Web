

module.exports = {
    authorize:  (req,res,next) => {
        if(!req.session.user) {
            return res.redirect("/login")
        }
        next()
    },

    isLogin: (req,res,next) => {
        if(req.session.user) {
            return res.redirect("/")
        }
        next()
    }
}