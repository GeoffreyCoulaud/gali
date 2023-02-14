from os import scandir, DirEntry
from pathlib import PurePath
from typing import Any


class FIFO():
    """A class representing a FIFO queue"""

    __items: list = []

    def is_empty(self) -> bool:
        """Check if the queue is empty"""
        return len(self.__items) == 0

    def add(self, item: Any) -> None:
        """Add element at the end of the queue"""
        self.__items.append(item)

    def top(self) -> Any:
        """Get the first element of the queue"""
        return self.__items[0]

    def pop(self) -> Any:
        """Remove and get the first element of the queue"""
        return self.__items.pop(0)


class DeepDirEntry():
    """A wrapper for os.DirEntry that contains depth information"""

    dirent: DirEntry
    depth: int = 0

    def __init__(self, dirent, depth) -> None:
        self.dirent = dirent
        self.depth = depth


def deep_find_files(root, max_depth, extensions) -> list[str]:
    """Recursively find files of an extension inside a root directory"""

    paths: list[str] = []
    fifo = FIFO()

    # Read root dir
    for dirent in scandir(root):
        deep_dirent = DeepDirEntry(dirent, 0)
        fifo.add(deep_dirent)

    # Read the queue
    while not fifo.is_empty():
        top: DeepDirEntry = fifo.pop()

        # Entry is file
        if top.dirent.is_file():
            ext = PurePath(top.dirent.name).suffix
            if ext not in extensions:
                continue
            paths.append(top.dirent.path)

        # Entry is dir
        if top.dirent.is_dir():
            if top.depth >= max_depth:
                continue
            for dirent in scandir(top.dirent.path):
                fifo.add(DeepDirEntry(dirent, top.depth + 1))

    return paths
