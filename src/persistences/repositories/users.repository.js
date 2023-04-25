import UsersDTO from "../DTOs/users.dto.js";
import CurrentDTO from "../DTOs/current.dto.js";

export default class userRepository{
    constructor(dao){
        this.dao = dao
    }

    async createUser(user){
        const userDTO = new UsersDTO(user)
        const userDAO = this.dao.createUser(userDTO)
        return userDAO
    }
    async currentSession(info){
        try {
            const current = new CurrentDTO(await info)
            return current
        } catch (error) {
            console.log(error);
        }
    }
}