module.exports = (req, res, next) => {
    console.log('REQ.METHOD: ', req.method)
    console.log('REQ.URL: ', req.url)
    console.log('REQ.BODY: ', req.body)

    next()
}