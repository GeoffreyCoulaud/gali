from os import scandir, DirEntry
from pathlib import PurePath
from typing import Any

class FIFO():
	"""A class representing a FIFO queue"""

	__items: list = []

	def is_empty(self) -> bool:
		return len(self.__items) == 0

	def add(self, item: Any) -> None:
		self.__items.append(item)
	
	def top(self) -> Any:
		return self.__items[0]

	def pop(self) -> Any:
		return self.__items.pop(0)

class DeepDirEntry():

	dirent: DirEntry = None
	depth: int = 0

	def __init__(self, dir_entry, depth) -> None:
		self.dirent = dir_entry
		self.depth = depth

def deep_find_files(root, max_depth, extensions) -> list[str]:

	paths: list[str] = []
	fifo = FIFO()

	# Read root dir
	for dir_entry in scandir(root):
		deep_dirent = DeepDirEntry(dir_entry, 0)
		fifo.add(deep_dirent)

	# Read the queue
	while not fifo.is_empty():
		top: DeepDirEntry = fifo.pop()

		# Entry is file
		if top.dir_entry.is_file():
			ext = PurePath(top.dir_entry.name).suffix
			if not (ext in extensions):
				continue
			paths.append(top.dir_entry.path)

		# Entry is dir
		if top.dir_entry.is_dir():
			if top.depth >= max_depth:
				continue
			for dir_entry in scandir(top.dir_entry.path):
				fifo.add(DeepDirEntry(dir_entry, top.depth + 1))

	return paths