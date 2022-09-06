// MIDDLEWARE: Validate user data: empty username, password and email fields, password mismatches, valid email format
module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    // We will store error messages from below here so we can display them on the front-end
    const errors = {}
    // Store password errors
    const passwordErrors = []

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
        errors.password = 'Password must not be empty'
    }
    // If password is not empty, check to see if password meets requirements
    else if(password.length > 0)
    {
        // check if password is at least 8 characters
        if(password.length < 8)
        {
            passwordErrors.push('Password must be at least 8 characters')
        }
        // check if password meets other requirements, if it is at least 8 characters
        else
        {
            // check if password has at least 1 special character
            if(!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))
            {
                passwordErrors.push('Password must include at least 1 special character')
            }
            // check if password has at least 1 uppercase letter
            if(!/[A-Z]/.test(password))
            {
                passwordErrors.push('Password must include at least 1 uppercase letter')
            }
            // check if password has at least 1 number
            if(!/[0-9]/.test(password))
            {
                passwordErrors.push('Password must include at least 1 number')
            }
            // If password does not match confirmPassword
            if(password !== confirmPassword)
            {
                passwordErrors.push('Passwords must match')
                
            }
        }
    }
    
    // If password does not meet requirements, then store in errors object
    if(passwordErrors.length > 0)
    {
        errors.password = passwordErrors
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