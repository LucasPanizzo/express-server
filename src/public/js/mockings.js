import { faker } from "@faker-js/faker";

export function generateProducts() {
    const products = [];
    const uniqueTitles = new Set()
    for(let i = 1; i < 101; i++) {
        const title = faker.commerce.productName()
        if (uniqueTitles.has(title)) {
            continue
        }
        uniqueTitles.add(title)
        const mockingProducts = {
            title,
            description: faker.commerce.productDescription(),
            code: faker.random.alpha(4),
            price: faker.commerce.price(500, 4000, 0),
            status: true,
            stock: faker.random.numeric(2),
            category: faker.commerce.department(),
            thumbnails: faker.image.imageUrl(),
        }
        products.push(mockingProducts)
    }
    return products;
}





