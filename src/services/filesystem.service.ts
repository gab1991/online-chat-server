import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileSystem {
  private readonly filesystem = fs;

  removeFileIfExists(path: string): void {
    if (this.filesystem.existsSync(path)) {
      this.filesystem.unlink(path, (err) => {
        if (err) {
          console.error(`couldn't remove file at ${path}`);
        }
      });
    }
  }
}
