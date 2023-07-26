import { ActiveUser } from './active-user.interface';

export interface PresenceServiceInterface {
  getActiveUser(id: number): Promise<ActiveUser>;
}
