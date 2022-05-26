from pathlib import Path
from typing import Union


class GameDir():

	path: Union(str, Path) = None
	depth: int = 0

	def __init__(self, path, depth) -> None:
		self.path = path
		self.depth = depth