export class AvatarGenerator {
  generateAvatarPath(dbUrl: string | null, host: string): string | null {
    if (!dbUrl) {
      return null;
    }
    return `http://${host}/public/avatars/${dbUrl}`;
  }
}
