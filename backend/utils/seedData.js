const Event = require("../models/Event");

const sampleEvents = [
  {
    title: "Live Jazz Night at Blue Moon",
    category: "Music",
    city: "Chennai",
    dateTime: new Date("2026-10-20T19:30:00"),
    price: 800,
    description:
      "Experience an evening of smooth jazz with local artists. Enjoy cocktails and live performances in an intimate setting.",
    imageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
    isActive: true,
  },
  {
    title: "Weekend Coding Workshop",
    category: "Workshop",
    city: "Bangalore",
    dateTime: new Date("2026-10-25T10:00:00"),
    price: 1500,
    description:
      "Learn full-stack web development in this intensive 2-day workshop. Covers React, Node.js, and MongoDB basics.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    isActive: true,
  },
  {
    title: "Street Food Festival 2026",
    category: "Food",
    city: "Mumbai",
    dateTime: new Date("2026-10-18T17:00:00"),
    price: 0,
    description:
      "Taste the best street food from across India. Over 50 food stalls featuring local delicacies and international cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    isActive: true,
  },
  {
    title: "Cricket Championship Finals",
    category: "Sports",
    city: "Delhi",
    dateTime: new Date("2026-10-30T14:00:00"),
    price: 500,
    description:
      "Watch the thrilling finals of the local cricket championship. Two top teams competing for the trophy.",
    imageUrl:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    isActive: true,
  },
  {
    title: "Kids Science Fair",
    category: "Kids",
    city: "Pune",
    dateTime: new Date("2026-10-22T11:00:00"),
    price: 200,
    description:
      "Interactive science experiments and demonstrations for children. Learn through fun activities and games.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    isActive: true,
  },
  {
    title: "Classical Music Concert",
    category: "Music",
    city: "Coimbatore",
    dateTime: new Date("2026-11-05T18:00:00"),
    price: 1200,
    description:
      "An evening of classical Indian music featuring renowned artists. Experience the beauty of traditional ragas.",
    imageUrl:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800",
    isActive: true,
  },
  {
    title: "Photography Workshop for Beginners",
    category: "Workshop",
    city: "Hyderabad",
    dateTime: new Date("2026-11-10T09:00:00"),
    price: 2500,
    description:
      "Master the basics of photography. Learn composition, lighting, and camera settings from professional photographers.",
    imageUrl:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
    isActive: true,
  },
  {
    title: "Organic Food Market",
    category: "Food",
    city: "Chennai",
    dateTime: new Date("2026-11-12T08:00:00"),
    price: 0,
    description:
      "Fresh organic produce directly from local farmers. Support sustainable agriculture and eat healthy.",
    imageUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
    isActive: true,
  },
  {
    title: "Marathon 2026",
    category: "Sports",
    city: "Bangalore",
    dateTime: new Date("2026-11-15T06:00:00"),
    price: 300,
    description:
      "Join thousands of runners in this annual marathon event. 5K, 10K, and full marathon categories available.",
    imageUrl:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
    isActive: true,
  },
  {
    title: "Children's Art Exhibition",
    category: "Kids",
    city: "Mumbai",
    dateTime: new Date("2026-11-20T10:00:00"),
    price: 0,
    description:
      "Showcase of amazing artwork created by children aged 5-15. Paintings, sculptures, and mixed media.",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    isActive: true,
  },
  {
    title: "Rock Band Night",
    category: "Music",
    city: "Pune",
    dateTime: new Date("2026-11-25T20:00:00"),
    price: 600,
    description:
      "High-energy rock music performances by local bands. Get ready to headbang and enjoy the night.",
    imageUrl:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800",
    isActive: true,
  },
  {
    title: "Pottery Making Workshop",
    category: "Workshop",
    city: "Delhi",
    dateTime: new Date("2026-10-28T15:00:00"),
    price: 1800,
    description:
      "Learn the ancient art of pottery. Create your own ceramic pieces with guidance from expert potters.",
    imageUrl:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
    isActive: true,
  },
  {
    title: "Wine and Cheese Tasting",
    category: "Food",
    city: "Bangalore",
    dateTime: new Date("2026-09-15T19:00:00"),
    price: 2000,
    description:
      "Sample premium wines paired with artisanal cheeses. Learn about wine varieties and tasting techniques.",
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
    isActive: false,
  },
  {
    title: "Summer Camp for Kids",
    category: "Kids",
    city: "Chennai",
    dateTime: new Date("2026-09-20T09:00:00"),
    price: 5000,
    description:
      "One week summer camp with sports, arts, crafts, and outdoor activities. Make new friends and learn new skills.",
    imageUrl:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800",
    isActive: false,
  },
  {
    title: "Badminton Tournament",
    category: "Sports",
    city: "Coimbatore",
    dateTime: new Date("2026-12-01T07:00:00"),
    price: 400,
    description:
      "Annual badminton tournament for all age groups. Singles and doubles categories with exciting prizes.",
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
    isActive: true,
  },
];

const seedEvents = async () => {
  try {
    const count = await Event.countDocuments();

    if (count === 0) {
      await Event.insertMany(sampleEvents);
      console.log("Sample events seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding events:", error);
  }
};

module.exports = seedEvents;
