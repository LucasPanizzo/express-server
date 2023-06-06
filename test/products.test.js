import supertest from "supertest";
import { expect } from "chai";

const request = supertest("http://localhost:3030")

describe('Router de products', function () {
    it('Debería obtener todos los productos al hacer una solicitud GET a /api/products', async function () {
        const response = await request.get('/api/products');
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an('array');
    });

    it('Debería obtener un producto por su ID al hacer una solicitud GET a /api/products/:idProduct', async function () {
        const productId = '6408f949b05ea8b05688fda8';
        const response = await request.get(`/api/products/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Producto encontrado');
        expect(response.body).to.have.property('searchedProduct');
    });

    it('Debería modificar un producto existente al hacer una solicitud PUT a /api/products/:idProduct', async function () {
        const updatedData = {
            title: 'Nuevo título',
        };
        const response = await request
            .put(`/api/products/64668c115a70c158cbed52f6`)
            .send(updatedData);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Producto modificado con exito.');
        expect(response.body).to.have.property('updatedProduct');
    });
});