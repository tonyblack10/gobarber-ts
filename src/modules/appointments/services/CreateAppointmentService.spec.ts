import { setHours, addDays, subDays } from 'date-fns';

import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointmentDate = addDays(new Date(), 2);

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => setHours(appointmentDate, 12).getTime());

    const appointment = await createAppointment.execute({
      date: setHours(appointmentDate, 13),
      provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
      user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(
      '83f5cb7b-67df-4157-94a9-ac2237aa7368',
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = setHours(addDays(new Date(), 2), 11);

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

  it('should not be able to create an appointment on the past date', async () => {
    const appointmentDate = setHours(addDays(new Date(), 2), 11);

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => setHours(appointmentDate, 12).getTime());

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
        user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    const appointmentDate = setHours(addDays(new Date(), 2), 13);

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => setHours(appointmentDate, 12).getTime());

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
        user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    const appointmentDate = setHours(addDays(new Date(), 2), 7);

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() =>
        subDays(setHours(appointmentDate, 12), 1).getTime(),
      );

    await expect(
      createAppointment.execute({
        date: setHours(appointmentDate, 7),
        provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
        user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: setHours(appointmentDate, 18),
        provider_id: '83f5cb7b-67df-4157-94a9-ac2237aa7368',
        user_id: 'b6024528-21e9-4b7a-b6d4-ac78b522cf99',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
