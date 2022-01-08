type ActiveSocketMap = { [key: string]: number };

export class OnlineService {
  private activeSockets: ActiveSocketMap = {};
  private onlineUsers = new Set<number>();

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
    delete this.activeSockets[socketId];
  }

  getAllLists(): { activeSockets: ActiveSocketMap; onlineUsers: number[] } {
    return {
      activeSockets: this.activeSockets,
      onlineUsers: Array.from(this.onlineUsers),
    };
  }

  getReversedActiveSocketMap(): Record<string, string> {
    const reversedMap: Record<string, string> = Object.fromEntries(
      Object.entries(this.activeSockets).map((a) => a.reverse())
    );
    return reversedMap;
  }
}
