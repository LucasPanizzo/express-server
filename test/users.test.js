import supertest from "supertest";
import { expect } from "chai";
import './setup.js'

const request = supertest("http://localhost:3030")

const testUser = {
    first_name : "Test",
    last_name : "Test",
    email : "test@test.com",
    password : "tested",
    age : 22
}

describe('Router de users', function () {
  
    it('Debería registrar un nuevo usuario al hacer una solicitud POST a api/users/register', async function () {
      const response = await request.post('/api/users/register').send(testUser);
      expect(response.headers.location).to.be.equal('/')
    });
  
    it('Debería autenticar a un usuario al hacer una solicitud POST a /api/users/login', async function () {
      const response = await request.post('/api/users/login').send({
        email: 'paratestear@test',
        password: 'test'
      });
      expect(response.headers.location).to.equal('/products');
    });
  
    it('Debería cerrar sesión al hacer una solicitud GET a api/users/logout', async function () {
      const response = await request.get('/api/users/logout');
      expect(response.headers.location).to.equal('/');
    });
  });
  