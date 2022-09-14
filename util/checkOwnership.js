/* Checks to see if the user requesting, updating, or deleting the resource is its owner */

class OwnershipError extends Error {
	constructor() {
		super()
		this.name = 'OwnershipError'
		this.message =
			'You are not authorized to access this resource'
	}
}

module.exports.checkResourceOwner = (req, resource) => {
    // Find task list using the ID
    const owner = resource.owner._id ? resource.owner._id : resource.owner

    console.log('REQ.USER:', req.user)
    console.log('resource:', resource)
    console.log(req.user._id == owner)
    // Compare the task list's owner id to the ownerID passed in
    if(req.user._id != owner)
    {
        throw new OwnershipError()
    }
}

module.exports.checkTaskOwner = (ownerId, taskId) => {

}