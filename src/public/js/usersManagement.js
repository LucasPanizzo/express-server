async function changeRol(userID) {
    try {
        const updatedUser = await fetch(`/api/users/changeRol/${userID}`, { method: "GET" })
        const responseJson = await updatedUser.json();
        alert(responseJson.message)
        location.reload();
    } catch (error) {
        alert("Error users: No se ha podido actualizar el rol,'cause:'Faltan cargar documentos.");
        console.log(error)
    }
}


async function deleteUser(userID) {
    try {
        const deletedUser = await fetch(`/api/users/${userID}`, { method: "DELETE" })
        const responseJson = await deletedUser.json();
        alert(responseJson.message)
        location.reload();
    } catch (error) {
        console.log(error)
    }
}