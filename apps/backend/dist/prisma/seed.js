"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const API_BASE = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/';
const HASHED_PASSWORD = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i6rQ8Q1rQ8Q1rQ8Q1rQ8Q1rQ8Q1rQ';
async function fetchData(endpoint) {
    const response = await axios_1.default.get(`${API_BASE}${endpoint}.json`);
    return response.data;
}
async function main() {
    console.log('🌱 Starting seed...');
    try {
        console.log('🌍 Fetching countries data...');
        const countries = await fetchData('countries');
        console.log(`📊 Found ${countries.length} countries to process`);
        const countryData = countries.map(country => ({
            name: country.name,
            code: country.iso2 || country.name.substring(0, 2).toUpperCase(),
            phoneCode: country.phone_code,
            currency: country.currency,
            currencySymbol: country.currency_symbol,
            latitude: country.latitude ? parseFloat(country.latitude) : null,
            longitude: country.longitude ? parseFloat(country.longitude) : null,
            emoji: country.emoji,
            emojiU: country.emojiU,
            flag: country.flag || null,
        }));
        console.log('🌍 Inserting countries...');
        await prisma.country.createMany({
            data: countryData,
            skipDuplicates: true,
        });
        const insertedCountries = await prisma.country.findMany();
        const countryMap = new Map(insertedCountries.map(c => [c.code, c.id]));
        console.log('🏙️ Fetching and processing cities...');
        let totalCities = 0;
        const cities = await fetchData('cities');
        console.log(`📊 Found ${cities.length} cities to process`);
        const citiesByCountry = new Map();
        for (const city of cities) {
            const countryCode = city.country_code;
            if (!citiesByCountry.has(countryCode)) {
                citiesByCountry.set(countryCode, []);
            }
            citiesByCountry.get(countryCode)?.push(city);
        }
        for (const country of countries) {
            const countryCities = citiesByCountry.get(country.iso2) || [];
            const countryId = countryMap.get(country.iso2);
            if (countryId && countryCities.length > 0) {
                const cityData = countryCities.map(city => ({
                    name: city.name,
                    countryId,
                    latitude: city.latitude ? parseFloat(city.latitude) : null,
                    longitude: city.longitude ? parseFloat(city.longitude) : null,
                }));
                await prisma.city.createMany({
                    data: cityData,
                    skipDuplicates: true,
                });
                totalCities += cityData.length;
                console.log(`✅ Added ${cityData.length} cities for ${country.name}`);
            }
        }
        console.log(`\n🌱 Seeding completed successfully!`);
        console.log(`📊 Statistics:`);
        console.log(`   - Countries: ${insertedCountries.length}`);
        console.log(`   - Cities: ${totalCities}`);
        await prisma.storyView.deleteMany();
        await prisma.story.deleteMany();
        await prisma.socialComment.deleteMany();
        await prisma.like.deleteMany();
        await prisma.post.deleteMany();
        await prisma.visitedPlace.deleteMany();
        await prisma.city.deleteMany();
        await prisma.country.deleteMany();
        await prisma.followRequest.deleteMany();
        await prisma.follow.deleteMany();
        await prisma.transportCommentLike.deleteMany();
        await prisma.transportComment.deleteMany();
        await prisma.transportVote.deleteMany();
        await prisma.transportOption.deleteMany();
        await prisma.dateVote.deleteMany();
        await prisma.dateSuggestion.deleteMany();
        await prisma.destinationVote.deleteMany();
        await prisma.destination.deleteMany();
        await prisma.activityVote.deleteMany();
        await prisma.activity.deleteMany();
        await prisma.accommodationVote.deleteMany();
        await prisma.accommodation.deleteMany();
        await prisma.planningActivity.deleteMany();
        await prisma.planning.deleteMany();
        await prisma.predefinedActivity.deleteMany();
        await prisma.projectUser.deleteMany();
        await prisma.travelProject.deleteMany();
        await prisma.verificationToken.deleteMany();
        await prisma.passwordResetToken.deleteMany();
        await prisma.refreshToken.deleteMany();
        await prisma.user.deleteMany();
        await prisma.user.createMany({
            data: [
                {
                    id: 'user1',
                    email: 'pauline@example.com',
                    username: 'pauline',
                    password: HASHED_PASSWORD,
                    bio: 'Globe-trotteuse passionnée',
                    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                },
                {
                    id: 'user2',
                    email: 'yohann@example.com',
                    username: 'yohann',
                    password: HASHED_PASSWORD,
                    bio: 'Aventurier urbain',
                    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                },
                {
                    id: 'user3',
                    email: 'sophie@example.com',
                    username: 'sophie',
                    password: HASHED_PASSWORD,
                    bio: 'Fan de nature et de photo',
                    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
                },
            ],
        });
        await prisma.follow.createMany({
            data: [
                { followerId: 'user1', followingId: 'user2' },
                { followerId: 'user2', followingId: 'user1' },
                { followerId: 'user1', followingId: 'user3' },
            ],
        });
        await prisma.followRequest.create({
            data: {
                requesterId: 'user3',
                requestedToId: 'user1',
                status: 'PENDING',
            },
        });
        const post1 = await prisma.post.create({
            data: {
                userId: 'user1',
                content: 'Exploring the mountains this summer! 🏔️',
                photos: {
                    create: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b' }],
                },
                likes: {
                    create: [
                        { userId: 'user2' },
                        { userId: 'user3' },
                    ],
                },
                comments: {
                    create: [
                        { userId: 'user2', content: 'Magnifique !' },
                        { userId: 'user3', content: 'Ça donne envie !' },
                    ],
                },
            },
        });
        const post2 = await prisma.post.create({
            data: {
                userId: 'user2',
                content: 'City break à Barcelone 👌',
                photos: {
                    create: [{ url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4' }],
                },
                likes: {
                    create: [
                        { userId: 'user1' },
                    ],
                },
                comments: {
                    create: [
                        { userId: 'user1', content: 'Profite bien !' },
                    ],
                },
            },
        });
        const story1 = await prisma.story.create({
            data: {
                userId: 'user1',
                content: 'Coucher de soleil à Paris',
                photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        await prisma.storyView.create({
            data: {
                storyId: story1.id,
                userId: 'user2',
                viewedAt: new Date(),
            },
        });
        const firstCountry = await prisma.country.findFirst();
        const firstCountryCities = await prisma.city.findMany({
            where: { countryId: firstCountry?.id },
            take: 2
        });
        if (firstCountry && firstCountryCities.length >= 2) {
            await prisma.visitedPlace.createMany({
                data: [
                    {
                        userId: 'user1',
                        countryId: firstCountry.id,
                        cityId: firstCountryCities[0].id,
                        visitedAt: new Date('2023-08-15'),
                        rating: 5,
                        review: 'Paris, toujours magique !',
                    },
                    {
                        userId: 'user2',
                        countryId: firstCountry.id,
                        cityId: firstCountryCities[1].id,
                        visitedAt: new Date('2023-07-10'),
                        rating: 4,
                        review: 'Lyon, super pour la gastronomie.',
                    },
                ],
            });
        }
        const project = await prisma.travelProject.create({
            data: {
                title: 'Islande',
                description: 'Road trip entre amis',
                creatorId: 'user1',
                shareCode: 'ISL2024',
                status: 'PLANNING',
                currentStep: 'ACTIVITIES',
                participants: {
                    create: [
                        { userId: 'user1', role: 'ADMIN' },
                        { userId: 'user2', role: 'MEMBER' },
                        { userId: 'user3', role: 'MEMBER' },
                    ],
                },
                destinations: {
                    create: [
                        { name: 'Reykjavik', addedBy: 'user1' },
                        { name: 'Blue Lagoon', addedBy: 'user2' },
                    ],
                },
                activities: {
                    create: [
                        { title: 'Randonnée sur glacier', description: 'Expérience unique', addedBy: 'user1' },
                        { title: 'Baignade dans les sources chaudes', description: 'Relaxation', addedBy: 'user2' },
                    ],
                },
                dateSuggestions: {
                    create: [
                        { startDate: new Date('2024-08-15'), endDate: new Date('2024-08-22'), addedBy: 'user1', isSelected: true },
                    ],
                },
                transportOptions: {
                    create: [
                        { type: 'PLANE', departure: 'Paris', arrival: 'Reykjavik', date: new Date('2024-08-15T08:00:00Z'), price: 350.00, company: 'Icelandair', addedBy: 'user1' },
                    ],
                },
                accommodations: {
                    create: [
                        { name: 'Hotel Reykjavik', address: 'Centre-ville', price: 120.00, type: 'HOTEL' },
                    ],
                },
                plannings: {
                    create: [
                        { name: 'Planning Islande', description: 'Planning du road trip en Islande' },
                    ],
                },
            },
            include: {
                participants: true,
                destinations: true,
                activities: true,
                dateSuggestions: true,
                transportOptions: true,
                accommodations: true,
                plannings: true,
            },
        });
        await prisma.destinationVote.create({
            data: {
                projectId: project.id,
                destinationId: project.destinations[0].id,
                userId: 'user2',
                vote: true,
            },
        });
        await prisma.dateVote.create({
            data: {
                projectId: project.id,
                dateId: project.dateSuggestions[0].id,
                userId: 'user3',
                vote: true,
            },
        });
        await prisma.activityVote.create({
            data: {
                projectId: project.id,
                activityId: project.activities[0].id,
                userId: 'user2',
                vote: true,
            },
        });
        await prisma.accommodationVote.create({
            data: {
                projectId: project.id,
                accommodationId: project.accommodations[0].id,
                userId: 'user3',
                vote: true,
            },
        });
        await prisma.transportVote.create({
            data: {
                projectId: project.id,
                transportId: project.transportOptions[0].id,
                userId: 'user2',
                vote: true,
            },
        });
        const predefined = await prisma.predefinedActivity.create({
            data: {
                name: 'Observation des aurores boréales',
                description: 'Sortie nocturne pour observer les aurores',
                category: 'Nature',
            },
        });
        await prisma.planningActivity.create({
            data: {
                projectId: project.id,
                planningId: project.plannings[0].id,
                activityId: project.activities[0].id,
                date: new Date('2024-08-16'),
                startTime: new Date('2024-08-16T09:00:00Z'),
                endTime: new Date('2024-08-16T12:00:00Z'),
                notes: 'Prévoir des vêtements chauds',
            },
        });
        await prisma.verificationToken.create({
            data: {
                userId: 'user1',
                token: 'verif-token-123',
                type: 'EMAIL_VERIFICATION',
                expiresAt: new Date(Date.now() + 3600 * 1000),
            },
        });
        await prisma.passwordResetToken.create({
            data: {
                userId: 'user2',
                token: 'reset-token-456',
                type: 'PASSWORD_RESET',
                expiresAt: new Date(Date.now() + 3600 * 1000),
            },
        });
        await prisma.refreshToken.create({
            data: {
                userId: 'user3',
                token: 'refresh-token-789',
                type: 'REFRESH',
                device: 'web',
                expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
            },
        });
        console.log('🌱 Ultra-exhaustive seeding finished.');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map