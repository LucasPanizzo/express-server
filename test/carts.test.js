import supertest from "supertest";
import { expect } from "chai";

const request = supertest("http://localhost:3030");

describe('Router de carts', function () {
    it('Debería obtener todos los carritos al hacer una solicitud GET a /api/carts', async function () {
      const response = await request.get('/api/carts');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Lista de carritos:');
      expect(response.body).to.have.property('carts');
    });
  
    it('Debería obtener un carrito por su ID al hacer una solicitud GET a /api/carts/:cid', async function () {
      const cartId = '643adabebe78be1dfcb3a6be';
      const response = await request.get(`/api/carts/${cartId}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Carrito encontrado');
      expect(response.body).to.have.property('cartProducts');
    });
  
    it('Debería crear un nuevo carrito al hacer una solicitud POST a /api/carts', async function () {
      const response = await request.post('/api/carts');
      expect(response.status).to.equal(200);
      expect(response.text).to.equal('carrito creado con exito');
    });
  
    it('Debería vaciar un carrito al hacer una solicitud DELETE a /api/carts/:cid', async function () {
        const cartId = '6444455e9c340409157f6d4b';
        const response = await request.delete(`/api/carts/${cartId}`);
        expect(response.status).to.equal(200);
        expect(response.text).to.equal('Carrito vaciado con exito.');
      });
  });
  