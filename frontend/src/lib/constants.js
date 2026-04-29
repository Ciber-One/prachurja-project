export const WHATSAPP_NUMBER = "911234567890";

export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const getWhatsAppLink = (productName) => {
    const message = encodeURIComponent(
        `Hi, I'm interested in ${productName}. Please share details.`
    );
    return `${WHATSAPP_BASE_URL}?text=${message}`;
};

export const getWhatsAppGenericLink = () => {
    const message = encodeURIComponent(
        "Hi, I'd like to know more about your products. Please share details."
    );
    return `${WHATSAPP_BASE_URL}?text=${message}`;
};

export const BRAND = {
    name: "Prachurja",
    tagline: "Abundance from Assam",
    email: "info@prachurja.in",
    phone: "+91XXXXXXXXXX",
    location: "Assam, India",
};

export const CATEGORIES = [
    {
        name: "Tea",
        slug: "tea",
        description: "Premium Assam tea from the world's finest gardens",
        image: "https://images.pexels.com/photos/9025660/pexels-photo-9025660.jpeg",
    },
    {
        name: "Honey",
        slug: "honey",
        description: "Raw, organic honey from Assam's forests",
        image: "https://images.pexels.com/photos/8500508/pexels-photo-8500508.jpeg",
    },
    {
        name: "Bamboo",
        slug: "bamboo",
        description: "Handcrafted bamboo products by local artisans",
        image: "https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/b619ad1bdb76544f5b9006bcd6ace7e6de697e8280ed5b1b341d78db8b2e933c.png",
    },
    {
        name: "Handloom",
        slug: "handloom",
        description: "Traditional Assamese silk and handwoven textiles",
        image: "https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/e8b55c1fd0d1bd81e5964c7f5b8b0cfe5b24344d76b89b0efdb8bc02bdb66ced.png",
    },
    {
        name: "Rice",
        slug: "rice",
        description: "Aromatic heritage grain from Assam's fertile plains",
        image: "https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/99382bb257a48193c1b8910228654ebacb33a54545cb2fdc34358d321a1984e3.png",
    },
];
