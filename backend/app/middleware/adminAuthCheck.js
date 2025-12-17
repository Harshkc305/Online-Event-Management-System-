function AdminAuthCheck(req, res, next) {
    if (req.user.role !== "admin") {
        console.log("Admin access only");
        return res.redirect("/login-page");
    }
    next();
}

module.exports = AdminAuthCheck;
