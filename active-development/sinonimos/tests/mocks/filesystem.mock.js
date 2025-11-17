/**
 * Mock File System Operations
 * Provides in-memory file system for testing without actual disk I/O
 */

export class MockFileSystem {
  constructor() {
    this.files = new Map();
    this.directories = new Set(['/']);
    this.operations = [];
    this.shouldFail = false;
    this.failureType = null;
    this.failurePath = null;
  }

  /**
   * Mock mkdir - create directory
   */
  async mkdir(path, options = {}) {
    this.operations.push({ type: 'mkdir', path, options, timestamp: new Date() });

    if (this.shouldFail && this._matchesFailurePath(path)) {
      return this._simulateFailure('mkdir', path);
    }

    const normalizedPath = this._normalizePath(path);

    if (options.recursive) {
      const parts = normalizedPath.split('/').filter(Boolean);
      let current = '';
      for (const part of parts) {
        current += '/' + part;
        this.directories.add(current);
      }
    } else {
      if (!this._parentExists(normalizedPath)) {
        throw new Error(`ENOENT: no such file or directory, mkdir '${path}'`);
      }
      this.directories.add(normalizedPath);
    }

    return normalizedPath;
  }

  /**
   * Mock writeFile - write file
   */
  async writeFile(path, data, options = {}) {
    this.operations.push({ type: 'writeFile', path, size: data.length, timestamp: new Date() });

    if (this.shouldFail && this._matchesFailurePath(path)) {
      return this._simulateFailure('writeFile', path);
    }

    const normalizedPath = this._normalizePath(path);

    // Ensure parent directory exists
    const parentDir = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';
    if (!this.directories.has(parentDir)) {
      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    }

    this.files.set(normalizedPath, {
      content: data,
      encoding: options.encoding || 'utf8',
      createdAt: new Date(),
      modifiedAt: new Date()
    });

    return normalizedPath;
  }

  /**
   * Mock readFile - read file
   */
  async readFile(path, options = {}) {
    this.operations.push({ type: 'readFile', path, timestamp: new Date() });

    if (this.shouldFail && this._matchesFailurePath(path)) {
      return this._simulateFailure('readFile', path);
    }

    const normalizedPath = this._normalizePath(path);

    if (!this.files.has(normalizedPath)) {
      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    }

    const file = this.files.get(normalizedPath);
    return options.encoding === 'utf8' || typeof options === 'string'
      ? file.content
      : Buffer.from(file.content);
  }

  /**
   * Mock unlink - delete file
   */
  async unlink(path) {
    this.operations.push({ type: 'unlink', path, timestamp: new Date() });

    if (this.shouldFail && this._matchesFailurePath(path)) {
      return this._simulateFailure('unlink', path);
    }

    const normalizedPath = this._normalizePath(path);

    if (!this.files.has(normalizedPath)) {
      throw new Error(`ENOENT: no such file or directory, unlink '${path}'`);
    }

    this.files.delete(normalizedPath);
    return normalizedPath;
  }

  /**
   * Mock exists - check if path exists
   */
  async exists(path) {
    const normalizedPath = this._normalizePath(path);
    return this.files.has(normalizedPath) || this.directories.has(normalizedPath);
  }

  /**
   * Mock stat - get file/directory stats
   */
  async stat(path) {
    this.operations.push({ type: 'stat', path, timestamp: new Date() });

    const normalizedPath = this._normalizePath(path);

    if (this.files.has(normalizedPath)) {
      const file = this.files.get(normalizedPath);
      return {
        isFile: () => true,
        isDirectory: () => false,
        size: file.content.length,
        mtime: file.modifiedAt,
        ctime: file.createdAt
      };
    }

    if (this.directories.has(normalizedPath)) {
      return {
        isFile: () => false,
        isDirectory: () => true,
        size: 0,
        mtime: new Date(),
        ctime: new Date()
      };
    }

    throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
  }

  /**
   * Mock readdir - read directory contents
   */
  async readdir(path) {
    this.operations.push({ type: 'readdir', path, timestamp: new Date() });

    const normalizedPath = this._normalizePath(path);

    if (!this.directories.has(normalizedPath)) {
      throw new Error(`ENOENT: no such file or directory, scandir '${path}'`);
    }

    const contents = new Set();

    // Add files in this directory
    for (const [filePath] of this.files) {
      if (this._isDirectChild(normalizedPath, filePath)) {
        contents.add(this._getBasename(filePath));
      }
    }

    // Add subdirectories
    for (const dirPath of this.directories) {
      if (this._isDirectChild(normalizedPath, dirPath)) {
        contents.add(this._getBasename(dirPath));
      }
    }

    return Array.from(contents);
  }

