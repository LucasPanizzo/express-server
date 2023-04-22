import UsersDTO from "../DTOs/users.dto.js";

export default class userRepository{
    constructor(dao){
        this.dao = dao
    }

    async createUser(user){
        const userDTO = new UsersDTO(user)
        const userDAO = this.dao.createUser(userDTO)
        return userDAO
    }
}