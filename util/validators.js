// MIDDLEWARE: Validate user data: empty username, password and email fields, password mismatches, valid email format
module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    // We will store error messages from below here so we can display them on the front-end
    const errors = {}

    // If username is empty
    if(username.trim() === '')
    {
        errors.username = 'Username must not be empty'
    }
    // If email is empty
    if(email.trim() === '')
    {
        errors.email = 'Email must not be empty'
    }
    // If email is not empty, check to see if it is a valid email format
    else
    {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$)/
        if(!email.match(regEx))
        {
            errors.email = 'Email must be a valid email address.'
        }
    }
    // If password is empty
    if(password === '')
    {
        errors.password = 'Password must no be empty'
    }
    // If password does not match confirmPassword
    else if(password !== confirmPassword)
    {
        errors.confirmPassword = 'Passwords must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1 // If this is true, then there aren't any errors. Data is valid.
    }
}

// MIDDLEWARE: Validate login input
module.exports.validateLoginInput = (username, password) => {
    const errors = {}

    // If username is empty
    if(username.trim() === '')
    {
        errors.username = 'Username must not be empty'
    }
    // If password is empty
    if(password === '')
    {
        errors.password = 'Password must no be empty'
    }

     return {
        errors,
        valid: Object.keys(errors).length < 1 // If this is true, then there aren't any errors. Data is valid.
    }
}