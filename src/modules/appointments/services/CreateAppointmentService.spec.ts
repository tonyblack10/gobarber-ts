import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(
      '83f5cb7b-67df-4157-94a9-ac2237aa7368',
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
