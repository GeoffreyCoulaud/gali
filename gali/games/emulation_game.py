from ctypes import Union
from pathlib import Path
from gali.games.game import Game

class EmulationGame(Game):
	"""A class representing emulation games"""

	game_path: Union(str, Path) = None

	def __init__(self, name, game_path) -> None:
		super().__init__(name)
		self.game_path = game_path
