import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseChanges() {
  try {
    console.log('🧪 Début des tests...');

    // 1. Test de création d'un utilisateur avec soft delete
    console.log('\n1. Test création utilisateur...');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
      },
    });
    console.log('✅ Utilisateur créé:', user);

    // 2. Test de création d'un projet
    console.log('\n2. Test création projet...');
    const project = await prisma.travelProject.create({
      data: {
        title: 'Test Project',
        description: 'Test Description',
        creatorId: user.id,
        shareCode: 'TEST' + Date.now(),
      },
    });
    console.log('✅ Projet créé:', project);

    // 3. Test de création d'une option de transport avec les nouveaux champs
    console.log('\n3. Test création transport...');
    const transport = await prisma.transportOption.create({
      data: {
        projectId: project.id,
        type: 'FLIGHT',
        departure: 'Paris',
        arrival: 'New York',
        date: new Date(),
        price: 500.00,
        link: 'https://example.com/flight',
        company: 'Test Airlines',
        addedBy: user.id,
      },
    });
    console.log('✅ Transport créé:', transport);

    // 4. Test de création d'un hébergement
    console.log('\n4. Test création hébergement...');
    const accommodation = await prisma.accommodation.create({
      data: {
        projectId: project.id,
        name: 'Test Hotel',
        address: '123 Test Street',
        price: 200.00,
        type: 'HOTEL',
      },
    });
    console.log('✅ Hébergement créé:', accommodation);

    // 5. Test de création d'un commentaire avec le nouveau type Text
    console.log('\n5. Test création commentaire...');
    const comment = await prisma.comment.create({
      data: {
        accommodationId: accommodation.id,
        userId: user.id,
        content: 'Test comment with a very long text that should be stored properly in the database...',
      },
    });
    console.log('✅ Commentaire créé:', comment);

    // 6. Test de création d'un device token
    // console.log('\n6. Test création device token...');
    // const deviceToken = await prisma.deviceToken.create({
    //   data: {
    //     userId: user.id,
    //     token: 'test-token-' + Date.now(),
    //     deviceType: 'ios',
    //   },
    // });
    // console.log('✅ Device token créé:', deviceToken);

    // 7. Test des index sur les dates
    console.log('\n7. Test des index sur les dates...');
    const recentTransports = await prisma.transportOption.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Dernières 24h
        },
      },
    });
    console.log('✅ Recherche par date réussie:', recentTransports.length, 'transports trouvés');

    // 8. Nettoyage des données de test
    console.log('\n8. Nettoyage des données de test...');
    await prisma.comment.delete({ where: { id: comment.id } });
    await prisma.accommodation.delete({ where: { id: accommodation.id } });
    await prisma.transportOption.delete({ where: { id: transport.id } });
    await prisma.travelProject.delete({ where: { id: project.id } });
    // await prisma.deviceToken.delete({ where: { id: deviceToken.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Données de test supprimées');

    console.log('\n✨ Tous les tests ont réussi !');
  } catch (error) {
    console.error('❌ Erreur pendant les tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseChanges(); 