  /**
   * Mock createWriteStream - returns a mock stream
   */
  createWriteStream(path) {
    const normalizedPath = this._normalizePath(path);
    const chunks = [];

    return {
      write: (chunk) => chunks.push(chunk),
      end: () => {
        this.files.set(normalizedPath, {
          content: Buffer.concat(chunks),
          createdAt: new Date(),
          modifiedAt: new Date()
        });
      },
      on: (event, handler) => {
        if (event === 'finish') {
          setTimeout(handler, 10);
        }
        return this;
      },
      close: () => {}
    };
  }

  // === Test Helper Methods ===

  /**
   * Configure mock to fail
   */
  setFailure(shouldFail, type = 'permission', path = null) {
    this.shouldFail = shouldFail;
    this.failureType = type;
    this.failurePath = path;
  }

  /**
   * Reset mock state
   */
  reset() {
    this.files.clear();
    this.directories.clear();
    this.directories.add('/');
    this.operations = [];
    this.shouldFail = false;
    this.failureType = null;
    this.failurePath = null;
  }

  /**
   * Get operation statistics
   */
  getStats() {
    const opsByType = {};
    this.operations.forEach(op => {
      opsByType[op.type] = (opsByType[op.type] || 0) + 1;
    });

    return {
      totalOperations: this.operations.length,
      fileCount: this.files.size,
      directoryCount: this.directories.size,
      operationsByType: opsByType,
      history: this.operations
    };
  }

  /**
   * Get all files matching pattern
   */
  getFiles(pattern = null) {
    const files = Array.from(this.files.keys());

    if (!pattern) {
      return files;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return files.filter(path => regex.test(path));
  }

  /**
   * Seed file system with initial data
   */
  seed(structure) {
    for (const [path, content] of Object.entries(structure.files || {})) {
      const normalizedPath = this._normalizePath(path);
      const parentDir = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';

      // Ensure parent exists
      this.directories.add(parentDir);

      this.files.set(normalizedPath, {
        content: content,
        createdAt: new Date(),
        modifiedAt: new Date()
      });
    }

    for (const dir of structure.directories || []) {
      this.directories.add(this._normalizePath(dir));
    }
  }

  // === Private Helper Methods ===

  _normalizePath(path) {
    let normalized = path.replace(/\\/g, '/');
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    return normalized.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  _parentExists(path) {
    const parent = path.substring(0, path.lastIndexOf('/')) || '/';
    return this.directories.has(parent);
  }

  _isDirectChild(parentPath, childPath) {
    if (parentPath === childPath) return false;

    const parent = parentPath === '/' ? '/' : parentPath + '/';
    if (!childPath.startsWith(parent)) return false;

    const remainder = childPath.substring(parent.length);
    return !remainder.includes('/');
  }

  _getBasename(path) {
    return path.substring(path.lastIndexOf('/') + 1);
  }

  _matchesFailurePath(path) {
    if (!this.failurePath) return true;
    const normalizedPath = this._normalizePath(path);
    const normalizedFailurePath = this._normalizePath(this.failurePath);
    return normalizedPath.includes(normalizedFailurePath);
  }

  _simulateFailure(operation, path) {
    switch (this.failureType) {
      case 'permission':
        throw new Error(`EACCES: permission denied, ${operation} '${path}'`);
      case 'disk_full':
        throw new Error(`ENOSPC: no space left on device, ${operation} '${path}'`);
      case 'readonly':
        throw new Error(`EROFS: read-only file system, ${operation} '${path}'`);
      default:
        throw new Error(`EIO: i/o error, ${operation} '${path}'`);
    }
  }
}

// Factory functions for common test scenarios

export function createMockFileSystem(config = {}) {
  const fs = new MockFileSystem();

  if (config.shouldFail) {
    fs.setFailure(true, config.failureType, config.failurePath);
  }

  if (config.seed) {
    fs.seed(config.seed);
  }

  return fs;
}

export default MockFileSystem;
