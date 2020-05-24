import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
      user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(
      '83f5cb7b-67df-4157-94a9-ac2237aa7368',
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
      user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
        user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
