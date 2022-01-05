export class User {
  idperson : string;
  name: string;
  password: string;
  email: string;
  type: Number;
  token:string;
  class:string;
  constructor(init:User) {
    this.idperson = init.idperson
    this.name = init.name
    this.password = init.password
    this.email = init.email
    this.type = init.type
    this.token = init.token
    this.class = init.class
  }
}
