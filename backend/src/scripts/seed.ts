import { PrismaClient, UserRole, PropertyType, PropertyStatus, LeaseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1-555-0001',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created');

  // Create property manager
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      password: managerPassword,
      firstName: 'John',
      lastName: 'Manager',
      phone: '+1-555-0002',
      role: UserRole.PROPERTY_MANAGER,
    },
  });
  console.log('✅ Property manager created');

  // Create landlord
  const landlordPassword = await bcrypt.hash('landlord123', 12);
  const landlord = await prisma.user.create({
    data: {
      email: 'landlord@example.com',
      password: landlordPassword,
      firstName: 'Sarah',
      lastName: 'Landlord',
      phone: '+1-555-0003',
      role: UserRole.LANDLORD,
    },
  });
  console.log('✅ Landlord created');

  // Create tenants
  const tenant1Password = await bcrypt.hash('tenant123', 12);
  const tenant1 = await prisma.user.create({
    data: {
      email: 'tenant1@example.com',
      password: tenant1Password,
      firstName: 'Mike',
      lastName: 'Tenant',
      phone: '+1-555-0004',
      role: UserRole.TENANT,
    },
  });

  const tenant2Password = await bcrypt.hash('tenant123', 12);
  const tenant2 = await prisma.user.create({
    data: {
      email: 'tenant2@example.com',
      password: tenant2Password,
      firstName: 'Lisa',
      lastName: 'Smith',
      phone: '+1-555-0005',
      role: UserRole.TENANT,
    },
  });
  console.log('✅ Tenants created');

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      name: 'Sunset Apartments Unit 101',
      address: '123 Main Street, Unit 101',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      type: PropertyType.APARTMENT,
      status: PropertyStatus.OCCUPIED,
      bedrooms: 2,
      bathrooms: 1.5,
      sqft: 850,
      rent: 2500,
      deposit: 2500,
      description: 'Beautiful 2-bedroom apartment in the heart of the city with modern amenities.',
      amenities: ['Air Conditioning', 'Dishwasher', 'Balcony', 'Parking'],
      petPolicy: 'Small pets allowed with deposit',
      smokingPolicy: 'No smoking',
      ownerId: landlord.id,
      managerId: manager.id,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      name: 'Garden View Townhouse',
      address: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      type: PropertyType.TOWNHOUSE,
      status: PropertyStatus.AVAILABLE,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1200,
      rent: 3200,
      deposit: 3200,
      description: 'Spacious 3-bedroom townhouse with private garden and garage.',
      amenities: ['Garage', 'Garden', 'Fireplace', 'In-unit Laundry'],
      petPolicy: 'Pets allowed',
      smokingPolicy: 'No smoking',
      ownerId: landlord.id,
      managerId: manager.id,
    },
  });

  const property3 = await prisma.property.create({
    data: {
      name: 'Downtown Studio',
      address: '789 Pine Street, Unit 5B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      type: PropertyType.STUDIO,
      status: PropertyStatus.OCCUPIED,
      bedrooms: 0,
      bathrooms: 1,
      sqft: 450,
      rent: 1800,
      deposit: 1800,
      description: 'Cozy studio apartment perfect for urban living.',
      amenities: ['Gym Access', 'Rooftop Deck', 'Concierge'],
      petPolicy: 'No pets',
      smokingPolicy: 'No smoking',
      ownerId: landlord.id,
      managerId: manager.id,
    },
  });
  console.log('✅ Properties created');

  // Create leases
  const lease1 = await prisma.lease.create({
    data: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      monthlyRent: 2500,
      deposit: 2500,
      status: LeaseStatus.ACTIVE,
      terms: 'Standard one-year lease agreement with option to renew.',
      propertyId: property1.id,
      tenantId: tenant1.id,
    },
  });

  const lease2 = await prisma.lease.create({
    data: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
      monthlyRent: 1800,
      deposit: 1800,
      status: LeaseStatus.ACTIVE,
      terms: 'One-year lease for studio apartment.',
      propertyId: property3.id,
      tenantId: tenant2.id,
    },
  });
  console.log('✅ Leases created');

  // Create maintenance requests
  await prisma.maintenanceRequest.create({
    data: {
      title: 'Leaky Faucet in Kitchen',
      description: 'The kitchen faucet has been dripping continuously for the past week.',
      priority: 'HIGH',
      category: 'PLUMBING',
      status: 'PENDING',
      propertyId: property1.id,
      tenantId: tenant1.id,
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      title: 'Air Conditioning Not Working',
      description: 'The AC unit is not cooling properly. Room temperature stays high.',
      priority: 'URGENT',
      category: 'HVAC',
      status: 'IN_PROGRESS',
      propertyId: property3.id,
      tenantId: tenant2.id,
      assignedTo: manager.id,
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      title: 'Light Fixture Replacement',
      description: 'Living room light fixture needs to be replaced.',
      priority: 'LOW',
      category: 'ELECTRICAL',
      status: 'COMPLETED',
      propertyId: property1.id,
      tenantId: tenant1.id,
      assignedTo: manager.id,
      cost: 150,
      completedAt: new Date(),
    },
  });
  console.log('✅ Maintenance requests created');

  // Create payments
  await prisma.payment.create({
    data: {
      amount: 2500,
      type: 'RENT',
      status: 'PAID',
      dueDate: new Date('2024-01-01'),
      paidDate: new Date('2024-01-01'),
      method: 'BANK_TRANSFER',
      description: 'January 2024 rent payment',
      leaseId: lease1.id,
      tenantId: tenant1.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 2500,
      type: 'RENT',
      status: 'PAID',
      dueDate: new Date('2024-02-01'),
      paidDate: new Date('2024-02-01'),
      method: 'CREDIT_CARD',
      description: 'February 2024 rent payment',
      leaseId: lease1.id,
      tenantId: tenant1.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 1800,
      type: 'RENT',
      status: 'PAID',
      dueDate: new Date('2024-02-01'),
      paidDate: new Date('2024-02-01'),
      method: 'ONLINE',
      description: 'February 2024 rent payment',
      leaseId: lease2.id,
      tenantId: tenant2.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 2500,
      type: 'RENT',
      status: 'PENDING',
      dueDate: new Date('2024-03-01'),
      description: 'March 2024 rent payment',
      leaseId: lease1.id,
      tenantId: tenant1.id,
    },
  });
  console.log('✅ Payments created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Sample user accounts created:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Manager: manager@example.com / manager123');
  console.log('Landlord: landlord@example.com / landlord123');
  console.log('Tenant 1: tenant1@example.com / tenant123');
  console.log('Tenant 2: tenant2@example.com / tenant123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });