export default class CurrentDTO{
    constructor(session){
        this._id = session._id
        this.full_name = `${session.first_name} ${session.last_name}`
        this.first_name = session.first_name
        this.last_name = session.last_name
        this.email = session.email
        this.age = session.age
        this.rol = session.rol
        this.userCart = session.userCart
    }
}