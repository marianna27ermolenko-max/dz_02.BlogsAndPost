export const SETTINGS = {

    PORT: process.env.PORT || 3000,
    MONGO_URL:  process.env.MONGO_URL || 'mongodb://localhost:27017/BlogsAndPosts',
    DB_NAME: process.env.DB_NAME || 'BlogsAndPosts', /* 'back' */
    JWT_SECRET: process.env.JWT_SECRET || "123mary",
    EMAIL: process.env.EMAIL || "maryincubator@mail.ru",
    EMAIL_PASS: process.env.EMAIL_PASS || "gGCS95DU0aIx5GeckgPo",
}


//mongodb://localhost:27017/BlogsAndPosts
//mongodb+srv://admin:nadia2710@cluster0.f5wujpp.mongodb.net/?back=Cluster0