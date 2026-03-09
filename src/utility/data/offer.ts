interface Products {
    category: string;
    sale: string;
    image: string;
    imageTwo: string;
    oldPrice: number;
    newPrice: number;
    title: string;
    rating: any;
    status: string;
    location: string;
    brand: string;
    sku: number;
    quantity: number;
    id: any;
    itemLeft: any;
}

const offer = [

    {
        title: "Crunchy Banana Chips",
        sale: "",
        image: "/assets/img/new-product/3.jpg",
        imageTwo: "/assets/img/new-product/back-3.jpg",
        category: "Chips",
        oldPrice: '$2.00',
        newPrice: 1,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "",
        sku: 24433,
        timer: "September 30, 2025 19:15:10 PDT",
        id: 3,
        quantity: 1,
        rating: 1,
        status: "In Stock",
        weight: "100g",
    },
    {
        title: "Crunchy Potato Chips",
        sale: "",
        image: "/assets/img/new-product/4.jpg",
        imageTwo: "/assets/img/new-product/back-4.jpg",
        category: "Chips",
        // oldPrice: 22,
        newPrice: 15,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "3 Left",
        sku: 24433,
        timer: "September 10, 2025 19:15:10 PDT",
        id: 4,
        quantity: 1,
        rating: 2,
        status: "Out Of Stock",
        weight: "3Pcs",
    },

    {
        title: "Tomato Ketchup Pack",
        sale: "New",
        image: "/assets/img/new-product/8.jpg",
        imageTwo: "/assets/img/new-product/back-8.jpg",
        category: "Sauces",
        oldPrice: '$22.00',
        newPrice: 9,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "Out Of Stock",
        sku: 24433,
        timer: "September 20, 2025 19:15:10 PDT",
        id: 8,
        quantity: 1,
        rating: 4,
        status: "In Stock",
        weight: "500g",
    },
    {
        title: "Organic dragon fruit",
        sale: "New",
        image: "/assets/img/new-product/9.jpg",
        imageTwo: "/assets/img/new-product/9.jpg",
        category: "Fruit",
        oldPrice: '$27.00',
        newPrice: 5,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "Out Of Stock",
        sku: 24433,
        timer: "September 10, 2025 19:15:10 PDT",
        id: 9,
        quantity: 1,
        rating: 3,
        status: "Out Of Stock",
        weight: "2Pcs",
    },

    {
        title: "Organic Banana",
        sale: "New",
        image: "/assets/img/new-product/16.jpg",
        imageTwo: "/assets/img/new-product/16.jpg",
        category: "Fruit",
        oldPrice: '$10.00',
        newPrice: 9,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "2 Left",
        sku: 24433,
        timer: "September 01, 2025 19:15:10 PDT",
        id: 16,
        quantity: 1,
        rating: 3,
        status: "Out Of Stock",
        weight: "500g",
    },
    {
        title: "Organic Banana",
        sale: "Hot",
        image: "/assets/img/new-product/17.jpg",
        imageTwo: "/assets/img/new-product/17.jpg",
        category: "Vegetable",
        oldPrice: '$22.00',
        newPrice: 15,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "",
        sku: 24433,
        timer: "September 11, 2025 19:15:10 PDT",
        id: 17,
        quantity: 1,
        rating: 4,
        status: "In Stock",
        weight: "500g",
    },

    {
        title: "Organic Banana",
        sale: "Trend",
        image: "/assets/img/new-product/20.jpg",
        imageTwo: "/assets/img/new-product/20.jpg",
        category: "Leaves",
        // oldPrice: 0,
        newPrice: 1,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "Out Of Stock",
        sku: 24433,
        timer: "September 15, 2025 19:15:10 PDT",
        id: 20,
        quantity: 1,
        rating: 5,
        status: "In Stock",
        weight: "2Pcs",
    },

    {
        title: "Organic Banana",
        sale: "",
        image: "/assets/img/new-product/24.jpg",
        imageTwo: "/assets/img/new-product/24.jpg",
        category: "Vegetable",
        oldPrice: '$21.00',
        newPrice: 9,
        location: "In Store",
        brand: "Bhisma Organics",
        itemLeft: "",
        sku: 24433,
        timer: "September 19, 2025 19:15:10 PDT",
        id: 24,
        quantity: 1,
        rating: 5,
        status: "In Stock",
        weight: "12Pcs",
    },
]

export default offer;