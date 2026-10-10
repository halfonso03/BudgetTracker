type User = {
    id: string
    firstName: string,
    lastName: string,
    email: string,
    roles: []
}


type LoginResponse = User & {};