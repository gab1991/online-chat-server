type ActiveSocketMap = { [key: string]: number };

export class OnlineService {
  private activeSockets: ActiveSocketMap = {};
  private onlineUsers = new Set<number>();

  onConnection(socketId: string): void {
    const prevOnlineProfileId = this.activeSockets[socketId];

    if (prevOnlineProfileId) {
      prevOnlineProfileId && this.onlineUsers.add(prevOnlineProfileId);
    }
  }

  setOnline(socketId: string, profileId: number): void {
    this.activeSockets[socketId] = profileId;
    this.onlineUsers.add(profileId);
  }

  isOnline(profileId: number): boolean {
    return this.onlineUsers.has(profileId);
  }

  setOffline(socketId: string): void {
    const profileId = this.activeSockets[socketId];
    this.onlineUsers.delete(profileId);
  }

  getAllLists() {
    return { activeSockets: this.activeSockets, activeProfiles: Array.from(this.onlineUsers) };
  }
}
