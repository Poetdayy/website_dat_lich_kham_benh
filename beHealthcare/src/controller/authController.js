const handleLogin = async (req, res) => {

    const { phoneNumber, password } = req.body;

    // check phoneNumber exist, if exist cac
    if (!phoneNumber || !password) {
        return res.status(500).json({
            code: "1005",
            message: "Parameters are'nt enough!"
        })
    }

    return res.status(200).json({
        message: "Hello word",
        your
    })
}

module.exports = {

}